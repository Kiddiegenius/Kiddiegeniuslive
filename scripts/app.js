const missions = [
  {title:'Rocket Math: Fuel the Ship!', prompt:'Gray has <strong>3</strong> rocket seeds. Connor gives him <strong>2</strong> more. How many seeds does Gray have now?', answers:['4','5','6'], correct:'5'},
  {title:'Story Safari: Sound Hunt!', prompt:'Maddy found a <strong>moon</strong>. Which letter does the word <strong>moon</strong> start with?', answers:['M','S','T'], correct:'M'},
  {title:'Wonder Lab: Shadow Science!', prompt:'A shadow needs light and an object. What happens when you move the object closer to the light?', answers:['It can grow longer','It disappears forever','It turns into water'], correct:'It can grow longer'},
  {title:'Creative Camp: Shape Builder!', prompt:'Build a rocket using shapes. Which shape has <strong>3 sides</strong>?', answers:['Circle','Triangle','Square'], correct:'Triangle'}
];
let current=0, streak=0;
const $=s=>document.querySelector(s);
function scrollToId(id){const el=document.querySelector(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>scrollToId(b.dataset.scroll)));
function renderMission(){
  const m=missions[current];
  $('#lessonTitle').textContent=m.title;
  $('#lessonPrompt').innerHTML=m.prompt;
  $('#lessonProgress').textContent=`Mission ${current+1} • Step 1/3`;
  $('#answers').innerHTML='';
  m.answers.forEach(a=>{const b=document.createElement('button');b.className='answer';b.textContent=a;b.addEventListener('click',()=>answer(b,a));$('#answers').appendChild(b)});
  scrollToId('#lesson');
}
function answer(button,value){
  const m=missions[current];
  document.querySelectorAll('.answer').forEach(b=>b.disabled=true);
  if(value===m.correct){button.classList.add('correct');streak++;$('#streak').textContent=`🔥 ${streak} mission${streak===1?'':'s'} streak`;}else{button.classList.add('wrong');$('#streak').textContent='💡 Try again next mission';}
  $('#lessonProgress').textContent=`Mission ${current+1} • Complete ✓`;
  setTimeout(()=>{current=(current+1)%missions.length;renderMission()},900);
}
$('#startBtn').addEventListener('click',renderMission);
document.querySelectorAll('.quest-card').forEach(card=>card.addEventListener('click',()=>{current=Number(card.dataset.lesson)||0;renderMission()}));
$('#checkoutBtn').addEventListener('click',()=>{
  alert('Genius Pass is ready for Stripe. Add your live Stripe Checkout URL here when payments are connected.');
});
renderMission();
