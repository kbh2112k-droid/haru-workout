"use strict";
const kinds = [
  {id:"walk",name:"걷기",icon:"🚶",color:"green"},
  {id:"run",name:"달리기",icon:"🏃",color:"blue"},
  {id:"strength",name:"근력 운동",icon:"🏋️",color:"orange"},
  {id:"bike",name:"자전거",icon:"🚲",color:"purple"}
];
// 저장소마다 기록을 구분하며 외부 서버로 전송하지 않습니다.
const storageKey = "haru-workout:v1:" + location.pathname.replace(/[^/]*$/, "");
const $ = id => document.getElementById(id);
let records = [];
let storageReady = false;
function localDay() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T12:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === value;
}
function validRecord(r) {
  return r && typeof r.id === "string" && kinds.some(k => k.id === r.kind) && validDate(r.date) && Number.isInteger(r.minutes) && r.minutes >= 1 && r.minutes <= 1440;
}
function displayDate(value) {
  return new Date(value+"T12:00:00").toLocaleDateString("ko-KR",{month:"long",day:"numeric",weekday:"long"});
}
function message(text, error=false) {
  $("status").textContent = text;
  $("status").className = error ? "error-message" : "";
}
function refresh() {
  try {
    const raw = localStorage.getItem(storageKey);
    const data = raw === null ? [] : JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(validRecord)) throw new Error("invalid data");
    records = data;
    storageReady = true;
    message("");
  } catch {
    storageReady = false;
    message("저장된 기록을 읽을 수 없어요. 브라우저의 저장 허용 설정을 확인해 주세요. 기존 기록을 보호하기 위해 저장을 멈췄어요.", true);
  }
  render();
}
function render() {
  const today = localDay();
  $("date").max = today;
  $("today-date").textContent = "▦ " + displayDate(today);
  const todays = records.filter(r => r.date === today);
  const total = todays.reduce((n,r) => n+r.minutes,0);
  $("total").textContent = storageReady ? total : "—";
  $("summary").textContent = !storageReady ? "기록을 확인할 수 없어요" : total ? `오늘 ${todays.length}번, 나를 위해 움직였어요!` : "오늘의 첫 움직임을 기록해 보세요.";
  $("breakdown").innerHTML = kinds.map(k => `<div class="breakdown-item"><span class="mini-icon ${k.color}" aria-hidden="true">${k.icon}</span><span>${k.name}</span><strong>${storageReady ? todays.filter(r=>r.kind===k.id).reduce((n,r)=>n+r.minutes,0) : "—"}<small> 분</small></strong></div>`).join("");
  $("count").textContent = records.length;
  // 외부 입력은 검증된 숫자·날짜와 고정된 운동 종류만 표시합니다.
  $("history").innerHTML = !storageReady ? '<div class="error">기록을 불러오지 못했어요. <button type="button" id="retry">다시 불러오기</button></div>' : !records.length ? '<div class="empty-records"><span class="empty-icon" aria-hidden="true">🚶</span><p>나의 첫 운동 기록을 남겨 보세요</p><p class="muted">가벼운 산책부터 시작해도 좋아요.</p></div>' : '<div class="history-list">'+[...records].sort((a,b)=>b.date.localeCompare(a.date)).map(r=>{
    const k=kinds.find(k=>k.id===r.kind);
    return `<article class="history-item"><span class="mini-icon ${k.color}" aria-hidden="true">${k.icon}</span><div class="history-name"><strong>${k.name}</strong><span>${displayDate(r.date)}</span></div>${r.date===today?'<span class="record-today">오늘</span>':''}<strong class="record-minutes">${r.minutes}<small> 분</small></strong><span class="record-check">✓</span></article>`;
  }).join("")+'</div>';
  $("retry")?.addEventListener("click", refresh);
}
$("kinds").innerHTML = kinds.map((k,i)=>`<label class="exercise-option ${k.color} ${i===0?'selected':''}"><input type="radio" name="kind" value="${k.id}" ${i===0?'checked':''} required><span class="symbol" aria-hidden="true">${k.icon}</span><span>${k.name}</span></label>`).join("");
$("kinds").addEventListener("change",()=>document.querySelectorAll(".exercise-option").forEach(label=>label.classList.toggle("selected",label.querySelector("input").checked)));
function updateQuickTimes() {
  document.querySelectorAll("[data-minutes]").forEach(b=>b.classList.toggle("active",Number(b.dataset.minutes)===Number($("minutes").value)));
}
document.querySelectorAll("[data-minutes]").forEach(b=>b.addEventListener("click",()=>{ $("minutes").value=b.dataset.minutes; updateQuickTimes(); }));
$("minutes").addEventListener("input",updateQuickTimes);
$("date").value=localDay();
$("workout-form").addEventListener("submit",event=>{
  event.preventDefault();
  if (!storageReady) { message("먼저 기록을 다시 불러와 주세요.",true); return; }
  const kind=document.querySelector('input[name="kind"]:checked').value;
  const date=$("date").value;
  const minutes=Number($("minutes").value);
  if (!validDate(date) || date>localDay() || !Number.isInteger(minutes) || minutes<1 || minutes>1440) {
    message("올바른 날짜와 1~1440분 사이의 시간을 입력해 주세요.",true); return;
  }
  try {
    // 다른 탭에서 추가한 기록도 저장 전에 읽습니다.
    const saved=JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(saved) || !saved.every(validRecord)) throw new Error("invalid data");
    const next=[{id:crypto.randomUUID(),kind,date,minutes},...saved];
    localStorage.setItem(storageKey,JSON.stringify(next));
    records=next;
    render();
    message("운동 기록을 저장했어요!");
  } catch { message("기록을 저장하지 못했어요. 브라우저 저장 공간과 저장 허용 설정을 확인해 주세요.",true); }
});
window.addEventListener("storage",e=>{ if(e.key===storageKey || e.key===null) refresh(); });
setInterval(render,30000);
refresh();

