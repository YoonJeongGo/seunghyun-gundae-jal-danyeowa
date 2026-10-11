const storageKey = 'seunghyun-gift-language-v1';

const messages = {
  ko: {
    pageTitle: '승현아 군대 잘갔다와',
    metaDescription: '승현아, 건강히 갔다 온나. 혹시나 휴가 나오면 연락해. 밥이나 한 끼 하자.',
    brand: '승현아 군대 잘갔다와',
    progressLabel: '진행 단계',
    step0: '1단계 시작',
    step1: '2단계 머리',
    step2: '3단계 건강',
    step3: '4단계 연락',
    step4: '5단계 휴가',
    step5: '6단계 전역 D DAY',
    eyebrow0: '가기 전에',
    eyebrow1: '머리',
    eyebrow2: '건강',
    eyebrow3: '연락',
    eyebrow4: '휴가',
    eyebrow5: '전역까지',
    title0: '승현아,<br><em>잘 갔다 온나.</em>',
    title1: '머리 참<br><em>시원하네.</em>',
    title2: '몸 건강히<br><em>갔다 온나.</em>',
    title3: '시간 나면<br><em>연락해라.</em>',
    title4: '혹시나 휴가 나오면<br><em>연락해.</em>',
    intro0: '가기 전에<br>이거 한 번 보고 가라.',
    intro1: '샴푸는 쪼매만 써도 되겠다.<br>가서 밥은 잘 묵어라.',
    intro2: '무리하지 마라.<br>다치지 말고 잘 돌아온나.',
    intro4: '밥이나 한 끼 하자.',
    intro5: '잘 가라.<br>건강히 갔다 온나.',
    letterLine0: '연락할 수 있을 때 연락해라.',
    letterLine1: '힘든 일 있으면 얘기하고<br>괴롭히는 사람 있으면 꼭 말해라.',
    letterLine2: '정원이 보내줄게 ^^',
    sceneContentLabel: '장면 내용',
    petDefault: '검은 빡빡머리와 훈련병 군복을 입은 이승현',
    loading: '캐릭터 불러오는 중.',
    petTouch: '↔ 좌우로 끌어 봐',
    parcelLabel: '상자 열고 다음으로',
    parcelTo: 'TO. 이승현',
    parcelOpen: '열어 봐',
    parcelClick: '열기 ↗',
    scene0Note: '오른쪽으로 끌면 시작.',
    enlistment: '입대',
    discharge: '전역 예정',
    ddayNote: '육군 18개월 기준 · 한국 날짜로 계산',
    restart: '처음부터 보기 ↺',
    navLabel: '장면 이동',
    previousAria: '왼쪽으로 이동 · 이전 장면',
    nextAria: '오른쪽으로 이동 · 다음 장면',
    dragSubtitle: '오른쪽은 다음, 왼쪽은 이전.<br>긴 글은 내용 안에서 위아래로 내려서 읽어.',
    bottomNote: '이승현 입대 전',
    languageLabel: '언어 선택',
    koreanAria: '한국어로 보기',
    japaneseAria: '일본어로 보기',
    hintStart: '오른쪽으로 끌면 시작',
    hintEnd: '왼쪽으로 끌면 이전',
    hintMiddle: '← 이전 · 다음 →',
    standing: '서 있는 이승현',
    arrival0: '상자를 기다리는 이승현',
    arrival1: '인사하는 이승현',
    arrival2: '응원에 고개를 끄덕이는 이승현',
    arrival3: '편지 곁에서 기다리는 이승현',
    arrival4: '휴가 얘기에 기뻐하는 이승현',
    arrival5: '마지막 인사를 하는 이승현',
    runningRight: '오른쪽으로 달리는 이승현',
    runningLeft: '왼쪽으로 달리는 이승현',
    paused: '잠시 멈춘 이승현',
    ddayAria: '전역 예정일까지 {label}',
    loadError: '움직임을 불러오지 못했어요. 페이지는 계속 볼 수 있어요.',
    dragFirst: '처음 장면이야. 오른쪽으로 가 볼까?',
    dragLast: '마지막 장면이야. 왼쪽으로 다시 둘러봐.',
    dragReleaseNext: '손을 놓으면 다음 장면으로 가.',
    dragReleasePrevious: '손을 놓으면 이전 장면으로 가.',
    dragMoreRight: '조금 더 오른쪽으로 끌어 봐.',
    dragMoreLeft: '조금 더 왼쪽으로 끌어 봐.'
  },
  ja: {
    pageTitle: 'スンヒョン、元気に行ってこい',
    metaDescription: 'スンヒョン、元気に行ってこい。もし休暇で帰ってきたら連絡して。一緒にご飯でも食べよう。',
    brand: 'スンヒョン、元気に行ってこい',
    progressLabel: '進行状況',
    step0: 'ステップ1 スタート',
    step1: 'ステップ2 髪',
    step2: 'ステップ3 健康',
    step3: 'ステップ4 連絡',
    step4: 'ステップ5 休暇',
    step5: 'ステップ6 除隊までの日数',
    eyebrow0: '行く前に',
    eyebrow1: '髪',
    eyebrow2: '体のこと',
    eyebrow3: '連絡',
    eyebrow4: '休暇',
    eyebrow5: '除隊まで',
    title0: 'スンヒョン、<br><em>元気に行ってこい。</em>',
    title1: '髪、だいぶ<br><em>さっぱりしたな。</em>',
    title2: '元気で<br><em>帰ってこいよ。</em>',
    title3: '時間ができたら<br><em>連絡してな。</em>',
    title4: '休暇で帰ってきたら<br><em>連絡して。</em>',
    intro0: '行く前に<br>これ、ちょっと見ていって。',
    intro1: 'シャンプー、ちょっとで足りそうだな。<br>向こうでもちゃんと食べろよ。',
    intro2: '無理するなよ。<br>ケガせず元気に帰ってこい。',
    intro4: '一緒にご飯でも食べよう。',
    intro5: '行ってらっしゃい。<br>元気に帰ってこいよ。',
    letterLine0: '連絡できるときに連絡してな。',
    letterLine1: 'つらいことがあったら話して。<br>いじめてくる人がいたら、必ず言ってくれ。',
    letterLine2: 'チョンウォンを送り込むからな ^^',
    sceneContentLabel: 'シーンの内容',
    petDefault: '黒い丸刈りで訓練兵の軍服を着たスンヒョン',
    loading: 'キャラクターを読み込み中。',
    petTouch: '↔ 左右にドラッグして',
    parcelLabel: '箱を開けて次へ',
    parcelTo: 'スンヒョンへ',
    parcelOpen: '開けてみて',
    parcelClick: '開く ↗',
    scene0Note: '右にドラッグしてスタート。',
    enlistment: '入隊',
    discharge: '除隊予定',
    ddayNote: '韓国陸軍・18か月基準 · 韓国の日付で計算',
    restart: '最初から見る ↺',
    navLabel: 'シーンの移動',
    previousAria: '左へ移動 · 前のシーン',
    nextAria: '右へ移動 · 次のシーン',
    dragSubtitle: '右は次、左は前。<br>長い文章は内容エリアの中を上下にスクロールしてね。',
    bottomNote: 'スンヒョンの入隊前に',
    languageLabel: '言語を選ぶ',
    koreanAria: '韓国語に切り替え',
    japaneseAria: '日本語に切り替え',
    hintStart: '右にドラッグしてスタート',
    hintEnd: '左にドラッグすると前へ',
    hintMiddle: '← 前へ · 次へ →',
    standing: '立っているスンヒョン',
    arrival0: '箱を待つスンヒョン',
    arrival1: '挨拶するスンヒョン',
    arrival2: '応援にうなずくスンヒョン',
    arrival3: '手紙のそばで待つスンヒョン',
    arrival4: '休暇の話を聞いて喜ぶスンヒョン',
    arrival5: '最後の挨拶をするスンヒョン',
    runningRight: '右へ走るスンヒョン',
    runningLeft: '左へ走るスンヒョン',
    paused: '立ち止まったスンヒョン',
    ddayAria: '除隊予定日まで {label}',
    loadError: 'アニメーションを読み込めませんでした。ページは引き続き見られます。',
    dragFirst: '最初のシーンだよ。右に進んでみよう。',
    dragLast: '最後のシーンだよ。左に戻ってみて。',
    dragReleaseNext: '離すと次のシーンへ。',
    dragReleasePrevious: '離すと前のシーンへ。',
    dragMoreRight: 'もう少し右にドラッグして。',
    dragMoreLeft: 'もう少し左にドラッグして。'
  }
};

let language = 'ko';
try {
  const saved = localStorage.getItem(storageKey);
  if (saved === 'ko' || saved === 'ja') language = saved;
} catch {}

export function getLanguage() {
  return language;
}

export function setLanguage(nextLanguage) {
  if (nextLanguage !== 'ko' && nextLanguage !== 'ja') return language;
  language = nextLanguage;
  try { localStorage.setItem(storageKey, language); } catch {}
  return language;
}

export function t(key, values = {}) {
  const template = messages[language][key] ?? messages.ko[key] ?? key;
  return template.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
  );
}

export function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  // HTML keys contain only the trusted static dictionary's line breaks and emphasis.
  document.querySelectorAll('[data-i18n-html]').forEach(node => {
    node.innerHTML = t(node.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(node => {
    node.setAttribute('aria-label', t(node.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-content]').forEach(node => {
    node.setAttribute('content', t(node.dataset.i18nContent));
  });
  document.querySelectorAll('[data-language]').forEach(button => {
    const selected = button.dataset.language === language;
    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('is-active', selected);
  });
}
