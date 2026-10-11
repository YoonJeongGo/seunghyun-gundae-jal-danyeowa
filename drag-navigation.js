/** Horizontal travel. Pointer movement determines gait; final displacement determines destination. */
export class DragNavigator {
  constructor({region, actor, view, getIndex, lastIndex, render, arrival, motion, hint, reducedMotion, translate}) {
    Object.assign(this,{region,actor,view,getIndex,lastIndex,render,arrival,motion,hint,reducedMotion,translate});
    this.gesture=null;this.busy=false;this.offset=0;this.target=null;this.revision=0;this.ignoreClickUntil=0;this.quietTimer=null;this.animation=null;
    region.addEventListener('pointerdown',e=>this.down(e));
    region.addEventListener('pointermove',e=>this.move(e),{passive:false});
    region.addEventListener('pointerup',e=>this.up(e));
    region.addEventListener('pointercancel',e=>this.cancel(e));
    // Touch starts with capture on the child. Its loss while transferring to
    // the app bubbles here, but only loss of the app's own capture cancels us.
    region.addEventListener('lostpointercapture',e=>{if(e.target===region&&this.gesture?.id===e.pointerId)this.cancel(e);});
    region.addEventListener('click',e=>{if(this.busy||this.gesture?.locked||performance.now()<this.ignoreClickUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.background();});
  }
  get blocked(){return this.busy||!!this.gesture?.locked;}
  down(e){
    if(this.busy||this.gesture||e.isPrimary===false||(e.button!==undefined&&e.button!==0))return;
    if(e.target.closest('a,input,textarea,select,[contenteditable=true]'))return;
    const button=e.target.closest('button');if(button&&button.id!=='parcelButton')return;
    const characterSurface=this.view.contains(e.target);
    this.gesture={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,locked:false,characterSurface};
    // Keep a finger on the character even when its first movement is slight.
    // A parcel tap retains its button capture so its normal click still works.
    if(characterSurface&&!button&&e.pointerType==='touch'){
      try{this.region.setPointerCapture(e.pointerId);}catch{}
    }
  }
  move(e){
    const g=this.gesture;if(!g||g.id!==e.pointerId)return;
    const dx=e.clientX-g.x,dy=e.clientY-g.y;
    if(!g.locked){
      if(!g.characterSurface&&Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){this.gesture=null;this.ignoreClickUntil=performance.now()+350;return;}
      if(Math.abs(dx)<10||(!g.characterSurface&&Math.abs(dx)<Math.abs(dy)*1.3))return;
      g.locked=true;this.region.classList.add('is-dragging');this.actor.style.transition='none';
      try{this.region.setPointerCapture(e.pointerId);}catch{}
    }
    e.preventDefault();g.dx=dx;
    const limit=Math.max(44,Math.min(130,this.region.clientWidth*.29));
    const next=Math.max(-limit,Math.min(limit,dx*.78)),delta=next-this.offset;
    this.position(next);clearTimeout(this.quietTimer);
    if(Math.abs(delta)>.1){this.moving(Math.sign(delta));this.quietTimer=setTimeout(()=>this.moving(0),90);}else this.moving(0);
    const threshold=this.threshold(),direction=Math.sign(dx),target=this.getIndex()+direction;
    const hintKey=target<0?'dragFirst':target>this.lastIndex?'dragLast':Math.abs(dx)>=threshold?(direction>0?'dragReleaseNext':'dragReleasePrevious'):(direction>0?'dragMoreRight':'dragMoreLeft');
    this.hint(this.translate(hintKey));
  }
  up(e){
    const g=this.gesture;if(!g||g.id!==e.pointerId)return;this.gesture=null;
    this.release(g.id);if(!g.locked)return;
    this.ignoreClickUntil=performance.now()+350;this.region.classList.remove('is-dragging');clearTimeout(this.quietTimer);
    g.dx=e.clientX-g.x;
    const direction=Math.sign(g.dx),target=this.getIndex()+direction;
    if(Math.abs(g.dx)>=this.threshold()&&target>=0&&target<=this.lastIndex)this.navigate(target);
    else this.snap();
  }
  cancel(e){
    const g=this.gesture;if(!g||g.id!==e.pointerId)return;if(g.locked)this.ignoreClickUntil=performance.now()+350;this.gesture=null;this.release(g.id);clearTimeout(this.quietTimer);
    this.region.classList.remove('is-dragging');this.actor.style.transition='none';this.position(0);this.moving(0);if(g.locked)this.arrival();
  }
  release(id){try{if(this.region.hasPointerCapture(id))this.region.releasePointerCapture(id);}catch{}}
  threshold(){return Math.max(48,Math.min(72,this.region.clientWidth*.18));}
  position(x){this.offset=x;this.view.style.setProperty('--pet-x',x+'px');this.region.dataset.travelX=String(Math.round(x));}
  moving(direction){this.region.dataset.moving=direction>0?'right':direction<0?'left':'none';this.motion(direction);}
  animate(to,duration){
    clearTimeout(this.quietTimer);
    if(this.reducedMotion.matches||Math.abs(to-this.offset)<.2){this.actor.style.transition='none';this.position(to);this.moving(0);return Promise.resolve();}
    this.moving(Math.sign(to-this.offset));
    return new Promise(resolve=>{
      let settled=false,timer;
      const done=()=>{if(settled)return;settled=true;clearTimeout(timer);this.actor.removeEventListener('transitionend',ended);this.actor.removeEventListener('transitioncancel',done);if(this.animation?.done===done)this.animation=null;resolve();};
      const ended=e=>{if(e.target===this.actor&&e.propertyName==='transform')done();};
      this.animation={done};this.actor.addEventListener('transitionend',ended);this.actor.addEventListener('transitioncancel',done);
      this.actor.getBoundingClientRect();this.actor.style.transition=`transform ${duration}ms ease-in-out`;this.position(to);timer=setTimeout(done,duration+130);
    });
  }
  async snap(){
    if(this.busy)return;this.busy=true;const revision=++this.revision;
    await this.animate(0,170);if(revision!==this.revision)return;
    this.finish();
  }
  async navigate(index){
    if(this.busy||this.gesture)return false;
    const current=this.getIndex();if(index===current||index<0||index>this.lastIndex)return false;
    this.busy=true;this.target=index;const revision=++this.revision,direction=Math.sign(index-current),distance=this.region.clientWidth*.73;
    this.region.classList.add('is-transiting');this.region.dataset.navDirection=direction>0?'right':'left';this.region.setAttribute('aria-busy','true');
    await this.animate(direction*distance,220);if(revision!==this.revision)return false;
    this.render(index,{focus:false,action:false});this.actor.style.transition='none';this.position(-direction*distance);this.actor.getBoundingClientRect();
    await this.animate(0,240);if(revision!==this.revision)return false;
    this.finish();document.getElementById('title'+index)?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'});return true;
  }
  finish(){this.actor.style.transition='';this.position(0);this.moving(0);this.busy=false;this.target=null;this.region.classList.remove('is-transiting','is-dragging');this.region.removeAttribute('aria-busy');this.arrival();}
  background(){
    if(this.gesture)this.cancel({pointerId:this.gesture.id});
    if(!this.busy)return;const target=this.target;this.revision++;this.animation?.done();this.actor.style.transition='none';this.position(0);if(target!==null)this.render(target,{focus:false,action:false});this.finish();
  }
}
