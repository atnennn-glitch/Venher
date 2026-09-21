const modal=document.getElementById('modal');
const modalForm=document.getElementById('modal-form');
const leadForm=document.getElementById('lead-form');
const floatCta=document.getElementById('float-cta');
const program=document.getElementById('program');
const register=document.getElementById('register');
const botUrl='https://telegram.me/Olga_Venher_bot?start=ZGw6MzQxMTM4';
const showError=(el,msg)=>{el.textContent=msg;el.hidden=!msg};
const validName=v=>v.trim().length>=2;
const validPhone=v=>/^\+?[\d\s()-]+$/.test(v.trim())&&v.replace(/\D/g,'').length>=9;
const validTelegram=v=>/^@?[A-Za-z0-9_]{5,32}$/.test(v.trim());
function updateFloat(){const show=program.getBoundingClientRect().top<innerHeight*.45&&register.getBoundingClientRect().top>innerHeight*.65&&!modal.open;floatCta.classList.toggle('is-visible',show);floatCta.setAttribute('aria-hidden',String(!show));floatCta.tabIndex=show?0:-1}
function openModal(){showError(document.getElementById('modal-error'),'');modal.showModal();document.getElementById('telegram').focus();updateFloat()}
document.querySelectorAll('.js-open-modal').forEach(b=>b.addEventListener('click',openModal));
document.getElementById('close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});modal.addEventListener('close',updateFloat);
leadForm.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name'),phone=document.getElementById('phone'),err=document.getElementById('lead-error');if(!validName(name.value)){showError(err,'Вкажи ім’я (щонайменше 2 символи).');name.focus();return}if(!validPhone(phone.value)){showError(err,'Вкажи коректний номер телефону.');phone.focus();return}showError(err,'');openModal()});
modalForm.addEventListener('submit',e=>{e.preventDefault();const telegram=document.getElementById('telegram'),err=document.getElementById('modal-error');if(!validTelegram(telegram.value)){showError(err,'Вкажи нікнейм Telegram у форматі @username.');telegram.focus();return}showError(err,'');const b=document.getElementById('modal-submit');b.disabled=true;b.firstChild.textContent='Переходимо в Telegram ';if(typeof fbq==='function')fbq('track','Lead');setTimeout(()=>location.assign(botUrl),300);setTimeout(()=>{b.disabled=false;b.firstChild.textContent='Перейти в Telegram '},1500)});
let frame=0;addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{updateFloat();frame=0})},{passive:true});addEventListener('resize',updateFloat);updateFloat();
