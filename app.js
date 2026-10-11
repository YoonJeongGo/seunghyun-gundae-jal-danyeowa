import { PetPlayer } from './pet-player.js';
import { DragNavigator } from './drag-navigation.js?v=8-touch';
import { getDday, millisecondsUntilKoreanMidnight } from './dday.js';
import { t, setLanguage, applyLanguage } from './i18n.js';

const $=selector=>document.querySelector(selector);
const app=$('#giftApp'), scenes=[...document.querySelectorAll('[data-scene]')], steps=[...document.querySelectorAll('.progress li')];
const content=$('#sceneContent'),reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const pet=new PetPlayer($('#petCanvas'),{src:'assets/seunghyun.png',fallback:'assets/seunghyun-idle.png'});
const states=['waiting','waving','review','idle','jumping','waving'];
const dischargeDate='2028-04-11';
let stage=0,dayTimer,petDescriptionKey='petDefault',petLoaded=null;
try{
  const saved=JSON.parse(sessionStorage.getItem('seunghyun-gift-v1')||'null');
  if(saved&&Number.isInteger(saved.stage)&&saved.stage>=0&&saved.stage<scenes.length)stage=saved.stage;
}catch{}
function persist(){try{sessionStorage.setItem('seunghyun-gift-v1',JSON.stringify({stage}));}catch{}}
function describePet(key){
  petDescriptionKey=key;
  $('#petCanvas').setAttribute('aria-label',t(key));
}
function refreshDday(){
  clearTimeout(dayTimer);
  const now=new Date(),countdown=getDday(dischargeDate,now);
  $('#ddayPrefix').textContent=countdown.prefix;
  $('#ddayNumber').textContent=countdown.number;
  $('#title5').setAttribute('aria-label',t('ddayAria',{label:countdown.label}));
  dayTimer=setTimeout(refreshDday,millisecondsUntilKoreanMidnight(now));
}
function showStage(index,{focus=true,action=true}={}){
  stage=Math.max(0,Math.min(5,index));
  app.dataset.stage=String(stage);
  scenes.forEach((node,i)=>{node.hidden=i!==stage;node.classList.toggle('is-active',i===stage);});
  steps.forEach((node,i)=>{
    node.classList.toggle('is-current',i===stage);node.classList.toggle('is-done',i<stage);
    if(i===stage)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');
  });
  $('#stepCount').textContent=`${String(stage+1).padStart(2,'0')} / 06`;
  $('#parcelButton').hidden=stage!==0;
  $('#nextScene').disabled=stage===5;$('#previousScene').disabled=stage===0;
  content.scrollTop=0;
  persist();if(action)playArrival();
  if(focus)document.getElementById(`title${stage}`).focus({preventScroll:true});
}
function restingHint(){return t(stage===0?'hintStart':stage===5?'hintEnd':'hintMiddle');}
function playArrival(){
  const state=states[stage],captured=stage,once=[1,2,4,5].includes(stage);
  app.dataset.arrivalAction=state;
  pet.setState(state,{once,onComplete:()=>{if(stage===captured&&!navigation.blocked)describePet('standing');}});
  describePet('arrival'+stage);
  $('#dragHint').textContent=restingHint();
}
function locomotion(direction){
  const name=direction>0?'running-right':direction<0?'running-left':'idle';
  if(pet.state!==name)pet.setState(name);
  describePet(direction>0?'runningRight':direction<0?'runningLeft':'paused');
}
const navigation=new DragNavigator({
  region:app,actor:$('#petCanvas'),view:$('#petView'),getIndex:()=>stage,lastIndex:5,
  render:showStage,arrival:playArrival,motion:locomotion,translate:t,
  hint:text=>$('#dragHint').textContent=text,reducedMotion:reduced
});
function updateLanguage(language){
  if(navigation.blocked)return;
  setLanguage(language);applyLanguage();refreshDday();
  $('#dragHint').textContent=restingHint();
  describePet(petDescriptionKey);
  $('#petCanvas img').alt=t('petDefault');
  if(petLoaded===false)$('#petStatus').textContent=t('loadError');
}
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>updateLanguage(button.dataset.language)));
$('#nextScene').addEventListener('click',()=>navigation.navigate(stage+1));
$('#previousScene').addEventListener('click',()=>navigation.navigate(stage-1));
$('#parcelButton').addEventListener('click',()=>navigation.navigate(1));
$('#restart').addEventListener('click',()=>{if(!navigation.blocked)navigation.navigate(0);});
document.addEventListener('keydown',event=>{
  if(event.target.closest('input,textarea,select,[contenteditable=true]'))return;
  if(event.key==='ArrowRight'){event.preventDefault();navigation.navigate(stage+1);}
  else if(event.key==='ArrowLeft'){event.preventDefault();navigation.navigate(stage-1);}
});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshDday();});
window.addEventListener('pageshow',event=>{if(event.persisted)refreshDday();});
window.addEventListener('pagehide',event=>{if(!event.persisted){clearTimeout(dayTimer);pet.dispose();}});
pet.ready.then(ok=>{
  petLoaded=ok;$('#petStatus').hidden=ok;
  if(!ok)$('#petStatus').textContent=t('loadError');
  describePet(petDescriptionKey);
});
app.dataset.moving='none';
applyLanguage();refreshDday();$('#petCanvas img').alt=t('petDefault');
showStage(stage,{focus:false});
