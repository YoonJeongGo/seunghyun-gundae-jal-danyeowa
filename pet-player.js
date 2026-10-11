/** Play the existing 이승현 sprite artwork without changing its pixels. */
export const PET_ATLAS = Object.freeze({
  width: 1536, height: 2288, columns: 8, rows: 11,
  cellWidth: 192, cellHeight: 208,
});

const motion = (row, durations) => Object.freeze({
  row, durations: Object.freeze(durations), count: durations.length,
});

export const PET_STATES = Object.freeze({
  idle: motion(0, [280, 110, 110, 140, 140, 320]),
  'running-right': motion(1, [120, 120, 120, 120, 120, 120, 120, 220]),
  'running-left': motion(2, [120, 120, 120, 120, 120, 120, 120, 220]),
  waving: motion(3, [140, 140, 140, 280]),
  jumping: motion(4, [140, 140, 140, 140, 280]),
  failed: motion(5, [140, 140, 140, 140, 140, 140, 140, 240]),
  waiting: motion(6, [150, 150, 150, 150, 150, 260]),
  running: motion(7, [120, 120, 120, 120, 120, 220]),
  review: motion(8, [150, 150, 150, 150, 150, 280]),
});

const DEFAULT_LABEL = '검은 빡빡머리와 훈련병 군복을 입은 이승현 캐릭터';
const now = () => performance.now();

export class PetPlayer {
  constructor(canvas, {
    src = 'assets/seunghyun.png',
    fallback = 'assets/seunghyun-idle.png',
  } = {}) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new TypeError('PetPlayer requires a canvas element.');
    }
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    if (!this.context) throw new Error('Canvas 2D rendering is unavailable.');
    canvas.width = PET_ATLAS.cellWidth;
    canvas.height = PET_ATLAS.cellHeight;
    this.context.imageSmoothingEnabled = true;
    this.context.imageSmoothingQuality = 'high';
    this.src = src;
    this.fallback = fallback;
    this.status = 'loading';
    this.error = '';
    this._label = canvas.getAttribute('aria-label') || DEFAULT_LABEL;
    canvas.setAttribute('role', canvas.getAttribute('role') || 'img');
    canvas.setAttribute('aria-label', this._label);
    this._disposed = false;
    this._atlas = null;
    this._fallbackImage = null;
    this._state = 'idle';
    this._frame = 0;
    this._lookDirection = null;
    this._remaining = PET_STATES.idle.durations[0];
    this._timer = null;
    this._dueAt = null;
    this._revision = 0;
    this._requested = { name: 'idle', once: false, onComplete: null };
    this._pendingImages = new Set();
    this._media = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
    this._reducedMotion = Boolean(this._media?.matches);
    this._onVisibility = () => this._visibilityChanged();
    this._onMotion = event => this._motionChanged(Boolean(event.matches));
    document.addEventListener('visibilitychange', this._onVisibility);
    if (this._media?.addEventListener) {
      this._media.addEventListener('change', this._onMotion);
    } else {
      this._media?.addListener?.(this._onMotion);
    }
    this._setStatus('loading');
    this.ready = this.load();
  }

  get state() { return this._state; }
  get frame() { return this._frame; }
  get reducedMotion() { return this._reducedMotion; }

  /** Resolves true for the atlas, false for fallback/error/disposal. Never rejects. */
  load() {
    if (this._loadPromise) return this._loadPromise;
    this._loadPromise = this._loadArtwork();
    return this._loadPromise;
  }

  async _loadArtwork() {
    try {
      const image = await this._loadImage(this.src);
      if (this._disposed) return false;
      if (image.naturalWidth !== PET_ATLAS.width || image.naturalHeight !== PET_ATLAS.height) {
        throw new Error('The sprite atlas has unexpected dimensions.');
      }
      this._atlas = image;
      this._setStatus('ready');
      this._applyRequested();
      return true;
    } catch {
      if (this._disposed) return false;
      try {
        this._fallbackImage = await this._loadImage(this.fallback);
        if (this._disposed) return false;
        this.error = '애니메이션을 불러오지 못해 정지 이미지로 보여 드립니다.';
        this._setStatus('degraded');
      } catch {
        if (this._disposed) return false;
        this.error = '캐릭터 이미지를 불러오지 못했습니다. 새로고침해 주세요.';
        this._setStatus('error');
      }
      this._draw();
      this._queueStaticCompletion();
      return false;
    }
  }

  _loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      let finished = false;
      let timeout;
      const settle = (ok, error) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        this._pendingImages.delete(cancel);
        ok ? resolve(image) : reject(error || new Error('Unable to load artwork.'));
      };
      const cancel = () => settle(false, new Error('PetPlayer disposed.'));
      this._pendingImages.add(cancel);
      image.onload = () => settle(Boolean(image.naturalWidth && image.naturalHeight));
      image.onerror = () => settle(false);
      timeout = setTimeout(() => settle(false, new Error('Artwork loading timed out.')), 12000);
      if (!src || this._disposed) return settle(false);
      image.src = src;
    });
  }

  /** Returns false for unsupported states or a disposed player. Last request wins. */
  setState(name, { once = false, onComplete } = {}) {
    if (this._disposed || !Object.hasOwn(PET_STATES, name)) return false;
    this._revision += 1;
    this._requested = {
      name, once: Boolean(once),
      onComplete: typeof onComplete === 'function' ? onComplete : null,
    };
    this._state = name;
    this._frame = 0;
    this._lookDirection = null;
    this._remaining = PET_STATES[name].durations[0];
    this._clearTimer();
    if (this._atlas) this._applyRequested();
    else if (this.status === 'degraded' || this.status === 'error') {
      this._draw();
      this._queueStaticCompletion();
    }
    return true;
  }

  _applyRequested() {
    if (this._disposed || !this._atlas) return;
    this._state = this._requested.name;
    this._frame = 0;
    this._lookDirection = null;
    this._remaining = PET_STATES[this._state].durations[0];
    this._draw();
    if (this._reducedMotion) this._queueStaticCompletion();
    else this._schedule();
  }

  _schedule() {
    if (this._disposed || !this._atlas || this._reducedMotion || document.hidden || this._lookDirection !== null) return;
    this._clearTimer();
    const revision = this._revision;
    this._dueAt = now() + this._remaining;
    this._timer = setTimeout(() => {
      this._timer = null;
      this._dueAt = null;
      if (this._disposed || revision !== this._revision) return;
      this._advance();
    }, this._remaining);
  }

  _advance() {
    if (document.hidden || this._reducedMotion || this._lookDirection !== null) return;
    const state = PET_STATES[this._state];
    if (this._frame === state.count - 1 && this._requested.once) {
      this._finishOnce();
      return;
    }
    this._frame = (this._frame + 1) % state.count;
    this._remaining = state.durations[this._frame];
    this._draw();
    this._schedule();
  }

  _queueStaticCompletion() {
    if (!this._requested.once || this.status === 'loading' || this._disposed) return;
    const revision = this._revision;
    queueMicrotask(() => {
      if (!this._disposed && revision === this._revision && this._requested.once) {
        this._finishOnce();
      }
    });
  }

  _finishOnce() {
    const completed = {
      state: this._state,
      reducedMotion: this._reducedMotion,
      status: this.status,
    };
    const callback = this._requested.onComplete;
    this.setState('idle');
    // The player is already back in a valid idle state if consumer code throws.
    callback?.(completed);
  }

  /** Point the original head poses toward a client coordinate, only while idle. */
  lookAt(clientX, clientY) {
    if (this._disposed || !this._atlas || this._state !== 'idle' || this._reducedMotion) return false;
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return false;
    const rect = this.canvas.getBoundingClientRect();
    // The face lies near the top quarter of the original canvas, not its center.
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height * 0.26);
    if (Math.hypot(dx, dy) < 4) return false;
    const angle = ((Math.atan2(dx, -dy) * 180 / Math.PI) + 360) % 360;
    const direction = Math.round(angle / 22.5) % 16;
    this._clearTimer();
    this._lookDirection = direction;
    this._draw();
    return true;
  }

  _visibilityChanged() {
    if (this._disposed) return;
    if (document.hidden) {
      if (this._dueAt !== null) this._remaining = Math.max(1, this._dueAt - now());
      this._clearTimer();
    } else {
      this._schedule();
    }
  }

  _motionChanged(reduced) {
    if (this._disposed || reduced === this._reducedMotion) return;
    this._reducedMotion = reduced;
    this._clearTimer();
    this._frame = 0;
    this._lookDirection = null;
    this._remaining = PET_STATES[this._state].durations[0];
    this._draw();
    if (reduced) this._queueStaticCompletion();
    else this._schedule();
  }

  _draw() {
    if (this._disposed) return;
    const { cellWidth: width, cellHeight: height } = PET_ATLAS;
    const ctx = this.context;
    ctx.clearRect(0, 0, width, height);
    if (this._atlas) {
      const looking = this._lookDirection !== null;
      const row = looking ? 9 + Math.floor(this._lookDirection / 8) : PET_STATES[this._state].row;
      const column = looking ? this._lookDirection % 8 : this._frame;
      ctx.drawImage(this._atlas, column * width, row * height, width, height, 0, 0, width, height);
    } else if (this._fallbackImage) {
      const image = this._fallbackImage;
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      ctx.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    } else if (this.status === 'error') {
      ctx.fillStyle = '#485344';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '13px sans-serif';
      ctx.fillText('캐릭터를 불러오지 못했어요.', width / 2, height / 2 - 12, width - 12);
      ctx.fillText('새로고침해 주세요.', width / 2, height / 2 + 12, width - 12);
    }
  }

  _setStatus(status) {
    this.status = status;
    this.canvas.dataset.petStatus = status;
    this.canvas.setAttribute('aria-label', this.error ? `${this._label}. ${this.error}` : this._label);
    this.canvas.dispatchEvent(new CustomEvent('petstatuschange', {
      detail: { status, error: this.error },
    }));
  }

  _clearTimer() {
    if (this._timer !== null) clearTimeout(this._timer);
    this._timer = null;
    this._dueAt = null;
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    this._revision += 1;
    this._clearTimer();
    document.removeEventListener('visibilitychange', this._onVisibility);
    if (this._media?.removeEventListener) {
      this._media.removeEventListener('change', this._onMotion);
    } else {
      this._media?.removeListener?.(this._onMotion);
    }
    for (const cancel of [...this._pendingImages]) cancel();
    this._setStatus('disposed');
  }
}

export default PetPlayer;
