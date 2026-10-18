/* Pink Slip Rivals — original drag racing game. All art procedurally drawn. */
'use strict';
(function(){
const R_WHEEL=0.32, EFF=0.85, G=9.81;
const CDA={hatch:0.72,coupe:0.64,muscle:0.78,sedan:0.70,super:0.56};
const CLASSES=['D','C','B','A','S'];
const CLASS_MULT={D:1,C:2.2,B:4.5,A:9,S:16};
const QUARTER=402.336, EIGHTH=201.168;
const CARS=[
 {id:'kestrel',name:'Kestrel 1.6',cls:'D',hp:150,kg:1080,grip:0.95,drive:'FWD',redline:7800,gears:[3.30,2.05,1.45,1.12,0.90],fd:4.10,price:0,cur:'coins',color:'#ff4d6d',body:'hatch'},
 {id:'bramble',name:'Bramble GT',cls:'D',hp:190,kg:1200,grip:1.00,drive:'RWD',redline:7200,gears:[3.40,2.15,1.55,1.20,1.00],fd:3.90,price:6000,cur:'coins',color:'#4dabf7',body:'coupe'},
 {id:'vandal',name:'Vandal V6',cls:'C',hp:290,kg:1450,grip:1.00,drive:'RWD',redline:6800,gears:[3.20,2.10,1.50,1.15,0.95,0.80],fd:3.70,price:18000,cur:'coins',color:'#fab005',body:'muscle'},
 {id:'sable',name:'Sable Turbo',cls:'C',hp:315,kg:1330,grip:1.02,drive:'AWD',redline:7200,gears:[3.30,2.10,1.50,1.15,0.92,0.78],fd:3.80,price:24000,cur:'coins',color:'#868e96',body:'sedan'},
 {id:'tempest',name:'Tempest RS',cls:'B',hp:430,kg:1320,grip:1.08,drive:'AWD',redline:7500,gears:[3.10,2.00,1.45,1.12,0.92,0.78],fd:3.90,price:45000,cur:'coins',color:'#20c997',body:'coupe'},
 {id:'corvane',name:'Corvane SS',cls:'B',hp:480,kg:1480,grip:1.05,drive:'RWD',redline:6600,gears:[2.90,1.95,1.42,1.10,0.90,0.75],fd:3.55,price:52000,cur:'coins',color:'#e03131',body:'muscle'},
 {id:'wraith',name:'Wraith GTR',cls:'A',hp:620,kg:1560,grip:1.22,drive:'AWD',redline:7200,gears:[3.00,1.95,1.42,1.10,0.90,0.75],fd:3.70,price:110000,cur:'coins',color:'#f8f9fa',body:'coupe'},
 {id:'hydra',name:'Hydra V8',cls:'A',hp:690,kg:1620,grip:1.10,drive:'RWD',redline:6800,gears:[2.80,1.90,1.40,1.10,0.88,0.72],fd:3.45,price:120000,cur:'coins',color:'#7048e8',body:'muscle'},
 {id:'apex',name:'Apex Zero',cls:'S',hp:900,kg:1420,grip:1.30,drive:'AWD',redline:8200,gears:[3.00,2.00,1.48,1.15,0.95,0.80,0.68],fd:3.60,price:250,cur:'gems',color:'#ff922b',body:'super'},
 {id:'nova',name:'Nova Hyper',cls:'S',hp:1150,kg:1500,grip:1.36,drive:'AWD',redline:8500,gears:[2.90,1.95,1.45,1.15,0.95,0.80,0.68],fd:3.50,price:400,cur:'gems',color:'#ff4fa3',body:'super'}
];
const UPG=[
 {k:'engine',name:'Engine',desc:'+8% horsepower per level'},
 {k:'turbo',name:'Turbo',desc:'+10% horsepower per level'},
 {k:'trans',name:'Transmission',desc:'Faster shifts & wider PERFECT window'},
 {k:'tires',name:'Tires',desc:'+7% grip per level (better launches)'},
 {k:'nitrous',name:'Nitrous',desc:'Stronger and longer nitrous shot'},
 {k:'weight',name:'Weight Reduction',desc:'-3.5% weight per level'}
];
const MAXLVL=5;
const DIFFS={
 Easy:{p:[0.2,0.4],tgt:0.86,sd:0.05,up:[-1,-1],nosGear:3,mult:0.8,gems:0},
 Medium:{p:[0.4,0.4],tgt:0.90,sd:0.03,up:[-1,0],nosGear:3,mult:1.2,gems:0},
 Hard:{p:[0.65,0.3],tgt:0.925,sd:0.015,up:[-1,0],nosGear:2,mult:1.8,gems:1},
 Pro:{p:[0.85,0.15],tgt:0.93,sd:0.008,up:[0,1],nosGear:2,mult:2.5,gems:3}
};
const ENTRY={D:200,C:500,B:1200,A:3000,S:6000};
const BOT_NAMES=['Turbo Tina','Clutch Carl','Nitro Nate','Gearhead Gwen','Burnout Bo','Revvin Kevin','Dragstrip Dana','Quarter Mile Quinn','Spinout Sam','Torque Tori','Boost Boone','Redline Reggie','Smokey Jo','Apex Andy','Slipstream Sly','Hot Rod Hal','Piston Pete','Lugnut Lou','Ricky Rocket','Velvet Vic','Drift Daddy','Gasket Gus','Throttle Theo','Launch Lana'];
const BOSSES=[
 {name:'Tiny Tony',car:'kestrel',diff:'Easy',lvl:0,dist:'1/8',coins:1500,gems:5},
 {name:'Lil Wrench',car:'bramble',diff:'Medium',lvl:1,dist:'1/8',coins:3000,gems:5},
 {name:'Dee Torque',car:'vandal',diff:'Medium',lvl:1,dist:'1/4',coins:6000,gems:10},
 {name:'Mama Boost',car:'sable',diff:'Hard',lvl:2,dist:'1/8',coins:9000,gems:10},
 {name:'Rocket Rosa',car:'tempest',diff:'Hard',lvl:2,dist:'1/4',coins:15000,gems:15},
 {name:'Big Jim Diesel',car:'corvane',diff:'Hard',lvl:3,dist:'1/4',coins:22000,gems:15},
 {name:'The Ghost',car:'wraith',diff:'Pro',lvl:3,dist:'1/8',coins:35000,gems:20},
 {name:'The Duke',car:'hydra',diff:'Pro',lvl:4,dist:'1/4',coins:50000,gems:25},
 {name:'Vex',car:'apex',diff:'Pro',lvl:4,dist:'1/4',coins:80000,gems:40},
 {name:'Queen Pinkslip',car:'nova',diff:'Pro',lvl:5,dist:'1/4',coins:150000,gems:100,pink:true}
];
const PALETTE=['#ff4d6d','#4dabf7','#fab005','#20c997','#e03131','#7048e8','#f8f9fa','#ff922b','#ff4fa3','#82c91e','#15aabf','#343a40','#e64980','#fd7e14'];

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const carDef=id=>CARS.find(c=>c.id===id);
const uid=()=>Math.random().toString(36).slice(2,10);
function newOwned(id,lvl,color){const u={};UPG.forEach(g=>u[g.k]=typeof lvl==='function'?lvl():(lvl||0));return {uid:uid(),id,up:u,tune:null,color:color||carDef(id).color};}

function buildSpec(o){
 const d=carDef(o.id),u=o.up,t=o.tune||{};
 const hp=d.hp*(1+0.08*u.engine)*(1+0.10*u.turbo);
 const kg=d.kg*(1-0.035*u.weight);
 const driveF={FWD:0.82,RWD:1.0,AWD:1.18}[d.drive];
 const grip=d.grip*(1+0.07*u.tires)*driveF;
 const gears=(t.gears&&t.gears.length===d.gears.length)?t.gears.slice():d.gears.slice();
 const fd=t.fd||d.fd;
 const pw=hp/kg;
 return {id:d.id,name:d.name,cls:d.cls,drive:d.drive,hp,kg,grip,redline:d.redline,gears,fd,cda:CDA[d.body],
  shiftMult:1-0.1*u.trans,perfLo:0.90-0.008*u.trans,perfHi:0.955+0.006*u.trans,
  nosPow:0.25+0.07*u.nitrous,nosDur:2.4+0.35*u.nitrous,
  launchC:clamp(0.76-pw*0.30,0.42,0.74),launchW:0.06,color:o.color||d.color,body:d.body};
}
function powerFrac(x){return x<=0.9?Math.sin(Math.min(x/0.9,1)*Math.PI/2):Math.max(0,1-(x-0.9)*2.5);}
function torqueAt(s,rpm){rpm=Math.max(rpm,1200);const P=s.hp*745.7*powerFrac(rpm/s.redline);return P/(rpm*2*Math.PI/60);}

class Racer{
 constructor(spec,ai){Object.assign(this,{spec,ai,x:0,v:0,gear:1,rpm:900,shiftT:0,nosT:0,nosUsed:false,fin:false,et:0,trap:0,launched:false,delay:0,launchGrade:null,clutch:0,lastShift:null,spin:false,limiter:false,t:0,shifts:{PERFECT:0,GOOD:0,EARLY:0,LATE:0},wheelA:0,aiTarget:0,pendingShift:false});if(ai)this.newAiTarget();}
 newAiTarget(){const d=DIFFS[this.ai.diff];this.aiTarget=clamp(d.tgt+gauss()*d.sd,0.7,1.0);}
 launch(rpm){
  const s=this.spec,x=rpm/s.redline,d=Math.abs(x-s.launchC);let g;
  if(d<=s.launchW)g='PERFECT';else if(d<=s.launchW*2.2)g='GOOD';else g=x>s.launchC?'WHEELSPIN':'BOG';
  this.launchGrade=g;this.delay={PERFECT:0.0,GOOD:0.05,WHEELSPIN:0.08,BOG:0.12}[g]+(this.ai?rnd(0,0.04):0);
  this.clutch=clamp(rpm,s.redline*0.3,s.redline*0.95);this.launched=true;return g;
 }
 aiLaunchRpm(){const d=DIFFS[this.ai.diff],r=Math.random(),s=this.spec;let x;
  if(r<d.p[0])x=s.launchC+rnd(-0.03,0.03);else if(r<d.p[0]+d.p[1])x=s.launchC+(Math.random()<0.5?-1:1)*rnd(0.08,0.12);else x=s.launchC+(Math.random()<0.5?-1:1)*rnd(0.16,0.3);
  return clamp(x,0.15,1)*s.redline;}
 shift(){
  if(!this.launched||this.fin||this.shiftT>0||this.gear>=this.spec.gears.length)return null;
  const s=this.spec,x=this.rpm/s.redline;let g,tm;
  if(x>=s.perfLo&&x<=s.perfHi){g='PERFECT';tm=0.07;}
  else if(x>=0.985){g='LATE';tm=0.22;}
  else if(x>s.perfHi||x>=s.perfLo-0.07){g='GOOD';tm=0.15;}
  else{g='EARLY';tm=0.30;}
  this.shiftT=tm*s.shiftMult;this.lastShift=g;this.shifts[g]++;return g;
 }
 nitrous(){if(!this.launched||this.nosUsed||this.fin)return false;this.nosUsed=true;this.nosT=this.spec.nosDur;return true;}
 step(dt,raceT,dist){
  if(!this.launched||raceT<this.delay)return;
  const s=this.spec;
  if(this.fin){this.v=Math.max(0,this.v-6*dt);this.x+=this.v*dt;this.rpm=Math.max(1000,this.rpm-4000*dt);this.wheelA+=this.v*dt/R_WHEEL;return;}
  const t=raceT-this.delay;this.t=t;
  if(this.ai&&this.shiftT<=0){
   const d=DIFFS[this.ai.diff];
   if(this.gear<s.gears.length&&!this.slipping&&this.rpm/s.redline>=this.aiTarget){this.shift();this.newAiTarget();}
   if(!this.nosUsed&&this.gear>=d.nosGear&&t>0.5)this.nitrous();
  }
  const ratio=s.gears[this.gear-1]*s.fd;
  const wheelRpm=this.v/R_WHEEL*ratio*60/(2*Math.PI);
  let F=0;
  if(this.shiftT>0){
   this.shiftT-=dt;
   const ng=Math.min(this.gear+1,s.gears.length);
   const target=this.v/R_WHEEL*s.gears[ng-1]*s.fd*60/(2*Math.PI);
   this.rpm+= (target-this.rpm)*Math.min(1,dt*18);
   if(this.shiftT<=0){this.gear=ng;this.shiftT=0;}
   this.spin=false;this.limiter=false;
  }else{
   let rpm=wheelRpm;
   const minR=this.gear===1?this.clutch:2200;this.slipping=wheelRpm<minR;
   if(this.slipping)rpm=minR;
   this.limiter=rpm>=s.redline;
   if(this.limiter){rpm=s.redline;F=0;}
   else{
    let T=torqueAt(s,rpm);
    if(this.nosT>0)T*=1+s.nosPow;
    if(this.launchGrade==='BOG'&&t<1.0)T*=0.55;
    F=T*ratio*EFF/R_WHEEL;
   }
   const trac=s.grip*s.kg*G;
   if(F>trac){F=trac*0.95;this.spin=true;}else this.spin=false;
   if(this.launchGrade==='WHEELSPIN'&&t<1.0){F*=0.62;this.spin=true;}
   else if(this.launchGrade==='GOOD'&&t<0.7)F*=0.9;
   this.rpm=Math.max(rpm,900);
  }
  if(this.nosT>0)this.nosT=Math.max(0,this.nosT-dt);
  const drag=0.5*1.2*s.cda*this.v*this.v,roll=this.v>0.1?0.012*s.kg*G:0;
  const a=(F-drag-roll)/s.kg;this.acc=a;
  this.v=Math.max(0,this.v+a*dt);this.x+=this.v*dt;this.wheelA+=this.v*dt/R_WHEEL*(this.spin?1.6:1);
  if(this.x>=dist){const over=this.v>0?(this.x-dist)/this.v:0;this.fin=true;this.et=raceT-over;this.trap=this.v;this.nosT=0;}
 }
}
// Simulated perfect run, for tuning ET estimate.
function estimateET(spec,dist){
 const r=new Racer(spec,null);r.launch(spec.launchC*spec.redline);
 const sx=(spec.perfLo+spec.perfHi)/2;let t=0;const dt=1/240;
 while(!r.fin&&t<60){t+=dt;if(r.launched&&r.shiftT<=0&&r.rpm/spec.redline>=sx&&r.gear<spec.gears.length)r.shift();if(r.gear>=2&&!r.nosUsed)r.nitrous();r.step(dt,t,dist);}
 return {et:r.et||t,trap:r.trap};
}
const mph=v=>v*2.23694;

if(typeof module!=='undefined'&&typeof document==='undefined'){module.exports={CARS,buildSpec,Racer,estimateET,newOwned,DIFFS,BOSSES,QUARTER,EIGHTH,mph};return;}

/* ================= STATE ================= */
const SAVE_KEY='pinkslip_rivals_v1';
let S;
function defaultState(){const c=newOwned('kestrel',0);return {coins:5000,gems:50,cars:[c],active:c.uid,career:0,opps:[],settings:{sound:true,infinite:false},stats:{wins:0,losses:0,pinkWon:0,pinkLost:0,races:0,best14:null,best18:null}};}
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE_KEY));if(j&&j.cars&&j.cars.length){S=Object.assign(defaultState(),j);S.settings=Object.assign(defaultState().settings,j.settings||{});S.stats=Object.assign(defaultState().stats,j.stats||{});return;}}catch(e){}S=defaultState();}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
load();
const activeCar=()=>S.cars.find(c=>c.uid===S.active)||S.cars[0];
function canAfford(cur,amt){return S.settings.infinite||S[cur]>=amt;}
function spend(cur,amt){if(S.settings.infinite)return true;if(S[cur]>=amt){S[cur]-=amt;save();updWallet();return true;}return false;}
function earn(cur,amt){S[cur]=Math.max(0,Math.min(1e12,(S[cur]||0)+amt));save();updWallet();}
const fmt=n=>Math.round(n).toLocaleString('en-US');
function updWallet(){const inf=S.settings.infinite;document.getElementById('coins').textContent=inf?'∞':fmt(S.coins);document.getElementById('gems').textContent=inf?'∞':fmt(S.gems);}
const priceTag=(cur,amt)=>`<i class="${cur==='gems'?'gem':'coin'}"></i> ${fmt(amt)}`;

function upgCost(def,lvl){return Math.round(400*CLASS_MULT[def.cls]*Math.pow(1.8,lvl)/50)*50;}
function upgGemCost(def,lvl){return Math.max(2,Math.ceil(upgCost(def,lvl)/600));}
function carValue(o){const d=carDef(o.id);let v=d.cur==='gems'?d.price*250:Math.max(2000,d.price);let up=0;UPG.forEach(g=>{for(let i=0;i<o.up[g.k];i++)up+=upgCost(d,i);});return Math.round((v*0.5+up*0.4)/10)*10;}

/* ================= OPPONENTS ================= */
function genOpps(){
 const ci=CLASSES.indexOf(carDef(activeCar().id).cls);
 const used=new Set(),list=[];
 for(let i=0;i<5;i++){
  const cls=CLASSES[clamp(ci+[0,0,0,1,-1][i],0,4)];
  const car=i===0?carDef(activeCar().id):pick(CARS.filter(c=>c.cls===cls));
  const diff=pick(i===0?['Easy']:['Easy','Medium','Medium','Hard','Hard','Pro']);
  let name;do{name=pick(BOT_NAMES);}while(used.has(name));used.add(name);
  const dd=DIFFS[diff],base=Math.round(UPG.reduce((a,g)=>a+activeCar().up[g.k],0)/UPG.length)-(CLASSES.indexOf(cls)>ci?1:0);
  list.push({id:uid(),name,diff,dist:Math.random()<0.5?'1/4':'1/8',car:newOwned(car.id,()=>clamp(base+rint(dd.up[0],dd.up[1]),0,MAXLVL),pick(PALETTE))});
 }
 S.opps=list;save();
}
if(!S.opps||!S.opps.length)genOpps();

/* ================= UI ================= */
const $=s=>document.querySelector(s);
const screenEl=$('#screen');
let tab='race',garageView='main',tuneSel=null,raceDist='1/4';
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);}
function modal(html){$('#mbox').innerHTML=html;$('#modal').classList.remove('hidden');}
function closeModal(){$('#modal').classList.add('hidden');}
function confirmBox(title,msg,yes,onYes,danger){modal(`<h2>${title}</h2><p style="text-align:center">${msg}</p><div class="btns"><button class="btn dark" data-a="close">Cancel</button><button class="btn ${danger?'pink':'green'}" id="cfYes">${yes}</button></div>`);$('#cfYes').onclick=()=>{closeModal();onYes();};}
function alertBox(title,msg){modal(`<h2>${title}</h2><p style="text-align:center">${msg}</p><div class="btns"><button class="btn pink" data-a="close">OK</button></div>`);}

function statBars(spec){
 const gearTxt=`${spec.gears.length}-spd · FD ${spec.fd.toFixed(2)}`;
 return `<div class="stat"><span>Power</span><div class="bar"><i style="width:${clamp(spec.hp/14,3,100)}%"></i></div><b>${fmt(spec.hp)} hp</b></div>
 <div class="stat"><span>Weight</span><div class="bar"><i style="width:${clamp((2000-spec.kg)/12,3,100)}%"></i></div><b>${fmt(spec.kg)} kg</b></div>
 <div class="stat"><span>Grip</span><div class="bar"><i style="width:${clamp(spec.grip*55,3,100)}%"></i></div><b>${spec.grip.toFixed(2)} ${spec.drive}</b></div>
 <div class="stat"><span>Gearing</span><div class="bar"><i style="width:${clamp(spec.fd*spec.gears[0]*6,3,100)}%"></i></div><b class="small">${gearTxt}</b></div>`;
}
function thumb(o,big){return `<canvas class="${big?'bigthumb':'thumb'}" data-car="${o.id}" data-color="${o.color||carDef(o.id).color}"></canvas>`;}
function paintThumbs(){
 document.querySelectorAll('canvas[data-car]').forEach(c=>{
  const dpr=window.devicePixelRatio||1,w=c.clientWidth||110,h=c.clientHeight||52;c.width=w*dpr;c.height=h*dpr;
  const x=c.getContext('2d');x.scale(dpr,dpr);
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2a1240');g.addColorStop(1,'#120720');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#0008';x.fillRect(0,h*0.84,w,h*0.16);
  const L=Math.min(w*0.86,h*2.6);drawCar(x,(w-L)/2,h*0.86,L,c.dataset.color,carDef(c.dataset.car).body,0,{});
 });
}
function render(){
 updWallet();
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 screenEl.innerHTML=({race:viewRace,career:viewCareer,garage:viewGarage,dealer:viewDealer,settings:viewSettings})[tab]();
 paintThumbs();
}
function viewRace(){
 const me=activeCar(),sp=buildSpec(me);
 let h=`<h2>Street Races</h2><div class="card row">${thumb(me)}<div class="grow"><b>${sp.name}</b> <span class="badge cls-${sp.cls}">${sp.cls}</span><div class="muted">${fmt(sp.hp)} hp · ${fmt(sp.kg)} kg · ${S.cars.length} car${S.cars.length>1?'s':''} owned</div></div></div>
 <div class="row" style="justify-content:space-between;margin:6px 0 8px"><span class="muted">Win coin races or bet your ride in a Pink Slip.</span><button class="btn sm dark" data-a="refresh">↻ New rivals</button></div>`;
 S.opps.forEach(o=>{const os=buildSpec(o.car),entry=ENTRY[os.cls],win=entry+Math.round(entry*DIFFS[o.diff].mult);
  h+=`<div class="card"><div class="row">${thumb(o.car)}<div class="grow"><b>${o.name}</b><div><span class="badge d-${o.diff}">${o.diff}</span><span class="badge cls-${os.cls}">${os.cls}</span><span class="badge">${o.dist} mi</span></div><div class="muted">${os.name} · ${fmt(os.hp)} hp · ${fmt(os.kg)} kg</div></div></div>
  <div class="btns"><button class="btn green sm" data-a="race" data-id="${o.id}">Race · entry ${priceTag('coins',entry)}<br><span class="small">win ${priceTag('coins',win)}</span></button><button class="btn pink sm" data-a="pink" data-id="${o.id}">PINK SLIP<br><span class="small">win their ${os.name}</span></button></div></div>`;});
 return h;
}
function viewCareer(){
 let h=`<h2>Career Ladder</h2><p class="muted">Beat each boss to climb the ladder. Beat Queen Pinkslip to win her Nova Hyper!</p>`;
 BOSSES.forEach((b,i)=>{const o=bossCar(i),sp=buildSpec(o);const done=i<S.career,cur=i===S.career;
  h+=`<div class="card boss ${cur?'cur':''} ${i>S.career?'locked':''}"><div class="row">${thumb(o)}<div class="grow"><b>#${i+1} ${b.name}</b> ${done?'✅':''}<div><span class="badge d-Boss">BOSS</span><span class="badge d-${b.diff}">${b.diff}</span><span class="badge cls-${sp.cls}">${sp.cls}</span><span class="badge">${b.dist} mi</span></div><div class="muted">${sp.name} · ${fmt(sp.hp)} hp</div><div class="small">Reward: ${priceTag('coins',b.coins)} ${priceTag('gems',b.gems)}${b.pink?' + her car':''}</div></div></div>
  ${cur?`<div class="btns"><button class="btn pink" data-a="boss" data-i="${i}">CHALLENGE</button></div>`:done?`<div class="btns"><button class="btn dark sm" data-a="boss" data-i="${i}">Rematch (no reward)</button></div>`:''}</div>`;});
 if(S.career>=BOSSES.length)h=`<div class="card" style="text-align:center"><b>👑 You are the Pink Slip Champion!</b></div>`+h;
 return h;
}
function bossCar(i){const b=BOSSES[i];const o=newOwned(b.car,b.lvl);o.uid='boss'+i;o.color=['#222','#fff','#ff4fa3'][i%3];return o;}
function viewGarage(){
 const me=activeCar(),sp=buildSpec(me),d=carDef(me.id);
 if(garageView==='upgrades'){
  let h=`<div class="row"><button class="btn sm dark" data-a="gview" data-v="main">← Back</button><h2 style="margin:0">Upgrades</h2></div><div class="card">${thumb(me,true)}<b>${sp.name}</b>${statBars(sp)}</div>`;
  UPG.forEach(g=>{const l=me.up[g.k],maxed=l>=MAXLVL,c=upgCost(d,l),gc=upgGemCost(d,l);
   h+=`<div class="card"><div class="row"><div class="grow"><b>${g.name}</b> <span class="muted">Lv ${l}/${MAXLVL}</span><div class="muted">${g.desc}</div><div class="lvl">${[1,2,3,4,5].map(n=>`<i class="${n<=l?'on':''}"></i>`).join('')}</div></div></div>
   ${maxed?'<div class="muted" style="margin-top:6px">MAXED</div>':`<div class="btns"><button class="btn gold sm" data-a="upg" data-k="${g.k}" data-c="coins" ${canAfford('coins',c)?'':'disabled'}>${priceTag('coins',c)}</button><button class="btn pink sm" data-a="upg" data-k="${g.k}" data-c="gems" ${canAfford('gems',gc)?'':'disabled'}>${priceTag('gems',gc)}</button></div>`}</div>`;});
  return h;
 }
 if(garageView==='tune'){
  const t=me.tune||{gears:d.gears.slice(),fd:d.fd};
  const e4=estimateET(sp,QUARTER),e8=estimateET(sp,EIGHTH);
  let h=`<div class="row"><button class="btn sm dark" data-a="gview" data-v="main">← Back</button><h2 style="margin:0">Tuning</h2></div>
  <div class="card"><b>${sp.name}</b><div class="muted">Shorter (higher) ratios = harder launch, more shifts. Taller (lower) = higher top speed.</div>
  <div class="row" style="margin-top:8px"><div class="grow"><b id="et4">${e4.et.toFixed(3)}s</b> <span class="muted">¼ mi @ ${mph(e4.trap).toFixed(1)} mph</span></div><div class="grow"><b id="et8">${e8.et.toFixed(3)}s</b> <span class="muted">⅛ mi</span></div></div><div class="muted">Estimated perfect-run times (dyno sim)</div></div><div class="card">`;
  t.gears.forEach((g,i)=>{h+=`<div class="row small"><span style="width:56px">Gear ${i+1}</span><input type="range" min="${(d.gears[i]*0.7).toFixed(2)}" max="${(d.gears[i]*1.3).toFixed(2)}" step="0.01" value="${g}" data-tune="g${i}"><b style="width:40px" id="tv-g${i}">${g.toFixed(2)}</b></div>`;});
  h+=`<div class="row small"><span style="width:56px">Final</span><input type="range" min="2.50" max="5.50" step="0.01" value="${t.fd}" data-tune="fd"><b style="width:40px" id="tv-fd">${t.fd.toFixed(2)}</b></div>
  <div class="btns"><button class="btn dark sm" data-a="tunereset">Reset to stock</button></div></div>`;
  return h;
 }
 let h=`<h2>Garage</h2><div class="card">${thumb(me,true)}<div class="row"><div class="grow"><b style="font-size:17px">${sp.name}</b> <span class="badge cls-${sp.cls}">${sp.cls}</span></div><span class="muted">Active</span></div>${statBars(sp)}
 <div class="btns"><button class="btn pink" data-a="gview" data-v="upgrades">Upgrades</button><button class="btn blue" data-a="gview" data-v="tune">Tuning</button></div></div><h3>Your Cars (${S.cars.length})</h3>`;
 S.cars.forEach(o=>{const s=buildSpec(o),lv=UPG.reduce((a,g)=>a+o.up[g.k],0);
  h+=`<div class="card row">${thumb(o)}<div class="grow"><b>${s.name}</b> <span class="badge cls-${s.cls}">${s.cls}</span><div class="muted">${fmt(s.hp)} hp · upg ${lv}/30</div>
  <div class="btns">${o.uid===S.active?'<span class="muted">✔ Driving</span>':`<button class="btn green sm" data-a="select" data-u="${o.uid}">Drive</button><button class="btn dark sm" data-a="sell" data-u="${o.uid}">Sell ${priceTag('coins',carValue(o))}</button>`}</div></div></div>`;});
 return h;
}
function viewDealer(){
 let h=`<h2>Dealer</h2>`;
 CLASSES.forEach(cl=>{h+=`<h3>Class ${cl}</h3>`;CARS.filter(c=>c.cls===cl).forEach(c=>{const sp=buildSpec(newOwned(c.id,0));const own=S.cars.filter(o=>o.id===c.id).length;
  h+=`<div class="card"><div class="row">${thumb({id:c.id,color:c.color})}<div class="grow"><b>${c.name}</b> <span class="badge cls-${cl}">${cl}</span>${own?`<span class="badge">Owned ×${own}</span>`:''}<div class="muted">${c.drive} · ${c.gears.length}-speed</div></div></div>${statBars(sp)}
  <div class="btns"><button class="btn ${c.cur==='gems'?'pink':'gold'}" data-a="buy" data-id="${c.id}" ${canAfford(c.cur,c.price)?'':'disabled'}>${c.price?'Buy '+priceTag(c.cur,c.price):'Free'}</button></div></div>`;});});
 return h;
}
function viewSettings(){
 const st=S.stats;
 return `<h2>Settings</h2>
 <div class="card row"><div class="grow"><b>Sound</b><div class="muted">Engine & effects</div></div><button class="toggle ${S.settings.sound?'on':''}" data-a="sound"></button></div>
 <h3>🕹️ Cheat Menu</h3>
 <div class="card"><div class="row"><div class="grow"><b>Infinite coins & gems</b><div class="muted">Buy anything without spending</div></div><button id="cheatInf" class="toggle ${S.settings.infinite?'on':''}" data-a="infinite"></button></div>
 <div style="margin-top:12px"><input type="number" id="cheatAmt" placeholder="Amount (e.g. 1000000)" inputmode="numeric" value="100000"></div>
 <div class="btns"><button class="btn gold sm" data-a="addc" id="addCoins">Add coins</button><button class="btn pink sm" data-a="addg" id="addGems">Add gems</button></div>
 <div class="btns"><button class="btn dark sm" data-a="quick" data-c="coins" data-n="1000000">+1M coins</button><button class="btn dark sm" data-a="quick" data-c="gems" data-n="10000">+10K gems</button></div>
 <div class="btns"><button class="btn dark sm" data-a="maxcar">Max upgrade current car</button><button class="btn dark sm" data-a="unlockall">Unlock all bosses</button></div></div>
 <h3>Stats</h3><div class="card small">Races: <b>${st.races}</b> · Wins: <b>${st.wins}</b> · Losses: <b>${st.losses}</b><br>Pink slips won: <b>${st.pinkWon}</b> · lost: <b>${st.pinkLost}</b><br>Best ¼ mi: <b>${st.best14?st.best14.toFixed(3)+'s':'—'}</b> · Best ⅛ mi: <b>${st.best18?st.best18.toFixed(3)+'s':'—'}</b></div>
 <h3>How to play</h3><div class="card small">1. Before the green light, <b>hold GAS</b> (or ↑ / W) to rev. Keep the needle in the <b style="color:#3ddc84">green zone</b> when the light turns green for a perfect launch.<br>2. Tap <b>SHIFT</b> (Space / →) when the needle hits the <b style="color:#4dd6ff">blue zone</b> and shift lights flash.<br>3. Tap <b>NOS</b> (N / Shift) once for a nitrous boost.<br>Game saves automatically on this device.</div>
 <div class="btns"><button class="btn dark sm" data-a="export">Export save</button><button class="btn dark sm" data-a="import">Import save</button><button class="btn sm" style="background:#7a1030" data-a="reset">Reset game</button></div>`;
}

document.getElementById('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.tab;garageView='main';render();screenEl.scrollTop=0;});
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a==='close'){closeModal();return;}
 if(b.disabled)return;
 const me=activeCar();
 switch(a){
  case 'refresh':genOpps();render();break;
  case 'race':case 'pink':{const o=S.opps.find(x=>x.id===b.dataset.id);if(!o)return;const os=buildSpec(o.car);
   if(a==='race'){const entry=ENTRY[os.cls];if(!canAfford('coins',entry)){alertBox('Not enough coins',`Entry fee is ${fmt(entry)} coins.`);return;}
    spend('coins',entry);startRace({opp:o,mode:'coins',entry,dist:o.dist});}
   else{if(S.cars.length<2){alertBox('Need a backup ride','You need at least 2 cars to race for pink slips — you can\'t bet your only car. Buy another car at the Dealer.');return;}
    confirmBox('⚠️ PINK SLIP',`Race <b>${o.name}</b> for pink slips?<br><br>Win: you get their <b>${os.name}</b>.<br>Lose: they take your <b>${buildSpec(me).name}</b> for good!`,'Bet my car',()=>startRace({opp:o,mode:'pink',dist:o.dist}),true);}
   break;}
  case 'boss':{const i=+b.dataset.i,bs=BOSSES[i];startRace({opp:{name:bs.name,diff:bs.diff,car:bossCar(i),dist:bs.dist},mode:'boss',bossIdx:i,dist:bs.dist});break;}
  case 'gview':garageView=b.dataset.v;render();screenEl.scrollTop=0;break;
  case 'upg':{const k=b.dataset.k,cur=b.dataset.c,d=carDef(me.id),l=me.up[k];if(l>=MAXLVL)return;const c=cur==='coins'?upgCost(d,l):upgGemCost(d,l);
   if(spend(cur,c)){me.up[k]++;save();toast(`${UPG.find(g=>g.k===k).name} → Lv ${me.up[k]}`);const st=screenEl.scrollTop;render();screenEl.scrollTop=st;}break;}
  case 'tunereset':me.tune=null;save();render();break;
  case 'select':S.active=b.dataset.u;genOpps();save();render();toast('Car selected');break;
  case 'sell':{const o=S.cars.find(c=>c.uid===b.dataset.u);if(!o)return;const v=carValue(o);confirmBox('Sell car?',`Sell your ${carDef(o.id).name} for ${fmt(v)} coins?`,'Sell',()=>{S.cars=S.cars.filter(c=>c!==o);earn('coins',v);save();render();},true);break;}
  case 'buy':{const c=carDef(b.dataset.id);confirmBox('Buy car?',`Buy the ${c.name} for ${fmt(c.price)} ${c.cur}?`,'Buy',()=>{if(spend(c.cur,c.price)){const o=newOwned(c.id,0);S.cars.push(o);S.active=o.uid;genOpps();save();render();toast(`${c.name} added & selected!`);}});break;}
  case 'sound':S.settings.sound=!S.settings.sound;save();render();break;
  case 'infinite':S.settings.infinite=!S.settings.infinite;save();render();toast(S.settings.infinite?'Infinite coins & gems ON':'Infinite OFF');break;
  case 'addc':case 'addg':{const n=Math.floor(+$('#cheatAmt').value||0);if(n>0){earn(a==='addc'?'coins':'gems',n);toast(`+${fmt(n)} ${a==='addc'?'coins':'gems'}`);render();}break;}
  case 'quick':earn(b.dataset.c,+b.dataset.n);toast(`+${fmt(+b.dataset.n)} ${b.dataset.c}`);render();break;
  case 'maxcar':UPG.forEach(g=>me.up[g.k]=MAXLVL);save();toast('Car maxed out!');render();break;
  case 'unlockall':S.career=Math.max(S.career,BOSSES.length-1);save();toast('Final boss unlocked');render();break;
  case 'export':modal(`<h2>Save data</h2><textarea style="width:100%;height:160px;background:#0e0517;color:#fff;border-radius:8px" readonly>${btoa(unescape(encodeURIComponent(JSON.stringify(S))))}</textarea><div class="btns"><button class="btn pink" data-a="close">Done</button></div>`);break;
  case 'import':modal(`<h2>Import save</h2><textarea id="impTxt" style="width:100%;height:160px;background:#0e0517;color:#fff;border-radius:8px"></textarea><div class="btns"><button class="btn dark" data-a="close">Cancel</button><button class="btn pink" id="impGo">Import</button></div>`);
   $('#impGo').onclick=()=>{try{const j=JSON.parse(decodeURIComponent(escape(atob($('#impTxt').value.trim()))));if(!j.cars)throw 0;localStorage.setItem(SAVE_KEY,JSON.stringify(j));load();closeModal();render();toast('Save imported');}catch(e){toast('Invalid save');}};break;
  case 'reset':confirmBox('Reset game?','This erases all cars, coins and progress.','Reset',()=>{localStorage.removeItem(SAVE_KEY);load();genOpps();render();},true);break;
 }
});
screenEl.addEventListener('input',e=>{
 const k=e.target.dataset.tune;if(!k)return;const me=activeCar(),d=carDef(me.id);
 if(!me.tune)me.tune={gears:d.gears.slice(),fd:d.fd};
 const v=+e.target.value;if(k==='fd')me.tune.fd=v;else me.tune.gears[+k.slice(1)]=v;
 $('#tv-'+k).textContent=v.toFixed(2);save();
 const sp=buildSpec(me),e4=estimateET(sp,QUARTER),e8=estimateET(sp,EIGHTH);
 $('#et4').textContent=e4.et.toFixed(3)+'s';$('#et8').textContent=e8.et.toFixed(3)+'s';
});

/* ================= CAR DRAWING ================= */
const BODIES={
 hatch:{p:[[0.02,0.22],[0,0.55],[0.04,0.64],[0.16,0.96],[0.55,0.98],[0.72,0.64],[0.96,0.54],[1,0.32],[0.97,0.2]],w:[[0.19,0.66],[0.27,0.9],[0.53,0.92],[0.66,0.66]],wh:[0.2,0.8]},
 coupe:{p:[[0,0.24],[0.01,0.55],[0.12,0.62],[0.3,0.92],[0.58,0.93],[0.75,0.62],[0.98,0.5],[1,0.28],[0.97,0.18]],w:[[0.18,0.63],[0.32,0.86],[0.56,0.87],[0.69,0.63]],wh:[0.19,0.8]},
 muscle:{p:[[0,0.24],[0,0.64],[0.2,0.68],[0.32,0.95],[0.55,0.95],[0.66,0.7],[0.99,0.62],[1,0.28],[0.97,0.18]],w:[[0.24,0.69],[0.34,0.9],[0.53,0.9],[0.61,0.69]],wh:[0.18,0.8]},
 sedan:{p:[[0,0.24],[0.01,0.58],[0.17,0.63],[0.3,0.95],[0.62,0.95],[0.76,0.63],[0.98,0.55],[1,0.28],[0.97,0.18]],w:[[0.21,0.64],[0.32,0.89],[0.6,0.89],[0.71,0.64]],wh:[0.19,0.8]},
 super:{p:[[0,0.3],[0.02,0.56],[0.25,0.6],[0.42,0.86],[0.6,0.86],[0.82,0.5],[1,0.36],[1,0.24],[0.97,0.14]],w:[[0.32,0.62],[0.44,0.82],[0.58,0.82],[0.74,0.56]],wh:[0.2,0.8],spoiler:true}
};
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return `rgb(${r},${g},${b})`;}
function drawCar(x,ox,gy,L,color,body,wa,o){
 const B=BODIES[body]||BODIES.coupe,h=L*0.3,wr=L*0.085;
 const P=(px,py)=>[ox+px*L,gy-py*h];
 x.save();
 x.fillStyle='rgba(0,0,0,0.35)';x.beginPath();x.ellipse(ox+L/2,gy,L*0.52,L*0.03,0,0,Math.PI*2);x.fill();
 if(o.flame){const [fx,fy]=P(0,0.32);const fl=L*(0.25+Math.random()*0.15);const g=x.createLinearGradient(fx,0,fx-fl,0);g.addColorStop(0,'#fff');g.addColorStop(0.3,'#4dd6ff');g.addColorStop(1,'rgba(255,79,163,0)');x.fillStyle=g;x.beginPath();x.moveTo(fx,fy-h*0.08);x.lineTo(fx-fl,fy);x.lineTo(fx,fy+h*0.08);x.fill();}
 if(B.spoiler){x.fillStyle=shade(color,-0.5);const [a1,b1]=P(0.02,0.58);x.fillRect(a1-L*0.01,b1-h*0.25,L*0.13,h*0.07);x.fillRect(a1+L*0.04,b1-h*0.2,L*0.015,h*0.2);}
 const g=x.createLinearGradient(0,gy-h,0,gy);g.addColorStop(0,shade(color,0.35));g.addColorStop(0.5,color);g.addColorStop(1,shade(color,-0.45));
 x.fillStyle=g;x.strokeStyle=shade(color,-0.6);x.lineWidth=Math.max(1,L*0.006);
 x.beginPath();B.p.forEach((p,i)=>{const [a,b]=P(p[0],p[1]);i?x.lineTo(a,b):x.moveTo(a,b);});x.closePath();x.fill();x.stroke();
 x.fillStyle='#ffffff55';x.fillRect(ox+L*0.05,gy-h*0.47,L*0.88,Math.max(1,h*0.03));
 const wg=x.createLinearGradient(0,gy-h,0,gy-h*0.6);wg.addColorStop(0,'#9fd8ff');wg.addColorStop(1,'#1b2a4a');x.fillStyle=wg;
 x.beginPath();B.w.forEach((p,i)=>{const [a,b]=P(p[0],p[1]);i?x.lineTo(a,b):x.moveTo(a,b);});x.closePath();x.fill();
 x.fillStyle='#ffe66d';const [hx,hy]=P(0.975,0.42);x.fillRect(hx-L*0.02,hy-h*0.05,L*0.025,h*0.09);
 x.fillStyle='#ff2b2b';const [tx,ty]=P(0.005,0.48);x.fillRect(tx,ty-h*0.05,L*0.02,h*0.09);
 B.wh.forEach(wx=>{const cx=ox+wx*L,cy=gy-wr;x.fillStyle='#0b0b0b';x.beginPath();x.arc(cx,cy,wr,0,Math.PI*2);x.fill();x.fillStyle='#b8bcc6';x.beginPath();x.arc(cx,cy,wr*0.58,0,Math.PI*2);x.fill();
  x.strokeStyle='#4a4f5a';x.lineWidth=Math.max(1,wr*0.14);for(let k=0;k<5;k++){const an=wa+k*Math.PI*2/5;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(an)*wr*0.55,cy+Math.sin(an)*wr*0.55);x.stroke();}
  x.fillStyle='#333';x.beginPath();x.arc(cx,cy,wr*0.15,0,Math.PI*2);x.fill();});
 x.restore();
}

/* ================= SOUND ================= */
const Snd={ctx:null,eng:null,
 init(){if(!S.settings.sound)return;try{if(!this.ctx)this.ctx=new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume();}catch(e){}},
 start(){if(!S.settings.sound||!this.ctx||this.eng)return;const c=this.ctx;const o1=c.createOscillator(),o2=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o1.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=900;g.gain.value=0.0;o1.connect(f);o2.connect(f);f.connect(g);g.connect(c.destination);o1.start();o2.start();this.eng={o1,o2,f,g};},
 update(rpm,load){if(!this.eng)return;const fq=rpm/60*2;const t=this.ctx.currentTime;this.eng.o1.frequency.setTargetAtTime(fq,t,0.02);this.eng.o2.frequency.setTargetAtTime(fq*0.5,t,0.02);this.eng.f.frequency.setTargetAtTime(500+rpm*0.18,t,0.03);this.eng.g.gain.setTargetAtTime(0.03+0.05*load,t,0.05);},
 stop(){if(!this.eng)return;try{this.eng.g.gain.setTargetAtTime(0,this.ctx.currentTime,0.05);const e=this.eng;setTimeout(()=>{e.o1.stop();e.o2.stop();},300);}catch(e){}this.eng=null;},
 beep(f,d,type){if(!S.settings.sound||!this.ctx)return;const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.value=f;g.gain.value=0.08;g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d);},
 whoosh(){if(!S.settings.sound||!this.ctx)return;const c=this.ctx,n=c.sampleRate*1.5,buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.value=1800;g.gain.value=0.15;s.buffer=buf;s.connect(f);f.connect(g);g.connect(c.destination);s.start();}
};

/* ================= RACE ================= */
const cv=$('#cv'),ctx=cv.getContext('2d'),rv=$('#raceView'),btnL=$('#btnL'),btnR=$('#btnR');
let R=null,W=0,H=0,DPR=1;
const TREE_T=[1.4,1.9,2.4,2.9]; // ambers..green
let SAT=0;
function resize(){const pr=document.getElementById('satProbe');SAT=pr?parseFloat(getComputedStyle(pr).paddingTop)||0:0;DPR=Math.min(window.devicePixelRatio||1,3);W=rv.clientWidth;H=rv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
window.addEventListener('resize',()=>{if(R)resize();});
function startRace(opts){
 Snd.init();
 const me=activeCar();const ps=buildSpec(me),os=buildSpec(opts.opp.car);
 const dist=opts.dist==='1/8'?EIGHTH:QUARTER;
 R={opts,dist,me:new Racer(ps,null),opp:new Racer(os,{diff:opts.opp.diff}),phase:'tree',clock:0,raceT:0,gas:false,preRpm:900,popups:[],done:false,doneT:0,seed:Math.random()*1000,launchMsg:null,bots:{}};
 R.oppLaunchRpm=R.opp.aiLaunchRpm();
 rv.classList.remove('hidden');resize();setBtns();Snd.start();
 lastTS=performance.now();requestAnimationFrame(loop);
}
function setBtns(){
 if(!R)return;
 if(R.phase==='tree'){btnL.textContent='GAS';btnL.className='rbtn gas';btnR.textContent='SHIFT';btnR.className='rbtn shift';btnR.style.opacity=0.5;}
 else{btnR.style.opacity=1;btnL.textContent='NOS';btnL.className='rbtn '+(R.me.nosUsed?'used':'nos');}
}
function popup(text,color){R.popups.push({text,color,t:0});}
function doShift(){if(!R||R.phase!=='run')return;const g=R.me.shift();if(g){popup(g==='PERFECT'?'PERFECT SHIFT!':g+' SHIFT',{PERFECT:'#4dd6ff',GOOD:'#3ddc84',EARLY:'#ffd43b',LATE:'#ff6b6b'}[g]);Snd.beep(g==='PERFECT'?880:440,0.08);}}
function doNos(){if(!R||R.phase!=='run')return;if(R.me.nitrous()){popup('NITROUS!','#ff4fa3');Snd.whoosh();setBtns();}}
function gasDown(){if(!R)return;Snd.init();if(R.phase==='tree')R.gas=true;else doNos();}
function gasUp(){if(R)R.gas=false;}
function press(el,down,up){
 el.addEventListener('touchstart',e=>{e.preventDefault();el.classList.add('pressed');down();},{passive:false});
 el.addEventListener('touchend',e=>{e.preventDefault();el.classList.remove('pressed');up&&up();},{passive:false});
 el.addEventListener('touchcancel',e=>{el.classList.remove('pressed');up&&up();});
 el.addEventListener('mousedown',e=>{el.classList.add('pressed');down();});
 el.addEventListener('mouseup',e=>{el.classList.remove('pressed');up&&up();});
 el.addEventListener('mouseleave',e=>{el.classList.remove('pressed');up&&up();});
}
press(btnL,gasDown,gasUp);press(btnR,doShift);
document.addEventListener('keydown',e=>{if(!R||e.repeat)return;const k=e.key;
 if(k==='ArrowUp'||k==='w'||k==='W'){R.phase==='tree'?(R.gas=true):0;e.preventDefault();}
 else if(k===' '||k==='ArrowRight'||k==='d'||k==='D'){doShift();e.preventDefault();}
 else if(k==='n'||k==='N'||k==='Shift'){doNos();e.preventDefault();}
 else if(k==='Escape')quitRace();});
document.addEventListener('keyup',e=>{if(!R)return;if(e.key==='ArrowUp'||e.key==='w'||e.key==='W')R.gas=false;});
$('#btnQuit').addEventListener('click',()=>{if(!R)return;if(R.done){quitRace();return;}confirmBox('Quit race?',R.opts.mode==='pink'?'Forfeiting a pink slip race counts as a LOSS — you lose your car!':'Entry fee is not refunded.','Quit',()=>{if(!R)return;if(R.phase==='tree'&&R.opts.mode!=='pink'){quitRace();return;}R.me.fin=true;R.me.et=999;R.forfeit=true;finishRace();},true);});
function quitRace(){Snd.stop();R=null;rv.classList.add('hidden');render();}

let lastTS=0;
function loop(ts){
 if(!R)return;
 let dt=Math.min(0.05,(ts-lastTS)/1000);lastTS=ts;
 update(dt);draw();
 if(R)requestAnimationFrame(loop);
}
function update(dt){
 R.clock+=dt;
 R.popups.forEach(p=>p.t+=dt);R.popups=R.popups.filter(p=>p.t<1.2);
 if(R.phase==='tree'){
  const s=R.me.spec;
  if(R.gas)R.preRpm+=s.redline*1.1*dt;else R.preRpm-=s.redline*0.75*dt;
  R.preRpm=clamp(R.preRpm,900,s.redline);if(R.preRpm>=s.redline)R.preRpm-=s.redline*0.06*Math.random();
  R.me.rpm=R.preRpm;
  R.opp.rpm=R.clock>0.8?R.oppLaunchRpm+Math.sin(R.clock*9)*80:900;
  const tl=TREE_T.findIndex(t=>R.clock<t);
  if(R.lastLight!==tl){R.lastLight=tl;if(tl>0)Snd.beep(600,0.12);}
  if(R.clock>=TREE_T[3]){
   const g=R.me.launch(R.preRpm);R.opp.launch(R.oppLaunchRpm);R.phase='run';R.raceT=0;Snd.beep(1200,0.25);
   popup(g==='PERFECT'?'PERFECT LAUNCH!':g==='GOOD'?'GOOD LAUNCH':g,{PERFECT:'#4dd6ff',GOOD:'#3ddc84',WHEELSPIN:'#ff6b6b',BOG:'#ffd43b'}[g]);setBtns();
  }
  Snd.update(R.preRpm,R.gas?1:0.2);
  return;
 }
 const sub=Math.ceil(dt/(1/240)),h=dt/sub;
 for(let i=0;i<sub;i++){R.raceT+=h;R.me.step(h,R.raceT,R.dist);R.opp.step(h,R.raceT,R.dist);}
 if(R.raceT>60&&!R.me.fin){R.me.fin=true;R.me.et=R.raceT;}
 // if opp hasn't finished long after us, fast-sim it
 if(R.me.fin&&!R.opp.fin&&R.raceT>R.me.et+2.5){let t=R.raceT;while(!R.opp.fin&&t<90){t+=1/240;R.opp.step(1/240,t,R.dist);}if(!R.opp.fin){R.opp.fin=true;R.opp.et=99;}}
 Snd.update(R.me.rpm,R.me.shiftT>0?0.2:1);
 if(R.me.fin&&R.opp.fin&&!R.done){R.done=true;R.doneT=R.clock;}
 if(R.done&&!R.resultShown&&R.clock-R.doneT>1.0)finishRace();
}
function finishRace(){
 if(!R||R.resultShown)return;R.resultShown=true;R.done=true;
 const me=R.me,op=R.opp,o=R.opts,win=!R.forfeit&&me.et<op.et;
 S.stats.races++;win?S.stats.wins++:S.stats.losses++;
 if(!R.forfeit){const k=R.dist===QUARTER?'best14':'best18';if(!S.stats[k]||me.et<S.stats[k])S.stats[k]=me.et;}
 let reward='';const myCar=activeCar();
 if(o.mode==='coins'){if(win){const w=o.entry+Math.round(o.entry*DIFFS[o.opp.diff].mult),gm=DIFFS[o.opp.diff].gems;earn('coins',w);if(gm)earn('gems',gm);reward=`+${priceTag('coins',w)}${gm?' +'+priceTag('gems',gm):''}`;}else reward=`Lost entry fee (${priceTag('coins',o.entry)})`;}
 else if(o.mode==='pink'){
  if(win){const nc=JSON.parse(JSON.stringify(o.opp.car));nc.uid=uid();S.cars.push(nc);S.stats.pinkWon++;S.opps=S.opps.filter(x=>x.id!==o.opp.id);reward=`🏆 You won <b>${o.opp.name}'s ${carDef(nc.id).name}</b>! It's in your garage.`;}
  else{S.cars=S.cars.filter(c=>c.uid!==myCar.uid);S.active=S.cars[0].uid;S.stats.pinkLost++;reward=`💔 ${o.opp.name} took your <b>${carDef(myCar.id).name}</b>.`;}
 }else if(o.mode==='boss'){
  const b=BOSSES[o.bossIdx];
  if(win&&o.bossIdx===S.career){S.career++;earn('coins',b.coins);earn('gems',b.gems);reward=`Boss defeated! +${priceTag('coins',b.coins)} +${priceTag('gems',b.gems)}`;if(b.pink){const nc=bossCar(o.bossIdx);nc.uid=uid();S.cars.push(nc);reward+=`<br>🏆 You won her <b>${carDef(nc.id).name}</b>!`;}}
  else reward=win?'Rematch won (no reward)':'Boss wins this time. Upgrade and try again!';
 }
 save();
 const row=(n,r,s)=>`<tr><td>${n}</td><td>${r.et>=99?'DNF':r.et.toFixed(3)+'s'}</td><td>${mph(r.trap).toFixed(1)}</td><td>${r.launchGrade||'-'}</td><td>${r.shifts.PERFECT}/${r.shifts.PERFECT+r.shifts.GOOD+r.shifts.EARLY+r.shifts.LATE}</td></tr>`;
 const again=o.mode==='coins'&&S.opps.find(x=>x.id===o.opp.id);
 modal(`<h2 class="${win?'res-win':'res-lose'}" id="resTitle">${win?'YOU WIN!':R.forfeit?'FORFEIT':'YOU LOSE'}</h2>
 <div class="muted" style="text-align:center">${o.mode==='pink'?'PINK SLIP RACE':o.mode==='boss'?'BOSS RACE':'COIN RACE'} · ${R.dist===QUARTER?'¼':'⅛'} mile vs ${o.opp.name}</div>
 <table class="rt"><tr><th></th><th>Time</th><th>MPH</th><th>Launch</th><th>Perfect</th></tr>${row('You',me)}${row(o.opp.name,op)}</table>
 ${!R.forfeit&&win?`<div class="small" style="text-align:center">Won by ${(op.et-me.et).toFixed(3)}s</div>`:''}
 <p style="text-align:center;font-size:15px" id="resReward">${reward}</p>
 <div class="btns">${again?'<button class="btn green" id="resAgain">Race again</button>':''}<button class="btn pink" id="resBack">Continue</button></div>`);
 $('#resBack').onclick=()=>{closeModal();quitRace();};
 if(again)$('#resAgain').onclick=()=>{closeModal();const en=ENTRY[buildSpec(again.car).cls];if(!canAfford('coins',en)){quitRace();alertBox('Not enough coins','');return;}spend('coins',en);Snd.stop();R=null;startRace({opp:again,mode:'coins',entry:en,dist:again.dist});};
 updWallet();
}

/* ---------- drawing ---------- */
function hash(n){const s=Math.sin(n*127.1+R.seed)*43758.5453;return s-Math.floor(s);}
function draw(){
 const trackH=Math.round(H*0.46),me=R.me,op=R.opp;
 ctx.clearRect(0,0,W,H);
 const ppm=Math.max(14,W/24),camX=me.x-(W*0.28)/ppm;
 // sky
 let g=ctx.createLinearGradient(0,0,0,trackH*0.55);g.addColorStop(0,'#0b0420');g.addColorStop(0.7,'#3a0f4f');g.addColorStop(1,'#ff4fa3');ctx.fillStyle=g;ctx.fillRect(0,0,W,trackH*0.55);
 ctx.fillStyle='#fff';for(let i=0;i<40;i++){ctx.globalAlpha=0.3+hash(i)*0.6;ctx.fillRect(hash(i+50)*W,hash(i+90)*trackH*0.4,1.5,1.5);}ctx.globalAlpha=1;
 // skyline parallax
 const hz=trackH*0.55;
 [[0.15,'#1d0b30',0.55],[0.35,'#14072a',0.75]].forEach(([par,col,hm],li)=>{ctx.fillStyle=col;const off=camX*ppm*par;const bw=46;const start=Math.floor(off/bw)-1;
  for(let i=start;i<start+W/bw+3;i++){const hh=(0.25+hash(i*7+li*31)*hm)*hz*0.8;const bx=i*bw-off;ctx.fillStyle=col;ctx.fillRect(bx,hz-hh,bw-4,hh);
   if(li===1){ctx.fillStyle='#ffd86b55';for(let wy=hz-hh+6;wy<hz-6;wy+=9)for(let wx=bx+5;wx<bx+bw-8;wx+=8)if(hash(wx*0.37+wy*1.3)>0.6)ctx.fillRect(wx,wy,3,4);}}});
 // grandstand / ground
 ctx.fillStyle='#1a1a24';ctx.fillRect(0,hz,W,trackH-hz);
 const roadTop=hz+(trackH-hz)*0.18,roadBot=trackH;
 ctx.fillStyle='#2b2b33';ctx.fillRect(0,roadTop,W,roadBot-roadTop);
 const laneOpp=roadTop+(roadBot-roadTop)*0.42,laneMe=roadTop+(roadBot-roadTop)*0.92;
 ctx.fillStyle='#ddd';ctx.fillRect(0,roadTop,W,2);
 // dashes
 ctx.fillStyle='#e8e8e8';const midY=roadTop+(roadBot-roadTop)*0.52;
 for(let m=Math.floor(camX/6)*6;m<camX+W/ppm+6;m+=6){const sx=(m-camX)*ppm;ctx.fillRect(sx,midY,3*ppm,3);}
 // distance boards
 for(let m=0;m<=R.dist;m+=50){const sx=(m-camX)*ppm;if(sx<-60||sx>W+60)continue;ctx.fillStyle='#555';ctx.fillRect(sx,roadTop-26,3,26);ctx.fillStyle='#ffd43b';ctx.fillRect(sx-14,roadTop-40,32,16);ctx.fillStyle='#000';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(Math.round((R.dist-m)*3.28084)+'ft',sx+2,roadTop-28);}
 // start & finish
 [[0,'#fff'],[R.dist,'chk']].forEach(([m,t])=>{const sx=(m-camX)*ppm;if(sx<-30||sx>W+30)return;if(t==='chk'){const sz=8;for(let yy=roadTop;yy<roadBot;yy+=sz)for(let c=0;c<3;c++){ctx.fillStyle=((yy-roadTop)/sz+c)%2<1?'#fff':'#000';ctx.fillRect(sx+c*sz,yy,sz,sz);}ctx.fillStyle='#ff4fa3';ctx.fillRect(sx,roadTop-60,4,60);ctx.font='bold 14px sans-serif';ctx.fillText('FINISH',sx,roadTop-64);}else{ctx.fillStyle='#fff';ctx.fillRect(sx,roadTop,4,roadBot-roadTop);}});
 // cars
 const L=4.4*ppm;
 const drawR=(r,ly)=>{const sx=(r.x-camX)*ppm-L;
  if(r.spin&&r.launched){for(let k=0;k<5;k++){ctx.fillStyle=`rgba(220,220,230,${0.25-k*0.04})`;ctx.beginPath();ctx.arc(sx+L*0.15-k*L*0.15-Math.random()*8,ly-L*0.08-k*3,L*0.08+k*L*0.04,0,Math.PI*2);ctx.fill();}}
  if(sx>-L*1.2&&sx<W+L*0.2)drawCar(ctx,sx,ly,L,r.spec.color,r.spec.body,r.wheelA,{flame:r.nosT>0});
  return sx;};
 const osx=drawR(op,laneOpp);drawR(me,laneMe);
 if(osx<-L||osx>W){const gap=op.x-me.x;ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign=osx<0?'left':'right';ctx.fillText((osx<0?'◀ ':'')+(gap>0?'+':'')+gap.toFixed(1)+'m'+(osx<0?'':' ▶'),osx<0?8:W-8,laneOpp-12);}
 ctx.font='bold 11px sans-serif';ctx.textAlign='left';ctx.fillStyle='#ffffffcc';ctx.fillText(R.opts.opp.name+' · '+op.spec.name,8,laneOpp-L*0.32-6>roadTop?laneOpp-L*0.32-6:roadTop+12);
 // progress bar
 const pbY=SAT+14;
 const pbx=12,pbw=W-70;ctx.fillStyle='#0008';ctx.fillRect(pbx,pbY,pbw,8);
 ctx.fillStyle='#ff4fa3';ctx.fillRect(pbx,pbY,pbw*clamp(me.x/R.dist,0,1),4);ctx.fillStyle='#ffd43b';ctx.fillRect(pbx,pbY+4,pbw*clamp(op.x/R.dist,0,1),4);
 ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';ctx.fillText(`${R.dist===QUARTER?'¼':'⅛'} MILE  ${R.phase==='run'?R.raceT.toFixed(2)+'s':''}`,pbx,pbY+24);
 // tree
 if(R.phase==='tree'||R.raceT<0.8){const tx=W/2,ty=pbY+20;ctx.fillStyle='#111c';ctx.fillRect(tx-22,ty,44,118);
  for(let i=0;i<4;i++){const on=R.phase==='tree'?R.clock>=TREE_T[i]&&(i<3?R.clock<TREE_T[3]:true):i===3;const col=i<3?'#ffb700':'#22ff66';ctx.fillStyle=on?col:'#333';ctx.beginPath();ctx.arc(tx,ty+16+i*28,11,0,Math.PI*2);ctx.fill();if(on){ctx.shadowColor=col;ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;}}
  if(R.phase==='tree'){ctx.font='bold 15px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(R.clock<TREE_T[0]?'HOLD GAS – KEEP NEEDLE IN GREEN':'LAUNCH ZONE!',W/2,ty+140);}}
 // dash area
 g=ctx.createLinearGradient(0,trackH,0,H);g.addColorStop(0,'#1a0a28');g.addColorStop(1,'#07020d');ctx.fillStyle=g;ctx.fillRect(0,trackH,W,H-trackH);
 ctx.fillStyle='#ff4fa3';ctx.fillRect(0,trackH,W,2);
 const btnTop=H-Math.max(120,H*0.24);
 const avail=btnTop-trackH;const rad=Math.min(W*0.3,avail*0.42);const cx=W/2,cy=trackH+avail*0.56;
 drawTach(cx,cy,rad);
 // popups
 R.popups.forEach((p,i)=>{ctx.globalAlpha=1-p.t/1.2;ctx.fillStyle=p.color;ctx.font=`900 italic ${Math.round(Math.min(28,W/14))}px sans-serif`;ctx.textAlign='center';ctx.strokeStyle='#000';ctx.lineWidth=4;const y=trackH*0.62-p.t*30-(R.popups.length-1-i)*34;ctx.strokeText(p.text,W/2,y);ctx.fillText(p.text,W/2,y);ctx.globalAlpha=1;});
}
function drawTach(cx,cy,rad){
 const me=R.me,s=me.spec,rpm=me.rpm,x=rpm/s.redline,maxR=Math.ceil(s.redline/1000+0.5);
 const a0=Math.PI*0.75,a1=Math.PI*2.25,ang=v=>a0+(a1-a0)*clamp(v/(maxR*1000),0,1);
 ctx.fillStyle='#0c0614';ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff4fa3';ctx.lineWidth=3;ctx.stroke();
 const band=(lo,hi,col)=>{ctx.strokeStyle=col;ctx.lineWidth=rad*0.12;ctx.beginPath();ctx.arc(cx,cy,rad*0.86,ang(lo),ang(hi));ctx.stroke();};
 band(s.redline*0.985,maxR*1000,'#d6283b');
 if(R.phase==='tree')band(s.redline*(s.launchC-s.launchW),s.redline*(s.launchC+s.launchW),'#3ddc84');
 else band(s.redline*s.perfLo,s.redline*s.perfHi,'#4dd6ff');
 ctx.strokeStyle='#ddd';ctx.fillStyle='#ddd';ctx.font=`bold ${Math.round(rad*0.13)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
 for(let k=0;k<=maxR;k++){const a=ang(k*1000);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*rad*0.74,cy+Math.sin(a)*rad*0.74);ctx.lineTo(cx+Math.cos(a)*rad*0.66,cy+Math.sin(a)*rad*0.66);ctx.stroke();ctx.fillText(k,cx+Math.cos(a)*rad*0.55,cy+Math.sin(a)*rad*0.55);}
 const na=ang(rpm);ctx.strokeStyle='#ff3b6b';ctx.lineWidth=Math.max(3,rad*0.04);ctx.beginPath();ctx.moveTo(cx-Math.cos(na)*rad*0.12,cy-Math.sin(na)*rad*0.12);ctx.lineTo(cx+Math.cos(na)*rad*0.9,cy+Math.sin(na)*rad*0.9);ctx.stroke();
 ctx.fillStyle='#222';ctx.beginPath();ctx.arc(cx,cy,rad*0.1,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff';ctx.font=`900 ${Math.round(rad*0.36)}px sans-serif`;ctx.fillText(R.phase==='tree'?'N':me.shiftT>0?'-':me.gear,cx,cy+rad*0.38);
 ctx.font=`bold ${Math.round(rad*0.14)}px sans-serif`;ctx.fillStyle='#ffb3d9';ctx.fillText(Math.round(mph(me.v))+' MPH',cx,cy+rad*0.7);
 ctx.fillStyle='#888';ctx.font=`${Math.round(rad*0.09)}px sans-serif`;ctx.fillText('x1000 rpm',cx,cy-rad*0.3);
 // shift lights
 const n=7,sp=Math.min(26,rad*0.26),ly=cy-rad-sp*0.65,inWin=R.phase==='run'&&x>=s.perfLo&&x<=s.perfHi,flash=Math.floor(R.clock*14)%2;
 for(let i=0;i<n;i++){const th=s.perfLo-0.18+i*0.03;let col='#2a2a2a';
  if(R.phase==='run'){if(inWin)col=flash?'#4dd6ff':'#fff';else if(x>=0.985)col='#ff2b2b';else if(x>=th)col=i<3?'#3ddc84':i<5?'#ffd43b':'#ff6b6b';}
  else{const lx=s.launchC;if(Math.abs(x-lx)<=s.launchW)col='#3ddc84';else if(x>=lx-0.3+i*0.05)col='#ffd43b';}
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx+(i-(n-1)/2)*sp,ly,sp*0.36,0,Math.PI*2);ctx.fill();}
 // NOS gauge
 const gx=cx+rad+14,gh=rad*1.4,gy=cy-gh/2,gw=Math.min(18,W*0.04);
 if(gx+gw<W-4){ctx.fillStyle='#0c0614';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle='#4dd6ff';ctx.lineWidth=2;ctx.strokeRect(gx,gy,gw,gh);
  const f=me.nosUsed?me.nosT/s.nosDur:1;ctx.fillStyle='#4dd6ff';ctx.fillRect(gx+2,gy+2+(gh-4)*(1-f),gw-4,(gh-4)*f);ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('NOS',gx+gw/2,gy+gh+10);}
 // opponent mini
 const ox=cx-rad-14-gw;if(ox>4){ctx.fillStyle='#0c0614';ctx.fillRect(ox,gy,gw,gh);ctx.strokeStyle='#ffd43b';ctx.strokeRect(ox,gy,gw,gh);const f=clamp(R.opp.rpm/R.opp.spec.redline,0,1);ctx.fillStyle='#ffd43b';ctx.fillRect(ox+2,gy+2+(gh-4)*(1-f),gw-4,(gh-4)*f);ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('OPP',ox+gw/2,gy+gh+10);}
 ctx.textBaseline='alphabetic';
}

window.PSR={get S(){return S;},get R(){return R;},startRace,buildSpec,estimateET,genOpps,render,CARS};
render();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
