const DAY_MS=86400000;
const koreaDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'});

export function koreanDateISO(now=new Date()){
  const parts=Object.fromEntries(koreaDate.formatToParts(now).map(part=>[part.type,part.value]));
  return parts.year+'-'+parts.month+'-'+parts.day;
}

export function calendarDay(iso){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))throw new Error('Expected YYYY-MM-DD');
  const [year,month,day]=iso.split('-').map(Number),stamp=Date.UTC(year,month-1,day),check=new Date(stamp);
  if(check.getUTCFullYear()!==year||check.getUTCMonth()!==month-1||check.getUTCDate()!==day)throw new Error('Invalid calendar date');
  return stamp/DAY_MS;
}

export function getDday(targetISO,now=new Date()){
  const today=koreanDateISO(now),days=calendarDay(targetISO)-calendarDay(today);
  const prefix=days<0?'D+':'D-',number=days===0?'DAY':String(Math.abs(days));
  return {days,prefix,number,label:prefix+number,today};
}

export function millisecondsUntilKoreanMidnight(now=new Date()){
  const today=koreanDateISO(now);
  const nextMidnightUTC=(calendarDay(today)+1)*DAY_MS-9*3600000;
  return Math.max(1,nextMidnightUTC-now.getTime()+100);
}
