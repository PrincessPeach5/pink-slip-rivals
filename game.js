/* Pink Slip Rivals v2 — original drag racing game. All art procedurally drawn; all names original. */
'use strict';
(function(){
const R_WHEEL=0.32, EFF=0.85, G=9.81;
const CDA={hatch:0.72,coupe:0.64,tuner:0.62,muscle:0.78,sedan:0.70,euro:0.66,super:0.56};
const CLASSES=['D','C','B','A','S'];
const CLASS_MULT={D:1,C:2.2,B:4.5,A:9,S:16};
const QUARTER=402.336, EIGHTH=201.168;
const MARKS=[['t60',18.288],['t330',100.584],['t660',201.168],['t1000',304.8],['t1320',402.336]];
const CARS=[
 {id:'kestrel',name:'Kestrel 1.6',arch:'Tuner',cls:'D',hp:150,kg:1080,grip:0.95,drive:'FWD',redline:7800,gears:[3.30,2.05,1.45,1.12,0.90],fd:4.10,price:0,cur:'coins',color:'#ff4d6d',body:'hatch'},
 {id:'bramble',name:'Bramble GT',arch:'Tuner',cls:'D',hp:190,kg:1200,grip:1.00,drive:'RWD',redline:7200,gears:[3.40,2.15,1.55,1.20,1.00],fd:3.90,price:6000,cur:'coins',color:'#4dabf7',body:'coupe'},
 {id:'ostara',name:'Ostara 2.0T',arch:'Euro',cls:'D',hp:205,kg:1290,grip:0.98,drive:'FWD',redline:6800,gears:[3.36,2.09,1.47,1.10,0.89,0.73],fd:3.94,price:9000,cur:'coins',color:'#f1f3f5',body:'hatch'},
 {id:'vandal',name:'Vandal V6',arch:'Muscle',cls:'C',hp:290,kg:1450,grip:1.00,drive:'RWD',redline:6800,gears:[3.20,2.10,1.50,1.15,0.95,0.80],fd:3.70,price:18000,cur:'coins',color:'#fab005',body:'muscle'},
 {id:'hayate',name:'Hayate S20',arch:'Tuner',cls:'C',hp:265,kg:1250,grip:1.02,drive:'RWD',redline:8300,gears:[3.13,2.05,1.48,1.16,0.94,0.80],fd:4.10,price:21000,cur:'coins',color:'#ffd43b',body:'tuner'},
 {id:'sable',name:'Sable Turbo',arch:'Tuner',cls:'C',hp:315,kg:1330,grip:1.02,drive:'AWD',redline:7200,gears:[3.30,2.10,1.50,1.15,0.92,0.78],fd:3.80,price:24000,cur:'coins',color:'#868e96',body:'sedan'},
 {id:'tempest',name:'Tempest RS',arch:'Tuner',cls:'B',hp:430,kg:1320,grip:1.08,drive:'AWD',redline:7500,gears:[3.10,2.00,1.45,1.12,0.92,0.78],fd:3.90,price:45000,cur:'coins',color:'#20c997',body:'tuner'},
 {id:'corvane',name:'Corvane SS',arch:'Muscle',cls:'B',hp:480,kg:1480,grip:1.05,drive:'RWD',redline:6600,gears:[2.90,1.95,1.42,1.10,0.90,0.75],fd:3.55,price:52000,cur:'coins',color:'#e03131',body:'muscle'},
 {id:'stahl',name:'Stahl GT-S',arch:'Euro',cls:'B',hp:465,kg:1500,grip:1.10,drive:'RWD',redline:7300,gears:[4.11,2.32,1.54,1.18,1.00,0.85,0.69],fd:3.15,price:60000,cur:'coins',color:'#364fc7',body:'euro'},
 {id:'wraith',name:'Wraith GTR',arch:'Tuner',cls:'A',hp:620,kg:1560,grip:1.22,drive:'AWD',redline:7200,gears:[3.00,1.95,1.42,1.10,0.90,0.75],fd:3.70,price:110000,cur:'coins',color:'#f8f9fa',body:'tuner'},
 {id:'hydra',name:'Hydra V8',arch:'Muscle',cls:'A',hp:690,kg:1620,grip:1.10,drive:'RWD',redline:6800,gears:[2.80,1.90,1.40,1.10,0.88,0.72],fd:3.45,price:120000,cur:'coins',color:'#7048e8',body:'muscle'},
 {id:'vellano',name:'Vellano Furia',arch:'Exotic',cls:'S',hp:800,kg:1450,grip:1.22,drive:'RWD',redline:8900,gears:[3.10,2.10,1.60,1.28,1.05,0.87,0.70],fd:3.40,price:180,cur:'gems',color:'#c92a2a',body:'super'},
 {id:'apex',name:'Apex Zero',arch:'Exotic',cls:'S',hp:900,kg:1420,grip:1.30,drive:'AWD',redline:8200,gears:[3.00,2.00,1.48,1.15,0.95,0.80,0.68],fd:3.60,price:250,cur:'gems',color:'#ff922b',body:'super'},
 {id:'nova',name:'Nova Hyper',arch:'Exotic',cls:'S',hp:1150,kg:1500,grip:1.36,drive:'AWD',redline:8500,gears:[2.90,1.95,1.45,1.15,0.95,0.80,0.68],fd:3.50,price:400,cur:'gems',color:'#ff4fa3',body:'super'}
];
const UPG=[
 {k:'intake',name:'Intake',cat:'Performance',desc:'+3% hp per stage',m:0.6},
 {k:'engine',name:'Engine Internals',cat:'Performance',desc:'+6% hp per stage',m:1.0},
 {k:'exhaust',name:'Exhaust',cat:'Performance',desc:'+2.5% hp per stage',m:0.5},
 {k:'turbo',name:'Forced Induction',cat:'Performance',desc:'+7% hp per stage',m:1.2},
 {k:'trans',name:'Drivetrain',cat:'Drivetrain',desc:'Faster shifts, wider PERFECT window',m:0.8},
 {k:'weight',name:'Chassis',cat:'Chassis',desc:'-3.5% weight per stage',m:0.9},
 {k:'tires',name:'Tires',cat:'Grip',desc:'+7% grip per stage · buy any stage directly',m:0.5,direct:true},
 {k:'nosShot',name:'NOS Nozzle (shot)',cat:'Nitrous',desc:'+7% power while spraying',m:0.7},
 {k:'nosTank',name:'NOS Tank',cat:'Nitrous',desc:'+0.35s spray time',m:0.5}
];
const MAXLVL=5;
const DIFFS={
 Easy:{p:[0.2,0.4],tgt:0.86,sd:0.05,up:[-1,-1],nosGear:3,rt:[0.32,0.1],foul:0.04,mult:0.8,gems:0},
 Medium:{p:[0.4,0.4],tgt:0.90,sd:0.03,up:[-1,0],nosGear:3,rt:[0.2,0.06],foul:0.02,mult:1.2,gems:0},
 Hard:{p:[0.65,0.3],tgt:0.925,sd:0.015,up:[-1,0],nosGear:2,rt:[0.11,0.04],foul:0.01,mult:1.8,gems:1},
 Pro:{p:[0.85,0.15],tgt:0.93,sd:0.008,up:[0,1],nosGear:2,rt:[0.05,0.025],foul:0.005,mult:2.5,gems:3},
 Ghost:{p:[1,0],tgt:0,sd:0,up:[0,0],nosGear:2,rt:[0,0],foul:0,mult:0,gems:0}
};
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
const PALETTE=['#ff4d6d','#4dabf7','#fab005','#20c997','#e03131','#7048e8','#f8f9fa','#ff922b','#ff4fa3','#82c91e','#15aabf','#343a40','#e64980','#fd7e14','#212529','#ffd43b'];
const BOT_CREWS=[{tag:'NOS',name:'Nitro Outlaws',color:'#4dd6ff'},{tag:'BSD',name:'Boost Syndicate',color:'#ffd43b'},{tag:'MDN',name:'Midnight Kings',color:'#9775fa'},{tag:'TRQ',name:'Torque Cartel',color:'#ff6b6b'},{tag:'LNC',name:'Launch Control',color:'#69db7c'},{tag:'SPL',name:'Spool Society',color:'#ffa94d'}];
const TERRITORIES=['Neon Docks','Old Mill Rd','Uptown Strip','Airfield 9','Harbor Bridge','Canyon Run','Rail Yard','Sunrise Blvd'];
const UN_A=['Boost','Turbo','Drag','Nitro','Pink','Clutch','Spool','Launch','Quarter','Redline','Torque','Piston','Burnout','Apex','Street','Shift','Midnight','Gearbox','Slick','Rev'];
const UN_B=['King','Queen','Demon','Lord','Rat','God','Boss','Kid','Mafia','Wolf','Ghost','Bandit','Junkie','Fiend','Pilot','Monster','Hustler','Rider'];
const BOSS_COLORS=['#222','#fff','#ff4fa3'];

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rnd=(a,b)=>a+Math.random()*(b-a);
const rint=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
const carDef=id=>CARS.find(c=>c.id===id)||CARS[0];
const uid=()=>Math.random().toString(36).slice(2,10);
function newOwned(id,lvl,color){const u={};UPG.forEach(g=>u[g.k]=typeof lvl==='function'?lvl(g.k):(lvl||0));return {uid:uid(),id,up:u,tune:null,color:color||carDef(id).color};}
function fixUp(o){const u=o.up||{};if(u.nitrous!==undefined){if(u.nosShot===undefined)u.nosShot=u.nitrous;if(u.nosTank===undefined)u.nosTank=u.nitrous;delete u.nitrous;}UPG.forEach(g=>{u[g.k]=clamp(u[g.k]|0,0,MAXLVL);});o.up=u;if(!o.uid)o.uid=uid();return o;}
const mph=v=>v*2.23694;

function buildSpec(o){
 const d=carDef(o.id),u=o.up,t=o.tune||{};
 const hp=d.hp*(1+0.03*u.intake)*(1+0.06*u.engine)*(1+0.025*u.exhaust)*(1+0.07*u.turbo);
 const kg=d.kg*(1-0.035*u.weight);
 const driveF={FWD:0.82,RWD:1.0,AWD:1.18}[d.drive];
 const grip=d.grip*(1+0.07*u.tires)*driveF;
 const gears=(t.gears&&t.gears.length===d.gears.length)?t.gears.slice():d.gears.slice();
 const fd=t.fd||d.fd;
 return {id:d.id,name:d.name,cls:d.cls,arch:d.arch,drive:d.drive,hp,kg,grip,redline:d.redline,gears,fd,cda:CDA[d.body],
  shiftMult:1-0.1*u.trans,perfLo:0.90-0.008*u.trans,perfHi:0.955+0.006*u.trans,
  nosPow:0.2+0.07*u.nosShot,nosDur:2.2+0.35*u.nosTank,
  launchC:clamp(0.76-hp/kg*0.30,0.42,0.74),launchW:0.06,color:o.color||d.color,body:d.body};
}
function powerFrac(x){return x<=0.9?Math.sin(Math.min(x/0.9,1)*Math.PI/2):Math.max(0,1-(x-0.9)*2.5);}
function torqueAt(s,rpm){rpm=Math.max(rpm,1200);const P=s.hp*745.7*powerFrac(rpm/s.redline);return P/(rpm*2*Math.PI/60);}

class Racer{
 constructor(spec,ai){Object.assign(this,{spec,ai,x:0,v:0,gear:1,rpm:900,shiftT:0,nosT:0,nosUsed:false,fin:false,et:0,total:0,trap:0,launched:false,launchT:0,delay:0,launchGrade:null,clutch:0,lastShift:null,spin:false,limiter:false,t:0,shifts:{PERFECT:0,GOOD:0,EARLY:0,LATE:0},wheelA:0,aiTarget:0,slipping:false,splits:{},tireBonus:0,foul:false,rt:0});if(ai)this.newAiTarget();}
 newAiTarget(){const d=DIFFS[this.ai.diff],s=this.spec;this.aiTarget=this.ai.diff==='Ghost'?(s.perfLo+s.perfHi)/2:clamp(d.tgt+gauss()*d.sd,0.7,1.0);}
 gradeOf(rpm){const s=this.spec,x=rpm/s.redline,d=Math.abs(x-s.launchC);if(d<=s.launchW)return 'PERFECT';if(d<=s.launchW*2.2)return 'GOOD';return x>s.launchC?'WHEELSPIN':'BOG';}
 launch(rpm,atT){
  const s=this.spec,g=this.gradeOf(rpm);
  this.launchGrade=g;this.launchT=atT||0;this.delay=this.launchT+{PERFECT:0,GOOD:0.03,WHEELSPIN:0.06,BOG:0.1}[g];
  this.clutch=clamp(rpm,s.redline*0.3,s.redline*0.95);this.launched=true;return g;
 }
 aiLaunchRpm(){const d=DIFFS[this.ai.diff],r=Math.random(),s=this.spec;let x;
  if(r<d.p[0])x=s.launchC+rnd(-0.03,0.03);else if(r<d.p[0]+d.p[1])x=s.launchC+(Math.random()<0.5?-1:1)*rnd(0.08,0.12);else x=s.launchC+(Math.random()<0.5?-1:1)*rnd(0.16,0.3);
  return clamp(x,0.15,1)*s.redline;}
 aiReaction(){const d=DIFFS[this.ai.diff];if(Math.random()<d.foul)return -rnd(0.01,0.12);return Math.max(0.005,d.rt[0]+gauss()*d.rt[1]);}
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
  if(this.fin){this.v=Math.max(0,this.v-6*dt);this.x+=this.v*dt;this.rpm=Math.max(1000,this.rpm-4000*dt);this.wheelA+=this.v*dt/R_WHEEL;this.spin=false;return;}
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
   this.rpm+=(target-this.rpm)*Math.min(1,dt*18);
   if(this.shiftT<=0){this.gear=ng;this.shiftT=0;}
   this.spin=false;this.limiter=false;
  }else{
   let rpm=wheelRpm;
   const minR=this.gear===1?this.clutch:2200;this.slipping=wheelRpm<minR;
   if(this.slipping)rpm=minR;
   this.limiter=rpm>=s.redline;
   if(this.limiter){rpm=s.redline;F=0;}
   else{let T=torqueAt(s,rpm);if(this.nosT>0)T*=1+s.nosPow;if(this.launchGrade==='BOG'&&t<1.0)T*=0.55;F=T*ratio*EFF/R_WHEEL;}
   const trac=s.grip*(1+this.tireBonus)*s.kg*G;
   if(F>trac){F=trac*0.95;this.spin=true;}else this.spin=false;
   if(this.launchGrade==='WHEELSPIN'&&t<1.0){F*=0.62;this.spin=true;}
   else if(this.launchGrade==='GOOD'&&t<0.7)F*=0.9;
   this.rpm=Math.max(rpm,900);
  }
  if(this.nosT>0)this.nosT=Math.max(0,this.nosT-dt);
  const drag=0.5*1.2*s.cda*this.v*this.v,roll=this.v>0.1?0.012*s.kg*G:0;
  const a=(F-drag-roll)/s.kg;
  const px=this.x;
  this.v=Math.max(0,this.v+a*dt);this.x+=this.v*dt;this.wheelA+=this.v*dt/R_WHEEL*(this.spin?1.6:1);
  for(const [k,m] of MARKS){if(this.splits[k]===undefined&&this.x>=m&&px<m){const over=this.v>0?(this.x-m)/this.v:0;this.splits[k]=raceT-over-this.launchT;if(k==='t660')this.splits.mph660=mph(this.v);if(k==='t1320')this.splits.mph1320=mph(this.v);}}
  if(this.x>=dist){const over=this.v>0?(this.x-dist)/this.v:0;this.fin=true;this.total=raceT-over;this.et=this.total-this.launchT;this.trap=this.v;this.nosT=0;}
 }
}
function dyno(spec,dist,dt){
 dt=dt||1/240;const r=new Racer(spec,{diff:'Ghost'});r.launch(spec.launchC*spec.redline,0);let t=0;
 while(!r.fin&&t<60){t+=dt;r.step(dt,t,dist);}
 return {et:r.fin?r.et:t,trap:r.trap,splits:r.splits};
}
const estimateET=(spec,dist)=>dyno(spec,dist);
const prCache=new Map();
function prOf(o){const s=buildSpec(o);const key=[s.id,s.hp.toFixed(1),s.kg.toFixed(1),s.grip.toFixed(3),s.gears.join(','),s.fd,s.shiftMult,s.nosPow,s.nosDur].join('|');
 if(prCache.has(key))return prCache.get(key);const et=dyno(s,QUARTER,1/120).et;const pr=Math.max(100,Math.round((22-et)*100));const res={pr,et};prCache.set(key,res);return res;}

if(typeof module!=='undefined'&&typeof document==='undefined'){module.exports={CARS,UPG,buildSpec,Racer,estimateET,dyno,prOf,newOwned,fixUp,DIFFS,BOSSES,QUARTER,EIGHTH,mph};return;}

/* ================= STATE / SAVE ================= */
const SAVE_KEY='pinkslip_rivals_v1';
const FUEL_MAX=10,FUEL_REGEN_MS=6*60*1000;
let S;
const todayKey=(d)=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayDiff=(a,b)=>Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5);
function defaultState(){const c=newOwned('kestrel',0);return {v:2,coins:5000,gems:50,xp:0,cars:[c],active:c.uid,career:0,lobby:null,fuel:FUEL_MAX,fuelTS:Date.now(),
 daily:{last:null,streak:0},ev:{day:null,runs:{}},crew:null,turf:{owners:{},attacks:{},war:null,incomeDay:null,checkDay:null},dynoLast:{},
 settings:{sound:true,infinite:false,infFuel:false,fuelOn:true,tree:'sport',burnout:true},
 stats:{wins:0,losses:0,pinkWon:0,pinkLost:0,races:0,best14:null,best18:null,bestRT:null,perfectLaunches:0,perfectShifts:0}};}
function migrate(j){
 const d=defaultState();
 const s=Object.assign(d,j);
 s.settings=Object.assign(defaultState().settings,j.settings||{});
 s.stats=Object.assign(defaultState().stats,j.stats||{});
 s.turf=Object.assign(defaultState().turf,j.turf||{});
 s.daily=Object.assign(defaultState().daily,j.daily||{});
 s.ev=Object.assign(defaultState().ev,j.ev||{});
 s.cars=(j.cars||[]).map(fixUp);
 if(!s.cars.length){const c=newOwned('kestrel',0);s.cars=[c];s.active=c.uid;}
 if(!s.cars.find(c=>c.uid===s.active))s.active=s.cars[0].uid;
 delete s.opps; // v1 street list replaced by lobby
 if(!s.v||s.v<2){s.v=2;s.lobby=null;}
 return s;
}
function load(){try{const j=JSON.parse(localStorage.getItem(SAVE_KEY));if(j&&j.cars&&j.cars.length){S=migrate(j);return;}}catch(e){}S=defaultState();}
function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
load();
const activeCar=()=>S.cars.find(c=>c.uid===S.active)||S.cars[0];
const fmt=n=>Math.round(n).toLocaleString('en-US');
function canAfford(cur,amt){return S.settings.infinite||S[cur]>=amt;}
function spend(cur,amt){if(amt<=0||S.settings.infinite)return true;if(S[cur]>=amt){S[cur]-=amt;save();updWallet();return true;}return false;}
function earn(cur,amt){S[cur]=Math.max(0,Math.min(1e12,(S[cur]||0)+amt));save();updWallet();}
const levelOf=xp=>Math.floor(Math.sqrt(xp/120))+1;
function addXP(n){const l0=levelOf(S.xp);S.xp+=n;const l1=levelOf(S.xp);if(l1>l0){earn('gems',5*(l1-l0));setTimeout(()=>toast(`LEVEL UP! Lv ${l1} · +${5*(l1-l0)} gems`),400);}save();}
const fuelFree=()=>S.settings.infinite||S.settings.infFuel||!S.settings.fuelOn;
function tickFuel(){if(S.fuel>=FUEL_MAX){S.fuelTS=Date.now();return;}const n=Math.floor((Date.now()-S.fuelTS)/FUEL_REGEN_MS);if(n>0){S.fuel=Math.min(FUEL_MAX,S.fuel+n);S.fuelTS+=n*FUEL_REGEN_MS;save();}}
function useFuel(){tickFuel();if(fuelFree())return true;if(S.fuel<=0)return false;if(S.fuel===FUEL_MAX)S.fuelTS=Date.now();S.fuel--;save();return true;}
function upgCost(def,g,lvl){return Math.round(300*CLASS_MULT[def.cls]*Math.pow(1.75,lvl)*g.m/50)*50||50;}
function upgGemCost(def,g,lvl){return Math.max(2,Math.ceil(upgCost(def,g,lvl)/600));}
function carValue(o){const d=carDef(o.id);const v=d.cur==='gems'?d.price*250:Math.max(2000,d.price);let up=0;UPG.forEach(g=>{for(let i=0;i<o.up[g.k];i++)up+=upgCost(d,g,i);});return Math.round((v*0.5+up*0.4)/10)*10;}

/* ---------- bot generation near a PR target ---------- */
function botName(){const a=pick(UN_A),b=pick(UN_B),n=Math.random();return n<0.25?`xX${a}${b}Xx`:n<0.5?`${a.toLowerCase()}_${b.toLowerCase()}${rint(1,99)}`:n<0.75?`${a}${b}${rint(70,2026)}`:`${a}${b}`;}
function botCarNear(targetPR,clsHint,diff){
 let best=null;const pool=clsHint?CARS.filter(c=>c.cls===clsHint):CARS;
 for(let i=0;i<30;i++){const c=pick(pool);const base=rint(0,5);const o=newOwned(c.id,()=>clamp(base+rint(-1,1),0,MAXLVL),pick(PALETTE));const {pr}=prOf(o);const err=Math.abs(pr-targetPR);if(!best||err<best.err)best={o,err,pr};if(err<15)break;}
 return best.o;
}
function diffOffsetPR(diff){return {Easy:-40,Medium:-15,Hard:0,Pro:15,Ghost:0}[diff]||0;}
function makeBot(targetPR,diff,crew){
 const car=botCarNear(targetPR+diffOffsetPR(diff),null,diff);const p=prOf(car);
 const skill={Easy:0.55,Medium:0.25,Hard:0.1,Pro:0.03}[diff];
 const lvl={Easy:rint(1,8),Medium:rint(5,20),Hard:rint(15,40),Pro:rint(30,80)}[diff];
 const w=rint(lvl*3,lvl*12),wr={Easy:0.4,Medium:0.52,Hard:0.62,Pro:0.74}[diff];
 return {id:uid(),user:botName(),lvl,crew:crew||(Math.random()<0.6?pick(BOT_CREWS).tag:null),diff,car,pr:p.pr,et:+(p.et+skill+Math.random()*0.08).toFixed(3),
  maxBet:Math.round(pick([500,1000,2500,5000,10000,25000])*CLASS_MULT[carDef(car.id).cls]/50)*50,pinks:Math.random()<0.55,dist:Math.random()<0.5?'1/4':'1/8',w,l:Math.round(w*(1-wr)/wr)};
}
function myPR(){return prOf(activeCar()).pr;}
function genLobby(){const pr=myPR(),br=Math.floor(pr/50)*50;const diffs=['Easy','Medium','Medium','Hard','Hard','Hard','Pro','Pro'];
 S.lobby={bracket:br,bots:diffs.map(d=>makeBot(clamp(pr+rint(-25,25),br,br+49),d)),ts:Date.now()};save();}
function ensureLobby(){const br=Math.floor(myPR()/50)*50;if(!S.lobby||!S.lobby.bots||S.lobby.bracket!==br)genLobby();}

/* ---------- daily reward ---------- */
const DAILY=[{c:1000},{g:5},{c:2500},{f:1,g:5},{c:5000},{g:15},{c:10000,g:25}];
function dailyAvailable(){return S.daily.last!==todayKey();}
function claimDaily(){if(!dailyAvailable())return null;const t=todayKey();const cont=S.daily.last&&dayDiff(S.daily.last,t)===1;S.daily.streak=cont?(S.daily.streak%7)+1:1;S.daily.last=t;const r=DAILY[S.daily.streak-1];
 if(r.c)earn('coins',r.c);if(r.g)earn('gems',r.g);if(r.f){S.fuel=FUEL_MAX;}save();return r;}

/* ---------- events / tournaments ---------- */
function dayIndex(){const d=new Date();return Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);}
function todaysEvents(){
 const di=dayIndex(),cls=CLASSES[di%4],arch=['Tuner','Muscle','Euro','Exotic'][di%4];
 return [
  {id:'qcup',name:'Quarter Mile Cup',desc:'3-round knockout · any car',dist:'1/4',rounds:3,entry:{coins:1000},prize:{coins:9000,gems:15}},
  {id:'esprint',name:'Eighth Mile Sprint',desc:'3-round knockout · any car',dist:'1/8',rounds:3,entry:{coins:800},prize:{coins:7000,gems:10}},
  {id:'cls',name:`Class ${cls} Showdown`,desc:`Class ${cls} cars only · 4 rounds`,dist:di%2?'1/4':'1/8',rounds:4,cls,entry:{coins:1500},prize:{coins:14000,gems:25}},
  {id:'arch',name:`${arch} Throwdown`,desc:`${arch} cars only · 3 rounds`,dist:'1/4',rounds:3,arch,entry:{coins:1200},prize:{coins:11000,gems:20}},
  {id:'gauntlet',name:'Midnight Gauntlet',desc:'5 rounds of pros · gems entry',dist:'1/4',rounds:5,entry:{gems:5},prize:{coins:30000,gems:60}}
 ];
}
function evState(){if(S.ev.day!==todayKey()){S.ev={day:todayKey(),runs:{}};save();}return S.ev;}
const evScale=()=>CLASS_MULT[carDef(activeCar().id).cls];
const roundDiff=(r,n)=>n===5?['Hard','Hard','Pro','Pro','Pro'][r]:n===4?['Medium','Hard','Hard','Pro'][r]:['Medium','Hard','Pro'][r];

/* ---------- crews / turf ---------- */
function myTag(){return S.crew?S.crew.tag:null;}
function crewInfo(tag){if(S.crew&&S.crew.tag===tag)return {tag,name:S.crew.name,color:'#ff4fa3'};return BOT_CREWS.find(c=>c.tag===tag)||{tag,name:tag,color:'#aaa'};}
function initTurf(){const o=S.turf.owners;TERRITORIES.forEach((t,i)=>{if(!o[t])o[t]=BOT_CREWS[i%BOT_CREWS.length].tag;});}
function dailyTurfCheck(){
 initTurf();const t=todayKey();if(S.turf.checkDay===t)return;
 // unresolved attacks from earlier days are lost
 Object.keys(S.turf.attacks).forEach(terr=>{const a=S.turf.attacks[terr];if(a.day!==t){S.turf.owners[terr]=a.by;delete S.turf.attacks[terr];}});
 if(myTag())TERRITORIES.forEach(terr=>{if(S.turf.owners[terr]===myTag()&&Math.random()<0.35)S.turf.attacks[terr]={by:pick(BOT_CREWS.filter(c=>c.tag!==myTag())).tag,day:t};});
 S.turf.checkDay=t;save();
}
const turfIncome=()=>TERRITORIES.filter(t=>S.turf.owners[t]===myTag()).length*Math.round(1500*Math.sqrt(evScale()));

/* ================= UI ================= */
const $=s=>document.querySelector(s);
const screenEl=$('#screen');
let tab='race',raceSub='lobby',garageView='main',dynoMode='power',dealerArch='All';
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1900);}
function modal(html){$('#mbox').innerHTML=html;$('#modal').classList.remove('hidden');}
function closeModal(){$('#modal').classList.add('hidden');}
function confirmBox(title,msg,yes,onYes,danger){modal(`<h2>${title}</h2><p style="text-align:center">${msg}</p><div class="btns"><button class="btn dark" data-a="close">Cancel</button><button class="btn ${danger?'pink':'green'}" id="cfYes">${yes}</button></div>`);$('#cfYes').onclick=()=>{closeModal();onYes();};}
function alertBox(title,msg){modal(`<h2>${title}</h2><p style="text-align:center">${msg}</p><div class="btns"><button class="btn pink" data-a="close">OK</button></div>`);}
const priceTag=(cur,amt)=>`<i class="${cur==='gems'?'gem':'coin'}"></i>${fmt(amt)}`;
const rewardTag=r=>[r.coins?priceTag('coins',r.coins):'',r.gems?priceTag('gems',r.gems):''].filter(Boolean).join(' ');
function updWallet(){
 const inf=S.settings.infinite;tickFuel();
 $('#coins').textContent=inf?'∞':fmt(S.coins);$('#gems').textContent=inf?'∞':fmt(S.gems);
 $('#fuel').textContent=fuelFree()?'∞':`${S.fuel}/${FUEL_MAX}`;$('#lvl').textContent='Lv '+levelOf(S.xp);
}
setInterval(()=>{if(document.getElementById('fuel'))updWallet();},15000);
function statBars(spec,o){
 const p=o?prOf(o):null;
 return `${p?`<div class="stat"><span>PR</span><div class="bar"><i style="width:${clamp((p.pr-600)/10,3,100)}%"></i></div><b>${p.pr} · ${p.et.toFixed(2)}s</b></div>`:''}
 <div class="stat"><span>Power</span><div class="bar"><i style="width:${clamp(spec.hp/14,3,100)}%"></i></div><b>${fmt(spec.hp)} hp</b></div>
 <div class="stat"><span>Weight</span><div class="bar"><i style="width:${clamp((2000-spec.kg)/12,3,100)}%"></i></div><b>${fmt(spec.kg)} kg</b></div>
 <div class="stat"><span>Grip</span><div class="bar"><i style="width:${clamp(spec.grip*55,3,100)}%"></i></div><b>${spec.grip.toFixed(2)} ${spec.drive}</b></div>
 <div class="stat"><span>Shift</span><div class="bar"><i style="width:${clamp((1.05-spec.shiftMult)*180,3,100)}%"></i></div><b>${Math.round(70*spec.shiftMult)} ms</b></div>
 <div class="stat"><span>Gearing</span><div class="bar"><i style="width:${clamp(spec.fd*spec.gears[0]*6,3,100)}%"></i></div><b>${spec.gears.length}-spd · ${spec.fd.toFixed(2)}</b></div>`;
}
function thumb(o,big){return `<canvas class="${big?'bigthumb':'thumb'}" data-car="${o.id}" data-color="${o.color||carDef(o.id).color}"></canvas>`;}
function paintThumbs(root){
 (root||document).querySelectorAll('canvas[data-car]').forEach(c=>{
  const dpr=window.devicePixelRatio||1,w=c.clientWidth||110,h=c.clientHeight||52;c.width=w*dpr;c.height=h*dpr;
  const x=c.getContext('2d');x.scale(dpr,dpr);
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2a1240');g.addColorStop(1,'#120720');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#0008';x.fillRect(0,h*0.84,w,h*0.16);
  const L=Math.min(w*0.86,h*2.6);drawCar(x,(w-L)/2,h*0.86,L,c.dataset.color,carDef(c.dataset.car).body,0,{});
 });
}
const avatar=(name,color)=>`<span class="ava" style="background:${color||'#5b2a7a'}">${name.replace(/[^A-Za-z]/g,'').slice(0,2).toUpperCase()}</span>`;
function tagBadge(tag){if(!tag)return '';const c=crewInfo(tag);return `<span class="badge" style="background:${c.color};color:#111">[${tag}]</span>`;}
function render(){
 updWallet();
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 screenEl.innerHTML=({race:viewRace,events:viewEvents,crew:viewCrew,garage:viewGarage,dealer:viewDealer,settings:viewSettings})[tab]();
 paintThumbs(screenEl);
 if(tab==='garage'&&garageView==='tune')drawDyno();
 tickerStart();
}

/* ---------- RACE tab ---------- */
function viewRace(){
 const me=activeCar(),sp=buildSpec(me),p=prOf(me);
 let h=`<div class="hero"><div class="logo">PINK SLIP <b>RIVALS</b></div></div>
 <div class="seg"><button class="${raceSub==='lobby'?'on':''}" data-a="rsub" data-v="lobby">Lobby</button><button class="${raceSub==='career'?'on':''}" data-a="rsub" data-v="career">Career</button></div>
 <div class="card row">${thumb(me)}<div class="grow"><b>${sp.name}</b> <span class="badge cls-${sp.cls}">${sp.cls}</span><div class="muted">PR <b>${p.pr}</b> · dyno ${p.et.toFixed(3)}s · ${fmt(sp.hp)} hp</div></div><button class="btn sm blue" data-a="testrun">Test<br>run</button></div>`;
 if(raceSub==='career')return h+viewCareer();
 ensureLobby();const L=S.lobby;
 h+=`<div class="row" style="justify-content:space-between;margin:4px 0 6px"><div><b>Lobby PR ${L.bracket}–${L.bracket+49}</b><div class="muted">${L.bots.length} racers online · bot lobby</div></div><button class="btn sm dark" data-a="refresh">↻ Refresh</button></div>
 <div class="ticker" id="ticker"></div>`;
 L.bots.forEach(b=>{const bs=buildSpec(b.car);
  h+=`<div class="card lob"><div class="row">${avatar(b.user,crewInfo(b.crew||'').color)}<div class="grow"><b class="uname">${b.user}</b> ${tagBadge(b.crew)}<div class="muted">Lv ${b.lvl} · W/L ${b.w}-${b.l}</div></div><div style="text-align:right"><div class="pr">PR ${b.pr}</div><div class="muted">best ${b.et.toFixed(3)}s</div></div></div>
  <div class="row" style="margin-top:6px">${thumb(b.car)}<div class="grow"><div><b class="small">${bs.name}</b> <span class="badge cls-${bs.cls}">${bs.cls}</span></div><div class="muted">${b.dist} mi · bets up to ${priceTag('coins',b.maxBet)}</div>${b.pinks?'<span class="badge pinkb">PINKS OK</span>':''}</div><button class="btn pink sm" data-a="challenge" data-id="${b.id}">Challenge</button></div></div>`;});
 return h;
}
function viewCareer(){
 let h=`<p class="muted">Beat each boss to climb the ladder. Beat Queen Pinkslip to win her Nova Hyper!</p>`;
 if(S.career>=BOSSES.length)h=`<div class="card" style="text-align:center"><b>👑 You are the Pink Slip Champion!</b></div>`+h;
 BOSSES.forEach((b,i)=>{const o=bossCar(i),sp=buildSpec(o);const done=i<S.career,cur=i===S.career;
  h+=`<div class="card boss ${cur?'cur':''} ${i>S.career?'locked':''}"><div class="row">${thumb(o)}<div class="grow"><b>#${i+1} ${b.name}</b> ${done?'✅':''}<div><span class="badge d-Boss">BOSS</span><span class="badge d-${b.diff}">${b.diff}</span><span class="badge cls-${sp.cls}">${sp.cls}</span><span class="badge">${b.dist} mi</span></div><div class="muted">${sp.name} · PR ${prOf(o).pr}</div><div class="small">Reward: ${priceTag('coins',b.coins)} ${priceTag('gems',b.gems)}${b.pink?' + her car':''}</div></div></div>
  ${cur?`<div class="btns"><button class="btn pink" data-a="boss" data-i="${i}">CHALLENGE</button></div>`:done?`<div class="btns"><button class="btn dark sm" data-a="boss" data-i="${i}">Rematch (no reward)</button></div>`:''}</div>`;});
 return h;
}
function bossCar(i){const b=BOSSES[i];const o=newOwned(b.car,b.lvl);o.uid='boss'+i;o.color=BOSS_COLORS[i%3];return o;}
let tickerTimer=null;
function tickerLine(){const u=botName(),u2=botName(),c=pick(CARS),r=Math.random();const et=(prOf(newOwned(c.id,rint(0,4))).et+Math.random()*0.3).toFixed(3);
 if(r<0.3)return `<b>${u}</b> beat <b>${u2}</b> for ${priceTag('coins',pick([500,1000,2500,5000,10000]))}`;
 if(r<0.5)return `<b>${u}</b> took <b>${u2}</b>'s ${c.name} in a PINK SLIP race!`;
 if(r<0.7)return `<b>${u}</b> ran ${et}s in a ${c.name}`;
 if(r<0.85)return `<b>${u}</b>: ${pick(['anyone run 1/8 for 5k?','who wants pinks?','new PB lets go','perfect launch every time 😎','rematch me coward','gg','my turbo is spooling 👀','looking for crew'])}`;
 return `[${pick(BOT_CREWS).tag}] captured <b>${pick(TERRITORIES)}</b> in a crew war`;}
function tickerStart(){clearInterval(tickerTimer);const t=document.getElementById('ticker');if(!t)return;t.innerHTML=[0,1,2].map(()=>`<div>${tickerLine()}</div>`).join('');
 tickerTimer=setInterval(()=>{const el=document.getElementById('ticker');if(!el){clearInterval(tickerTimer);return;}const d=document.createElement('div');d.innerHTML=tickerLine();el.prepend(d);while(el.children.length>3)el.lastChild.remove();},3500);}
function challengeModal(b){
 const bs=buildSpec(b.car),me=activeCar();
 const bets=[0,500,1000,2500,5000,10000,25000,50000,100000].map(x=>Math.round(x*CLASS_MULT[bs.cls]/50)*50).filter((x,i,a)=>x<=b.maxBet&&a.indexOf(x)===i);
 modal(`<h2>Challenge ${b.user}</h2><div class="row">${thumb(b.car)}<div class="grow"><b>${bs.name}</b> <span class="badge cls-${bs.cls}">${bs.cls}</span><div class="muted">PR ${b.pr} · best ${b.et.toFixed(3)}s · ${b.dist} mi</div></div></div>
 <div class="muted" style="margin:8px 0 4px">Your ${buildSpec(me).name}: PR ${prOf(me).pr}</div>
 <h3>Pick your bet</h3><div class="betgrid">${bets.map(x=>`<button class="btn ${x?'gold':'dark'} sm" data-a="bet" data-id="${b.id}" data-b="${x}" ${canAfford('coins',x)?'':'disabled'}>${x?priceTag('coins',x):'Free race'}</button>`).join('')}</div>
 ${b.pinks?`<div class="btns"><button class="btn pink" data-a="pinkgo" data-id="${b.id}">🏁 RACE FOR PINK SLIPS</button></div>`:'<div class="muted" style="margin-top:8px">This racer doesn\'t race for pinks.</div>'}
 <div class="btns"><button class="btn dark sm" data-a="close">Cancel</button></div>`);paintThumbs($('#mbox'));
}

/* ---------- EVENTS ---------- */
function viewEvents(){
 const es=evState(),sc=evScale();
 let h=`<h2>Tournaments</h2><p class="muted">New events every day. Knock out every opponent to take the prize. Rewards scale with your car's class.</p>`;
 if(dailyAvailable())h+=`<div class="card row"><div class="grow"><b>🎁 Daily reward ready!</b><div class="muted">Day ${(S.daily.last&&dayDiff(S.daily.last,todayKey())===1?(S.daily.streak%7)+1:1)} of 7</div></div><button class="btn gold sm" data-a="daily">Claim</button></div>`;
 todaysEvents().forEach(e=>{const run=es.runs[e.id];const en=e.entry.coins?{coins:Math.round(e.entry.coins*sc)}:e.entry;const pr={coins:Math.round(e.prize.coins*sc),gems:e.prize.gems};
  const ok=(!e.cls||carDef(activeCar().id).cls===e.cls)&&(!e.arch||carDef(activeCar().id).arch===e.arch);
  let status='';if(run&&run.active)status=`<div class="bracket">${Array.from({length:e.rounds},(_,i)=>`<i class="${i<run.round?'won':i===run.round?'cur':''}">${i===e.rounds-1?'F':'R'+(i+1)}</i>`).join('')}</div>`;
  if(run&&run.done)status=`<div class="small">${run.won?'🏆 Champion! Prize claimed.':'Knocked out — re-enter to try again.'}</div>`;
  h+=`<div class="card"><div class="row"><div class="grow"><b>${e.name}</b> <span class="badge">${e.dist} mi</span><div class="muted">${e.desc}</div><div class="small">Entry ${rewardTag(en)} · Prize ${rewardTag(pr)}</div></div></div>${status}
  <div class="btns">${run&&run.active?`<button class="btn pink" data-a="evrace" data-id="${e.id}">Race ${run.round===e.rounds-1?'FINAL':'Round '+(run.round+1)} vs ${run.opp.user}</button>`:`<button class="btn green" data-a="eventer" data-id="${e.id}" ${ok?'':'disabled'}>${ok?'Enter':'Need '+(e.cls?'Class '+e.cls:e.arch)+' car'}</button>`}</div></div>`;});
 return h;
}

/* ---------- CREW ---------- */
function viewCrew(){
 dailyTurfCheck();
 if(!S.crew){
  let h=`<h2>Crews</h2><p class="muted">Join a crew or start your own, then fight crew wars to take over turf. Every territory you own pays out daily.</p>
  <div class="card"><b>Start your own crew</b><div class="row" style="margin-top:8px;gap:6px"><input id="crewName" placeholder="Crew name" maxlength="20" style="flex:2"><input id="crewTag" placeholder="TAG" maxlength="3" style="flex:1;text-transform:uppercase"></div><div class="btns"><button class="btn pink" data-a="crewcreate">Create · ${priceTag('coins',2500)}</button></div></div><h3>Join a crew</h3>`;
  BOT_CREWS.forEach(c=>{const n=TERRITORIES.filter(t=>S.turf.owners[t]===c.tag).length;h+=`<div class="card row">${avatar(c.name,c.color)}<div class="grow"><b>${c.name}</b> ${tagBadge(c.tag)}<div class="muted">${rint(8,30)} members · ${n} territories</div></div><button class="btn green sm" data-a="crewjoin" data-t="${c.tag}">Join</button></div>`;});
  return h;
 }
 const c=S.crew,mine=TERRITORIES.filter(t=>S.turf.owners[t]===c.tag),w=S.turf.war;
 let h=`<div class="card row">${avatar(c.name,'#ff4fa3')}<div class="grow"><b style="font-size:17px">${c.name}</b> ${tagBadge(c.tag)}<div class="muted">Crew rep ${fmt(c.rep||0)} · ${c.members.length+1} members · ${mine.length} turf</div></div></div>
 <div class="card row"><div class="grow"><b>Turf income</b><div class="muted">${fmt(turfIncome())} coins / day from ${mine.length} territories</div></div><button class="btn gold sm" data-a="turfcollect" ${S.turf.incomeDay===todayKey()||!mine.length?'disabled':''}>${S.turf.incomeDay===todayKey()?'Collected':'Collect'}</button></div>`;
 if(w)h+=`<div class="card boss cur"><b>⚔️ Crew war: ${w.terr}</b><div class="muted">vs ${crewInfo(w.owner).name} · best of 3 · You ${w.wins} – ${w.losses} them</div><div class="btns"><button class="btn pink" data-a="warrace">Race ${w.opps[w.round].user}</button><button class="btn dark sm" data-a="warquit">Retreat</button></div></div>`;
 h+=`<h3>Turf map</h3><div class="turf">`;
 TERRITORIES.forEach(t=>{const o=S.turf.owners[t],ci=crewInfo(o),att=S.turf.attacks[t],isMine=o===c.tag;
  h+=`<div class="terr" style="border-color:${ci.color}"><b>${t}</b><div class="small" style="color:${ci.color}">[${o}] ${ci.name}</div>${att?`<div class="small" style="color:#ff6b6b">Under attack by [${att.by}]!</div>`:''}
  ${isMine?(att?`<button class="btn pink sm" data-a="defend" data-t="${t}">DEFEND</button>`:'<div class="muted">Yours ✔</div>'):`<button class="btn dark sm" data-a="attack" data-t="${t}" ${w?'disabled':''}>Attack</button>`}</div>`;});
 h+=`</div><h3>Members</h3><div class="card small">${['<b>You</b> (leader)'].concat(c.members.map(m=>m)).join(' · ')}</div><div class="btns"><button class="btn dark sm" data-a="crewleave">Leave crew</button></div>`;
 return h;
}

/* ---------- GARAGE ---------- */
function viewGarage(){
 const me=activeCar(),sp=buildSpec(me),d=carDef(me.id);
 if(garageView==='upgrades'){
  let h=`<div class="row"><button class="btn sm dark" data-a="gview" data-v="main">← Back</button><h2 style="margin:0">Parts</h2></div><div class="card">${thumb(me,true)}<b>${sp.name}</b>${statBars(sp,me)}</div>`;
  let cat='';
  UPG.forEach(g=>{const l=me.up[g.k];if(g.cat!==cat){cat=g.cat;h+=`<h3>${cat}</h3>`;}
   h+=`<div class="card"><div class="row"><div class="grow"><b>${g.name}</b> <span class="muted">${l?'Stage '+l:'Stock'}</span><div class="muted">${g.desc}</div></div></div><div class="stages">`;
   for(let n=1;n<=MAXLVL;n++){const owned=n<=l,next=n===l+1||(g.direct&&n>l);let cost=0;for(let k=l;k<n;k++)cost+=upgCost(d,g,k);const gc=Math.max(2,Math.ceil(cost/600));
    h+=`<div class="stg ${owned?'own':''}"><div class="sn">S${n}</div>${owned?'<div class="small">✔</div>':next?`<button class="btn gold xs" data-a="upg" data-k="${g.k}" data-n="${n}" data-c="coins" ${canAfford('coins',cost)?'':'disabled'}>${priceTag('coins',cost)}</button><button class="btn pink xs" data-a="upg" data-k="${g.k}" data-n="${n}" data-c="gems" ${canAfford('gems',gc)?'':'disabled'}>${priceTag('gems',gc)}</button>`:'<div class="muted small">🔒</div>'}</div>`;}
   h+=`</div>${l>0?`<button class="btn dark xs" data-a="downg" data-k="${g.k}" style="margin-top:6px">Downgrade to ${l>1?'S'+(l-1):'stock'} (index tuning)</button>`:''}</div>`;});
  return h;
 }
 if(garageView==='tune'){
  const t=me.tune||{gears:d.gears.slice(),fd:d.fd};
  let h=`<div class="row"><button class="btn sm dark" data-a="gview" data-v="main">← Back</button><h2 style="margin:0">Tuning & Dyno</h2></div>
  <div class="card"><div class="seg" style="margin-bottom:6px"><button class="${dynoMode==='power'?'on':''}" data-a="dmode" data-v="power">Power curve</button><button class="${dynoMode==='gears'?'on':''}" data-a="dmode" data-v="gears">Gear chart</button></div><canvas id="dynoCv" class="dynocv"></canvas>
  <div id="dynoRes">${dynoResHTML(me)}</div>
  <div class="btns"><button class="btn green" data-a="dynorun">Run dyno</button><button class="btn blue" data-a="testrun">Test run</button></div></div>
  <div class="card"><b>Gear ratios</b><div class="muted">Shorter (higher) early gears = harder launch. Taller final drive = more top speed.</div>`;
  t.gears.forEach((g,i)=>{h+=`<div class="row small"><span style="width:56px">Gear ${i+1}</span><input type="range" min="${(d.gears[i]*0.7).toFixed(2)}" max="${(d.gears[i]*1.3).toFixed(2)}" step="0.01" value="${g}" data-tune="g${i}"><b style="width:40px" id="tv-g${i}">${g.toFixed(2)}</b></div>`;});
  h+=`<div class="row small"><span style="width:56px">Final</span><input type="range" min="2.50" max="5.50" step="0.01" value="${t.fd}" data-tune="fd"><b style="width:40px" id="tv-fd">${t.fd.toFixed(2)}</b></div>
  <div class="btns"><button class="btn dark sm" data-a="preset" data-v="stock">Stock</button><button class="btn dark sm" data-a="preset" data-v="launch">Short (1/8)</button><button class="btn dark sm" data-a="preset" data-v="top">Tall (1/4)</button></div></div>`;
  return h;
 }
 if(garageView==='paint'){
  return `<div class="row"><button class="btn sm dark" data-a="gview" data-v="main">← Back</button><h2 style="margin:0">Paint shop</h2></div><div class="card">${thumb(me,true)}</div><div class="swatches">${PALETTE.map(c=>`<button class="sw ${me.color===c?'on':''}" style="background:${c}" data-a="paint" data-c="${c}"></button>`).join('')}</div><p class="muted">Paint is free. Looks don't change PR.</p>`;
 }
 let h=`<h2>Garage</h2><div class="card">${thumb(me,true)}<div class="row"><div class="grow"><b style="font-size:17px">${sp.name}</b> <span class="badge cls-${sp.cls}">${sp.cls}</span> <span class="badge">${sp.arch}</span></div><span class="muted">Driving</span></div>${statBars(sp,me)}
 <div class="btns"><button class="btn pink" data-a="gview" data-v="upgrades">Parts</button><button class="btn blue" data-a="gview" data-v="tune">Tune / Dyno</button><button class="btn dark" data-a="gview" data-v="paint">Paint</button></div></div><h3>Your cars (${S.cars.length})</h3>`;
 S.cars.forEach(o=>{const s=buildSpec(o),lv=UPG.reduce((a,g)=>a+o.up[g.k],0);
  h+=`<div class="card row">${thumb(o)}<div class="grow"><b>${s.name}</b> <span class="badge cls-${s.cls}">${s.cls}</span><div class="muted">PR ${prOf(o).pr} · ${fmt(s.hp)} hp · parts ${lv}/${UPG.length*MAXLVL}</div>
  <div class="btns">${o.uid===S.active?'<span class="muted">✔ Driving</span>':`<button class="btn green sm" data-a="select" data-u="${o.uid}">Drive</button><button class="btn dark sm" data-a="sell" data-u="${o.uid}">Sell ${priceTag('coins',carValue(o))}</button>`}</div></div></div>`;});
 return h;
}
function dynoResHTML(o){
 const s=buildSpec(o),q=dyno(s,QUARTER),p=prOf(o),last=S.dynoLast[o.uid];
 const dl=last?q.et-last:0;
 return `<table class="rt slip"><tr><th>60 ft</th><th>330 ft</th><th>1/8 mi</th><th>1/4 mi</th></tr><tr><td>${q.splits.t60.toFixed(3)}</td><td>${q.splits.t330.toFixed(3)}</td><td>${q.splits.t660.toFixed(3)}<br><span class="muted">${q.splits.mph660.toFixed(1)} mph</span></td><td><b>${q.et.toFixed(3)}</b><br><span class="muted">${mph(q.trap).toFixed(1)} mph</span></td></tr></table>
 <div class="row small"><span class="grow">PR <b>${p.pr}</b> · Lobby ${Math.floor(p.pr/50)*50}–${Math.floor(p.pr/50)*50+49}</span>${last?`<span style="color:${dl<=0?'#3ddc84':'#ff6b6b'}">${dl<=0?'▼':'▲'} ${Math.abs(dl).toFixed(3)}s vs last</span>`:''}</div>`;
}
function drawDyno(){
 const c=$('#dynoCv');if(!c)return;const dpr=window.devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;const x=c.getContext('2d');x.scale(dpr,dpr);
 const me=activeCar(),s=buildSpec(me);x.fillStyle='#0c0614';x.fillRect(0,0,w,h);
 const L=34,Rr=w-34,T=12,B=h-22;x.strokeStyle='#ffffff18';x.lineWidth=1;
 for(let i=0;i<=4;i++){const yy=T+(B-T)*i/4;x.beginPath();x.moveTo(L,yy);x.lineTo(Rr,yy);x.stroke();}
 x.fillStyle='#a993bd';x.font='10px sans-serif';x.textAlign='center';
 const maxR=Math.ceil(s.redline/1000);for(let k=1;k<=maxR;k++){const xx=L+(Rr-L)*(k*1000)/(maxR*1000);x.fillText(k+'k',xx,h-8);x.beginPath();x.moveTo(xx,T);x.lineTo(xx,B);x.stroke();}
 if(dynoMode==='power'){
  let maxHP=s.hp*(1+s.nosPow),maxT=0;for(let r=1000;r<=s.redline;r+=100)maxT=Math.max(maxT,torqueAt(s,r)*(1+s.nosPow));
  const curve=(fn,max,col,dash)=>{x.strokeStyle=col;x.lineWidth=2.5;x.setLineDash(dash||[]);x.beginPath();for(let r=1000;r<=s.redline;r+=50){const xx=L+(Rr-L)*r/(maxR*1000),yy=B-(B-T)*fn(r)/max;r===1000?x.moveTo(xx,yy):x.lineTo(xx,yy);}x.stroke();x.setLineDash([]);};
  curve(r=>s.hp*powerFrac(r/s.redline)*(1+s.nosPow),maxHP,'#4dd6ff88',[5,4]);
  curve(r=>s.hp*powerFrac(r/s.redline),maxHP,'#ff4fa3');curve(r=>torqueAt(s,r),maxT,'#ffd43b');
  x.textAlign='left';x.fillStyle='#ff4fa3';x.fillText(`HP ${fmt(s.hp)}`,L+4,T+10);x.fillStyle='#ffd43b';x.fillText(`TQ ${fmt(maxT/(1+s.nosPow))} Nm`,L+70,T+10);x.fillStyle='#4dd6ff';x.fillText(`NOS +${Math.round(s.nosPow*100)}% / ${s.nosDur.toFixed(1)}s`,L+150,T+10);
  const pl=L+(Rr-L)*s.perfLo*s.redline/(maxR*1000),ph=L+(Rr-L)*s.perfHi*s.redline/(maxR*1000);x.fillStyle='#4dd6ff22';x.fillRect(pl,T,ph-pl,B-T);
 }else{
  const topMph=mph(s.redline*2*Math.PI/60*R_WHEEL/(s.gears[s.gears.length-1]*s.fd));const maxM=Math.ceil(topMph/20)*20;
  s.gears.forEach((g,i)=>{const vmax=mph(s.redline*2*Math.PI/60*R_WHEEL/(g*s.fd));x.strokeStyle=`hsl(${320-i*40},90%,65%)`;x.lineWidth=2.5;x.beginPath();x.moveTo(L,B);x.lineTo(L+(Rr-L)*s.redline/(maxR*1000),B-(B-T)*vmax/maxM);x.stroke();x.fillStyle=x.strokeStyle;x.textAlign='left';x.fillText(`${i+1}: ${Math.round(vmax)}`,Rr+2-30,B-(B-T)*vmax/maxM-3);});
  x.fillStyle='#a993bd';x.textAlign='left';x.fillText(`mph (max ${maxM})`,L+4,T+10);
 }
}

/* ---------- DEALER ---------- */
function viewDealer(){
 let h=`<h2>Dealer</h2><div class="seg">${['All','Tuner','Muscle','Euro','Exotic'].map(a=>`<button class="${dealerArch===a?'on':''}" data-a="arch" data-v="${a}">${a}</button>`).join('')}</div>`;
 CLASSES.forEach(cl=>{const list=CARS.filter(c=>c.cls===cl&&(dealerArch==='All'||c.arch===dealerArch));if(!list.length)return;h+=`<h3>Class ${cl}</h3>`;
  list.forEach(c=>{const o=newOwned(c.id,0);const sp=buildSpec(o);const own=S.cars.filter(x=>x.id===c.id).length;
  h+=`<div class="card"><div class="row">${thumb({id:c.id,color:c.color})}<div class="grow"><b>${c.name}</b> <span class="badge cls-${cl}">${cl}</span><span class="badge">${c.arch}</span>${own?`<span class="badge">Owned ×${own}</span>`:''}<div class="muted">${c.drive} · ${c.gears.length}-speed · stock PR ${prOf(o).pr}</div></div></div>${statBars(sp)}
  <div class="btns"><button class="btn ${c.cur==='gems'?'pink':'gold'}" data-a="buy" data-id="${c.id}" ${canAfford(c.cur,c.price)?'':'disabled'}>${c.price?'Buy '+priceTag(c.cur,c.price):'Free'}</button></div></div>`;});});
 return h;
}

/* ---------- SETTINGS ---------- */
function viewSettings(){
 const st=S.stats,tg=(k,on,id)=>`<button ${id?`id="${id}"`:''} class="toggle ${on?'on':''}" data-a="tgl" data-k="${k}"></button>`;
 return `<h2>Settings</h2>
 <div class="card row"><div class="grow"><b>Sound</b><div class="muted">Engine & effects</div></div>${tg('sound',S.settings.sound)}</div>
 <div class="card row"><div class="grow"><b>Burnout before race</b><div class="muted">Heat tires for extra grip</div></div>${tg('burnout',S.settings.burnout)}</div>
 <div class="card row"><div class="grow"><b>Christmas tree</b><div class="muted">Sport = ambers count down · Pro = all ambers, then green 0.4s later</div></div><button class="btn sm dark" data-a="treetype">${S.settings.tree==='pro'?'PRO':'SPORT'}</button></div>
 <div class="card row"><div class="grow"><b>Fuel system</b><div class="muted">Each race uses 1 fuel; 1 refills every 6 min</div></div>${tg('fuelOn',S.settings.fuelOn)}</div>
 <h3>🕹️ Cheat Menu</h3>
 <div class="card"><div class="row"><div class="grow"><b>Infinite coins & gems</b><div class="muted">Buy anything for free (fuel too)</div></div>${tg('infinite',S.settings.infinite,'cheatInf')}</div>
 <div class="row" style="margin-top:10px"><div class="grow"><b>Unlimited fuel</b></div>${tg('infFuel',S.settings.infFuel,'cheatFuel')}</div>
 <div style="margin-top:12px"><input type="number" id="cheatAmt" placeholder="Amount (e.g. 1000000)" inputmode="numeric" value="100000"></div>
 <div class="btns"><button class="btn gold sm" data-a="addc" id="addCoins">Add coins</button><button class="btn pink sm" data-a="addg" id="addGems">Add gems</button></div>
 <div class="btns"><button class="btn dark sm" data-a="quick" data-c="coins" data-n="1000000">+1M coins</button><button class="btn dark sm" data-a="quick" data-c="gems" data-n="10000">+10K gems</button><button class="btn dark sm" data-a="refuel">Refuel</button></div>
 <div class="btns"><button class="btn dark sm" data-a="maxcar">Max all parts</button><button class="btn dark sm" data-a="unlockall">Unlock final boss</button></div></div>
 <h3>Stats</h3><div class="card small">Level <b>${levelOf(S.xp)}</b> (${fmt(S.xp)} XP) · Races <b>${st.races}</b> · W/L <b>${st.wins}-${st.losses}</b><br>Pink slips won <b>${st.pinkWon}</b> · lost <b>${st.pinkLost}</b><br>Best ¼ <b>${st.best14?st.best14.toFixed(3)+'s':'—'}</b> · Best ⅛ <b>${st.best18?st.best18.toFixed(3)+'s':'—'}</b> · Best RT <b>${st.bestRT!=null?st.bestRT.toFixed(3):'—'}</b><br>Perfect launches <b>${st.perfectLaunches}</b> · perfect shifts <b>${st.perfectShifts}</b></div>
 <h3>How to play</h3><div class="card small">1. <b>Burnout:</b> hold GAS to heat the tires (aim for the green on the temp bar), then tap STAGE.<br>2. <b>Launch:</b> while the ambers count down, hold GAS to keep the needle in the <b style="color:#3ddc84">green zone</b>. Tap <b>LAUNCH</b> the moment the light goes green. Too early = <b style="color:#ff6b6b">RED LIGHT foul</b> (you lose).<br>3. <b>Shift:</b> tap SHIFT when the needle hits the <b style="color:#4dd6ff">blue zone</b> and the shift lights flash.<br>4. <b>NOS:</b> tap once to spray.<br>Keys: ↑/W gas · Space/→ launch & shift · N nitrous · Esc quit.</div>
 <div class="btns"><button class="btn dark sm" data-a="export">Export save</button><button class="btn dark sm" data-a="import">Import save</button><button class="btn sm" style="background:#7a1030" data-a="reset">Reset game</button></div>`;
}

/* ================= ACTIONS ================= */
document.getElementById('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.tab;garageView='main';render();screenEl.scrollTop=0;});
document.getElementById('btnSet').addEventListener('click',()=>{tab='settings';render();screenEl.scrollTop=0;});
function rerenderKeep(){const st=screenEl.scrollTop;render();screenEl.scrollTop=st;}
function needFuel(fn){if(useFuel()){updWallet();fn();return;}
 modal(`<h2>⛽ Out of fuel</h2><p style="text-align:center">You get 1 fuel every 6 minutes. Refill now?</p><div class="btns"><button class="btn dark" data-a="close">Wait</button><button class="btn pink" id="refillGo">Refill ${priceTag('gems',10)}</button></div>`);
 $('#refillGo').onclick=()=>{if(spend('gems',10)){S.fuel=FUEL_MAX;save();closeModal();needFuel(fn);}else toast('Not enough gems');};}
function findBot(id){return S.lobby&&S.lobby.bots.find(b=>b.id===id);}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a==='close'){closeModal();return;}
 if(b.disabled)return;
 const me=activeCar(),d=carDef(me.id);
 switch(a){
  case 'rsub':raceSub=b.dataset.v;render();break;
  case 'refresh':genLobby();render();break;
  case 'challenge':{const bot=findBot(b.dataset.id);if(bot)challengeModal(bot);break;}
  case 'bet':{const bot=findBot(b.dataset.id),bet=+b.dataset.b;if(!bot)return;closeModal();
   needFuel(()=>{if(!spend('coins',bet)){alertBox('Not enough coins','');return;}startRace({opp:{name:bot.user,car:bot.car,diff:bot.diff,crew:bot.crew,botId:bot.id},mode:'bet',bet,dist:bot.dist});});break;}
  case 'pinkgo':{const bot=findBot(b.dataset.id);if(!bot)return;
   if(S.cars.length<2){alertBox('Need a backup ride','You need at least 2 cars to race for pink slips. You can\'t bet your only car.');return;}
   confirmBox('⚠️ PINK SLIP',`Race <b>${bot.user}</b> for pink slips?<br><br>Win: you get their <b>${carDef(bot.car.id).name}</b> (PR ${bot.pr}).<br>Lose: they take your <b>${d.name}</b> (PR ${myPR()}) for good!`,'Bet my car',()=>needFuel(()=>startRace({opp:{name:bot.user,car:bot.car,diff:bot.diff,crew:bot.crew,botId:bot.id},mode:'pink',dist:bot.dist})),true);break;}
  case 'testrun':{const g=JSON.parse(JSON.stringify(me));g.color='#ffffff';startRace({opp:{name:'Dyno ghost',car:g,diff:'Ghost'},mode:'test',dist:'1/4'});break;}
  case 'boss':{const i=+b.dataset.i,bs=BOSSES[i];needFuel(()=>startRace({opp:{name:bs.name,diff:bs.diff,car:bossCar(i)},mode:'boss',bossIdx:i,dist:bs.dist}));break;}
  case 'daily':showDaily();break;
  case 'claimdaily':{const r=claimDaily();closeModal();if(r)toast('Claimed: '+[r.c?fmt(r.c)+' coins':'',r.g?r.g+' gems':'',r.f?'full fuel':''].filter(Boolean).join(' + '));render();break;}
  case 'eventer':{const e=todaysEvents().find(x=>x.id===b.dataset.id),sc=evScale();const cost=e.entry.coins?{cur:'coins',n:Math.round(e.entry.coins*sc)}:{cur:'gems',n:e.entry.gems};
   if(!spend(cost.cur,cost.n)){alertBox('Not enough '+cost.cur,'');return;}
   evState().runs[e.id]={round:0,active:true,opp:makeBot(myPR()+5,roundDiff(0,e.rounds))};save();render();toast('Entered '+e.name);break;}
  case 'evrace':{const e=todaysEvents().find(x=>x.id===b.dataset.id),run=evState().runs[e.id];if(!run||!run.active)return;
   needFuel(()=>startRace({opp:{name:run.opp.user,car:run.opp.car,diff:run.opp.diff,crew:run.opp.crew},mode:'event',evId:e.id,dist:e.dist}));break;}
  case 'crewcreate':{const n=($('#crewName').value||'').trim(),t=($('#crewTag').value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
   if(n.length<2||t.length<2){toast('Enter a name and 2-3 letter tag');return;}if(BOT_CREWS.some(c=>c.tag===t)){toast('Tag taken');return;}
   if(!spend('coins',2500)){toast('Need 2,500 coins');return;}S.crew={name:n,tag:t,rep:0,members:[botName(),botName(),botName()]};initTurf();save();render();toast('Crew created!');break;}
  case 'crewjoin':{const c=BOT_CREWS.find(x=>x.tag===b.dataset.t);S.crew={name:c.name,tag:c.tag,rep:0,joined:true,members:Array.from({length:rint(6,12)},botName)};save();render();toast('Joined '+c.name);break;}
  case 'crewleave':confirmBox('Leave crew?','Turf owned by a crew you started goes back to rival crews.','Leave',()=>{if(!S.crew.joined)TERRITORIES.forEach((t,i)=>{if(S.turf.owners[t]===S.crew.tag)S.turf.owners[t]=BOT_CREWS[i%BOT_CREWS.length].tag;});S.crew=null;S.turf.war=null;S.turf.attacks={};save();render();},true);break;
  case 'turfcollect':{const n=turfIncome();if(n>0&&S.turf.incomeDay!==todayKey()){S.turf.incomeDay=todayKey();earn('coins',n);toast(`+${fmt(n)} turf income`);render();}break;}
  case 'attack':{const t=b.dataset.t,owner=S.turf.owners[t];S.turf.war={terr:t,owner,round:0,wins:0,losses:0,opps:['Medium','Hard','Pro'].map(df=>makeBot(myPR(),df,owner))};save();render();break;}
  case 'warquit':S.turf.war=null;save();render();break;
  case 'warrace':{const w=S.turf.war;if(!w)return;const o=w.opps[w.round];needFuel(()=>startRace({opp:{name:o.user,car:o.car,diff:o.diff,crew:o.crew},mode:'war',dist:o.dist}));break;}
  case 'defend':{const t=b.dataset.t,att=S.turf.attacks[t];if(!att)return;const o=makeBot(myPR(),'Hard',att.by);needFuel(()=>startRace({opp:{name:o.user,car:o.car,diff:o.diff,crew:o.crew},mode:'defend',terr:t,dist:o.dist}));break;}
  case 'gview':garageView=b.dataset.v;render();screenEl.scrollTop=0;break;
  case 'upg':{const k=b.dataset.k,n=+b.dataset.n,cur=b.dataset.c,g=UPG.find(x=>x.k===k),l=me.up[k];if(n<=l)return;let cost=0;for(let i=l;i<n;i++)cost+=upgCost(d,g,i);if(cur==='gems')cost=Math.max(2,Math.ceil(cost/600));
   if(spend(cur,cost)){me.up[k]=n;save();toast(`${g.name} → Stage ${n} · PR ${myPR()}`);rerenderKeep();}break;}
  case 'downg':{const k=b.dataset.k;if(me.up[k]>0){me.up[k]--;save();toast('Downgraded (no refund) · PR '+myPR());rerenderKeep();}break;}
  case 'dmode':dynoMode=b.dataset.v;rerenderKeep();break;
  case 'dynorun':{const q=dyno(buildSpec(me),QUARTER);const html=dynoResHTML(me);S.dynoLast[me.uid]=q.et;save();$('#dynoRes').innerHTML=html;toast(`Dyno: ${q.et.toFixed(3)}s @ ${mph(q.trap).toFixed(1)} mph`);break;}
  case 'preset':{const v=b.dataset.v;if(v==='stock')me.tune=null;else{const f=v==='launch'?1.08:0.94;me.tune={gears:d.gears.map((g,i)=>+(g*(i<3?f:1)).toFixed(2)),fd:+(d.fd*(v==='launch'?1.06:0.93)).toFixed(2)};}save();rerenderKeep();break;}
  case 'paint':me.color=b.dataset.c;save();rerenderKeep();break;
  case 'select':S.active=b.dataset.u;save();render();toast('Car selected');break;
  case 'sell':{const o=S.cars.find(c=>c.uid===b.dataset.u);if(!o)return;const v=carValue(o);confirmBox('Sell car?',`Sell your ${carDef(o.id).name} for ${fmt(v)} coins?`,'Sell',()=>{S.cars=S.cars.filter(c=>c!==o);earn('coins',v);save();render();},true);break;}
  case 'buy':{const c=carDef(b.dataset.id);confirmBox('Buy car?',`Buy the ${c.name} for ${fmt(c.price)} ${c.cur}?`,'Buy',()=>{if(spend(c.cur,c.price)){const o=newOwned(c.id,0);S.cars.push(o);S.active=o.uid;save();render();toast(`${c.name} added & selected!`);}});break;}
  case 'arch':dealerArch=b.dataset.v;render();break;
  case 'tgl':{const k=b.dataset.k;S.settings[k]=!S.settings[k];save();rerenderKeep();if(k==='infinite')toast(S.settings.infinite?'Infinite coins & gems ON':'Infinite OFF');if(k==='infFuel')toast(S.settings.infFuel?'Unlimited fuel ON':'Unlimited fuel OFF');break;}
  case 'treetype':S.settings.tree=S.settings.tree==='pro'?'sport':'pro';save();rerenderKeep();break;
  case 'addc':case 'addg':{const n=Math.floor(+$('#cheatAmt').value||0);if(n>0){earn(a==='addc'?'coins':'gems',n);toast(`+${fmt(n)} ${a==='addc'?'coins':'gems'}`);rerenderKeep();}break;}
  case 'quick':earn(b.dataset.c,+b.dataset.n);toast(`+${fmt(+b.dataset.n)} ${b.dataset.c}`);rerenderKeep();break;
  case 'refuel':S.fuel=FUEL_MAX;save();updWallet();toast('Tank full');break;
  case 'maxcar':UPG.forEach(g=>me.up[g.k]=MAXLVL);save();toast('All parts maxed! PR '+myPR());rerenderKeep();break;
  case 'unlockall':S.career=Math.max(S.career,BOSSES.length-1);save();toast('Final boss unlocked');break;
  case 'export':modal(`<h2>Save data</h2><textarea style="width:100%;height:160px;background:#0e0517;color:#fff;border-radius:8px" readonly>${btoa(unescape(encodeURIComponent(JSON.stringify(S))))}</textarea><div class="btns"><button class="btn pink" data-a="close">Done</button></div>`);break;
  case 'import':modal(`<h2>Import save</h2><textarea id="impTxt" style="width:100%;height:160px;background:#0e0517;color:#fff;border-radius:8px"></textarea><div class="btns"><button class="btn dark" data-a="close">Cancel</button><button class="btn pink" id="impGo">Import</button></div>`);
   $('#impGo').onclick=()=>{try{const j=JSON.parse(decodeURIComponent(escape(atob($('#impTxt').value.trim()))));if(!j.cars)throw 0;localStorage.setItem(SAVE_KEY,JSON.stringify(j));load();closeModal();render();toast('Save imported');}catch(err){toast('Invalid save');}};break;
  case 'reset':confirmBox('Reset game?','This erases all cars, coins and progress.','Reset',()=>{localStorage.removeItem(SAVE_KEY);load();render();},true);break;
 }
});
screenEl.addEventListener('input',e=>{
 const k=e.target.dataset.tune;if(!k)return;const me=activeCar(),d=carDef(me.id);
 if(!me.tune)me.tune={gears:d.gears.slice(),fd:d.fd};
 const v=+e.target.value;if(k==='fd')me.tune.fd=v;else me.tune.gears[+k.slice(1)]=v;
 $('#tv-'+k).textContent=v.toFixed(2);save();$('#dynoRes').innerHTML=dynoResHTML(me);drawDyno();
});
function showDaily(){
 const nextDay=S.daily.last&&dayDiff(S.daily.last,todayKey())===1?(S.daily.streak%7)+1:1,avail=dailyAvailable();
 modal(`<h2>🎁 Daily Reward</h2><p class="muted" style="text-align:center">Come back every day. Miss a day and the streak resets.</p><div class="daily">${DAILY.map((r,i)=>{const n=i+1,claimed=avail?n<nextDay:n<=S.daily.streak,cur=avail&&n===nextDay;
  return `<div class="dd ${claimed?'got':''} ${cur?'cur':''}"><div class="small">Day ${n}</div>${r.c?`<div>${priceTag('coins',r.c)}</div>`:''}${r.g?`<div>${priceTag('gems',r.g)}</div>`:''}${r.f?'<div class="small">⛽ Full</div>':''}${claimed?'<div>✔</div>':''}</div>`;}).join('')}</div>
 <div class="btns">${avail?'<button class="btn gold" data-a="claimdaily" id="claimDaily">Claim</button>':'<button class="btn dark" data-a="close">Come back tomorrow</button>'}</div>`);
}

/* ================= CAR DRAWING ================= */
const BODIES={
 hatch:{p:[[0.02,0.22],[0,0.55],[0.04,0.64],[0.16,0.96],[0.55,0.98],[0.72,0.64],[0.96,0.54],[1,0.32],[0.97,0.2]],w:[[0.19,0.66],[0.27,0.9],[0.53,0.92],[0.66,0.66]],wh:[0.2,0.8]},
 coupe:{p:[[0,0.24],[0.01,0.55],[0.12,0.62],[0.3,0.92],[0.58,0.93],[0.75,0.62],[0.98,0.5],[1,0.28],[0.97,0.18]],w:[[0.18,0.63],[0.32,0.86],[0.56,0.87],[0.69,0.63]],wh:[0.19,0.8]},
 tuner:{p:[[0,0.24],[0.01,0.55],[0.12,0.6],[0.31,0.9],[0.57,0.9],[0.76,0.58],[0.98,0.47],[1,0.26],[0.97,0.16]],w:[[0.19,0.61],[0.33,0.84],[0.55,0.85],[0.7,0.6]],wh:[0.19,0.8],spoiler:true},
 muscle:{p:[[0,0.24],[0,0.64],[0.2,0.68],[0.32,0.95],[0.55,0.95],[0.66,0.7],[0.99,0.62],[1,0.28],[0.97,0.18]],w:[[0.24,0.69],[0.34,0.9],[0.53,0.9],[0.61,0.69]],wh:[0.18,0.8],scoop:true},
 sedan:{p:[[0,0.24],[0.01,0.58],[0.17,0.63],[0.3,0.95],[0.62,0.95],[0.76,0.63],[0.98,0.55],[1,0.28],[0.97,0.18]],w:[[0.21,0.64],[0.32,0.89],[0.6,0.89],[0.71,0.64]],wh:[0.19,0.8]},
 euro:{p:[[0,0.26],[0.01,0.6],[0.14,0.64],[0.28,0.93],[0.6,0.94],[0.74,0.63],[0.98,0.56],[1,0.3],[0.97,0.18]],w:[[0.18,0.65],[0.3,0.88],[0.58,0.89],[0.69,0.65]],wh:[0.2,0.79]},
 super:{p:[[0,0.3],[0.02,0.56],[0.25,0.6],[0.42,0.86],[0.6,0.86],[0.82,0.5],[1,0.36],[1,0.24],[0.97,0.14]],w:[[0.32,0.62],[0.44,0.82],[0.58,0.82],[0.74,0.56]],wh:[0.2,0.8],spoiler:true}
};
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=f<0?0:255,p=Math.abs(f);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return `rgb(${r},${g},${b})`;}
function drawCar(x,ox,gy,L,color,body,wa,o){
 const B=BODIES[body]||BODIES.coupe,h=L*0.3,wr=L*0.085;
 const P=(px,py)=>[ox+px*L,gy-py*h];
 x.save();if(o.alpha)x.globalAlpha=o.alpha;
 x.fillStyle='rgba(0,0,0,0.35)';x.beginPath();x.ellipse(ox+L/2,gy,L*0.52,L*0.03,0,0,Math.PI*2);x.fill();
 if(o.flame){const [fx,fy]=P(0,0.32);const fl=L*(0.25+Math.random()*0.15);const g=x.createLinearGradient(fx,0,fx-fl,0);g.addColorStop(0,'#fff');g.addColorStop(0.3,'#4dd6ff');g.addColorStop(1,'rgba(255,79,163,0)');x.fillStyle=g;x.beginPath();x.moveTo(fx,fy-h*0.08);x.lineTo(fx-fl,fy);x.lineTo(fx,fy+h*0.08);x.fill();}
 if(B.spoiler){x.fillStyle=shade(color,-0.5);const [a1,b1]=P(0.02,0.58);x.fillRect(a1-L*0.01,b1-h*0.25,L*0.13,h*0.07);x.fillRect(a1+L*0.04,b1-h*0.2,L*0.015,h*0.2);}
 const g=x.createLinearGradient(0,gy-h,0,gy);g.addColorStop(0,shade(color,0.35));g.addColorStop(0.5,color);g.addColorStop(1,shade(color,-0.45));
 x.fillStyle=g;x.strokeStyle=shade(color,-0.6);x.lineWidth=Math.max(1,L*0.006);
 x.beginPath();B.p.forEach((p,i)=>{const [a,b]=P(p[0],p[1]);i?x.lineTo(a,b):x.moveTo(a,b);});x.closePath();x.fill();x.stroke();
 if(B.scoop){x.fillStyle=shade(color,-0.55);const [sx,sy]=P(0.74,0.66);x.fillRect(sx,sy-h*0.07,L*0.1,h*0.07);}
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
 stop(){if(!this.eng)return;try{this.eng.g.gain.setTargetAtTime(0,this.ctx.currentTime,0.05);const e=this.eng;setTimeout(()=>{try{e.o1.stop();e.o2.stop();}catch(_){}},300);}catch(e){}this.eng=null;},
 beep(f,d,type){if(!S.settings.sound||!this.ctx)return;const c=this.ctx,o=c.createOscillator(),g=c.createGain();o.type=type||'square';o.frequency.value=f;g.gain.value=0.08;g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+d);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d);},
 whoosh(){if(!S.settings.sound||!this.ctx)return;const c=this.ctx,n=c.sampleRate*1.5,buf=c.createBuffer(1,n,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.value=1800;g.gain.value=0.15;s.buffer=buf;s.connect(f);f.connect(g);g.connect(c.destination);s.start();}
};

/* ================= RACE ENGINE ================= */
const cv=$('#cv'),ctx=cv.getContext('2d'),rv=$('#raceView'),btnL=$('#btnL'),btnR=$('#btnR'),rbtns=$('#raceBtns');
let R=null,W=0,H=0,DPR=1,SAT=0;
function resize(){const pr=document.getElementById('satProbe');SAT=pr?parseFloat(getComputedStyle(pr).paddingTop)||0:0;DPR=Math.min(window.devicePixelRatio||1,3);W=rv.clientWidth;H=rv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);}
window.addEventListener('resize',()=>{if(R)resize();});
function startRace(opts){
 Snd.init();closeModal();
 const me=activeCar(),ps=buildSpec(me),os=buildSpec(opts.opp.car);
 const dist=opts.dist==='1/8'?EIGHTH:QUARTER;
 const burn=S.settings.burnout;
 R={opts,dist,me:new Racer(ps,null),opp:new Racer(os,{diff:opts.opp.diff}),phase:burn?'burnout':'stage',clock:0,phaseT:0,raceT:0,gas:false,preRpm:900,popups:[],done:false,doneT:0,seed:Math.random()*1000,tire:0,rec:[],ghost:opts.mode==='test'};
 R.me.x=R.opp.x=-7;
 R.oppRpm=R.opp.aiLaunchRpm();R.oppRT=opts.opp.diff==='Ghost'?0:R.opp.aiReaction();
 R.opp.tireBonus=opts.opp.diff==='Ghost'?0.06:(burn?pick([0,0.03,0.06,0.06]):0);
 rv.classList.remove('hidden');rbtns.classList.remove('hidden');resize();setBtns();Snd.start();
 lastTS=performance.now();requestAnimationFrame(loop);
}
function setBtns(){
 if(!R)return;const me=R.me;
 if(R.phase==='replay'){rbtns.classList.add('hidden');return;}
 if(R.phase==='burnout'){btnL.textContent='BURNOUT';btnL.className='rbtn gas';btnR.textContent='STAGE ▶';btnR.className='rbtn stage';}
 else if(!me.launched&&!me.pendingFoul){btnL.textContent='GAS';btnL.className='rbtn gas';btnR.textContent='LAUNCH';btnR.className='rbtn launch';}
 else{btnL.textContent='NOS';btnL.className='rbtn '+(me.nosUsed?'used':'nos');btnR.textContent='SHIFT';btnR.className='rbtn shift';}
}
function popup(text,color){R.popups.push({text,color,t:0});}
function goStage(){if(R.phase!=='burnout')return;const t=R.tire;R.me.tireBonus=t<0.3?0:t<0.6?0.03:t<=0.9?0.06:-0.02;
 popup(t<0.3?'COLD TIRES':t<0.6?'WARM TIRES +3% GRIP':t<=0.9?'HOT TIRES +6% GRIP':'OVERCOOKED -2%',t>=0.6&&t<=0.9?'#3ddc84':t>0.9?'#ff6b6b':'#ffd43b');R.phase='stage';R.phaseT=0;R.gas=false;setBtns();}
function launchPress(){
 const me=R.me;if(me.launched||me.pendingFoul)return;
 if(R.phase==='stage'||R.phase==='tree'){me.foul=true;me.pendingFoul=true;me.foulRpm=R.preRpm;me.rt=R.phase==='tree'?R.phaseT-R.greenAt:-1;popup('RED LIGHT!','#ff3b3b');Snd.beep(200,0.4,'sawtooth');setBtns();return;}
 if(R.phase==='run'){me.rt=Math.max(0.001,(performance.now()-R.greenWall)/1000);const g=me.launch(R.preRpm,me.rt);if(g==='PERFECT')S.stats.perfectLaunches++;
  popup(g==='PERFECT'?'PERFECT LAUNCH!':g==='GOOD'?'GOOD LAUNCH':g,{PERFECT:'#4dd6ff',GOOD:'#3ddc84',WHEELSPIN:'#ff6b6b',BOG:'#ffd43b'}[g]);setBtns();}
}
function rightBtn(){if(!R||R.done&&R.phase!=='run')return;if(R.phase==='burnout')goStage();else if(!R.me.launched)launchPress();else doShift();}
function doShift(){if(!R||R.phase!=='run')return;const g=R.me.shift();if(g){if(g==='PERFECT')S.stats.perfectShifts++;popup(g==='PERFECT'?'PERFECT SHIFT!':g+' SHIFT',{PERFECT:'#4dd6ff',GOOD:'#3ddc84',EARLY:'#ffd43b',LATE:'#ff6b6b'}[g]);Snd.beep(g==='PERFECT'?880:440,0.08);}}
function doNos(){if(!R||R.phase!=='run')return;if(R.me.nitrous()){popup('NITROUS!','#ff4fa3');Snd.whoosh();setBtns();}}
function leftDown(){if(!R)return;Snd.init();if(R.me.launched)doNos();else R.gas=true;}
function leftUp(){if(R)R.gas=false;}
function press(el,down,up){
 el.addEventListener('touchstart',e=>{e.preventDefault();el.classList.add('pressed');down();},{passive:false});
 el.addEventListener('touchend',e=>{e.preventDefault();el.classList.remove('pressed');up&&up();},{passive:false});
 el.addEventListener('touchcancel',()=>{el.classList.remove('pressed');up&&up();});
 el.addEventListener('mousedown',()=>{el.classList.add('pressed');down();});
 el.addEventListener('mouseup',()=>{el.classList.remove('pressed');up&&up();});
 el.addEventListener('mouseleave',()=>{el.classList.remove('pressed');up&&up();});
}
press(btnL,leftDown,leftUp);press(btnR,rightBtn);
document.addEventListener('keydown',e=>{if(!R||e.repeat)return;const k=e.key;
 if(k==='ArrowUp'||k==='w'||k==='W'){if(!R.me.launched)R.gas=true;e.preventDefault();}
 else if(k===' '||k==='ArrowRight'||k==='d'||k==='D'){rightBtn();e.preventDefault();}
 else if(k==='n'||k==='N'||k==='Shift'){doNos();e.preventDefault();}
 else if(k==='Escape')$('#btnQuit').click();});
document.addEventListener('keyup',e=>{if(!R)return;if(e.key==='ArrowUp'||e.key==='w'||e.key==='W')R.gas=false;});
$('#btnQuit').addEventListener('click',()=>{if(!R)return;
 if(R.phase==='replay'){R.phase='done';showResults();return;}
 if(R.done){quitRace();return;}
 const pre=R.phase==='burnout'||R.phase==='stage';
 confirmBox('Quit race?',R.opts.mode==='test'?'End the test run?':R.opts.mode==='pink'?'Forfeiting a pink slip race counts as a LOSS. You lose your car!':pre?'Backing out before the tree is free (fuel is used).':'Forfeit counts as a loss.','Quit',()=>{if(!R)return;
  if(R.opts.mode==='test'||(pre&&R.opts.mode!=='pink')){if(R.opts.bet)earn('coins',R.opts.bet);quitRace();return;}
  R.forfeit=true;R.me.fin=true;R.me.total=999;finishRace();},true);});
function quitRace(){Snd.stop();R=null;rv.classList.add('hidden');closeModal();render();}

let lastTS=0;
function loop(ts){if(!R)return;const dt=Math.min(0.05,(ts-lastTS)/1000);lastTS=ts;update(dt);if(R)draw();if(R)requestAnimationFrame(loop);}
function revUpdate(dt,maxFrac){const s=R.me.spec;if(R.gas)R.preRpm+=s.redline*1.1*dt;else R.preRpm-=s.redline*0.75*dt;R.preRpm=clamp(R.preRpm,900,s.redline*(maxFrac||1));if(R.preRpm>=s.redline)R.preRpm-=s.redline*0.06*Math.random();R.me.rpm=R.preRpm;}
function snap(r){return [r.x,r.v,r.rpm,r.gear,r.nosT,r.spin?1:0,r.wheelA,r.shiftT,r.launched?1:0];}
function unsnap(r,a){[r.x,r.v,r.rpm,r.gear,r.nosT]=a;r.spin=!!a[5];r.wheelA=a[6];r.shiftT=a[7];r.launched=!!a[8];}
function update(dt){
 R.clock+=dt;R.phaseT+=dt;
 R.popups.forEach(p=>p.t+=dt);R.popups=R.popups.filter(p=>p.t<1.3);
 const me=R.me,op=R.opp;
 if(R.phase==='replay'){
  R.rp+=dt;const f=R.rec;while(R.ri<f.length-1&&f[R.ri+1].t<=R.rp)R.ri++;const fr=f[R.ri];unsnap(me,fr.a);unsnap(op,fr.b);R.raceT=fr.t;
  if(R.rp>f[f.length-1].t+1.2){R.phase='done';showResults();}return;
 }
 if(R.phase==='done')return;
 if(R.phase==='burnout'){
  revUpdate(dt,0.85);
  if(R.gas){R.tire=Math.min(1.1,R.tire+0.32*dt);me.wheelA+=dt*45;me.spin=true;}else{R.tire=Math.max(0,R.tire-0.06*dt);me.spin=false;}
  op.spin=R.phaseT>0.5&&R.phaseT<2.8;if(op.spin){op.wheelA+=dt*45;op.rpm=op.spec.redline*0.75;}else op.rpm=900;
  if(R.phaseT>10)goStage();
  Snd.update(R.preRpm,R.gas?1:0.2);return;
 }
 if(R.phase==='stage'||R.phase==='tree'){
  revUpdate(dt);me.spin=op.spin=false;
  if(me.x<0)me.x=Math.min(0,me.x+2.6*dt);
  if(R.phaseT>0.4&&op.x<0)op.x=Math.min(0,op.x+2.4*dt);
  op.rpm=me.x>=0?R.oppRpm+Math.sin(R.clock*9)*80:1200;
  if(R.phase==='stage'&&me.x>=0&&op.x>=0){R.phase='tree';R.phaseT=0;const d0=rnd(0.7,1.6);
   R.amberAt=S.settings.tree==='pro'?[d0,d0,d0]:[d0,d0+0.5,d0+1.0];R.greenAt=S.settings.tree==='pro'?d0+0.4:d0+1.5;}
  if(R.phase==='tree'){
   const n=R.amberAt.filter(t=>R.phaseT>=t).length;if(n!==R.lastAmber){R.lastAmber=n;if(n>0)Snd.beep(600,0.1);}
   if(R.phaseT>=R.greenAt){R.greenWall=performance.now()-(R.phaseT-R.greenAt)*1000;R.phase='run';R.raceT=0;R.phaseT=0;Snd.beep(1200,0.25);
    if(me.pendingFoul){me.launch(me.foulRpm,0);me.pendingFoul=false;setBtns();}
   }
  }
  Snd.update(R.preRpm,R.gas?1:0.2);return;
 }
 // RUN
 if(!me.launched){revUpdate(dt);if(R.raceT>4){me.rt=R.raceT;me.launch(R.preRpm,R.raceT);setBtns();}}
 if(!op.launched&&R.raceT>=Math.max(0,R.oppRT)){op.launch(R.oppRpm,Math.max(0,R.oppRT));op.foul=R.oppRT<0;op.rt=R.oppRT;}
 const sub=Math.max(1,Math.ceil(dt/(1/240))),h=dt/sub;
 for(let i=0;i<sub;i++){R.raceT+=h;me.step(h,R.raceT,R.dist);op.step(h,R.raceT,R.dist);}
 R.rec.push({t:R.raceT,a:snap(me),b:snap(op)});
 if(R.raceT>60&&!me.fin){me.fin=true;me.total=R.raceT;me.et=R.raceT;}
 if(me.fin&&!op.fin&&R.raceT>me.total+2.5){let t=R.raceT;while(!op.fin&&t<90){t+=1/240;op.step(1/240,t,R.dist);}if(!op.fin){op.fin=true;op.total=99;op.et=99;}}
 Snd.update(me.rpm,me.shiftT>0?0.2:1);
 if(me.fin&&op.fin&&!R.done){R.done=true;R.doneT=R.clock;}
 if(R.done&&!R.result&&R.clock-R.doneT>1.0)finishRace();
}
function finishRace(){
 if(!R||R.result)return;R.done=true;
 const me=R.me,op=R.opp,o=R.opts,mode=o.mode,test=mode==='test';
 let win;if(R.forfeit)win=false;else if(me.foul&&!op.foul)win=false;else if(op.foul&&!me.foul)win=true;else win=me.total<op.total;
 const myCar=activeCar(),sc=CLASS_MULT[carDef(myCar.id).cls];
 let reward='',extra='';
 if(!test){
  S.stats.races++;win?S.stats.wins++:S.stats.losses++;
  if(!R.forfeit&&!me.foul){const k=R.dist===QUARTER?'best14':'best18';if(!S.stats[k]||me.et<S.stats[k])S.stats[k]=me.et;if(me.rt>0&&(S.stats.bestRT==null||me.rt<S.stats.bestRT))S.stats.bestRT=me.rt;}
  const perf=(me.launchGrade==='PERFECT'?1:0)+me.shifts.PERFECT;const bonus=R.forfeit?0:Math.round(perf*25*sc);
  if(bonus){earn('coins',bonus);extra=`<div class="small">Perfect bonus: ${perf} × perfect = +${priceTag('coins',bonus)}</div>`;}
  addXP(win?40+perf*5:10);
 }
 const oppName=o.opp.name;
 if(mode==='bet'){if(win){const purse=o.bet?o.bet*2:Math.round(150*sc*DIFFS[o.opp.diff].mult);earn('coins',purse);const gm=DIFFS[o.opp.diff].gems;if(gm)earn('gems',gm);reward=`+${priceTag('coins',purse)}${gm?' +'+priceTag('gems',gm):''}`;}else reward=o.bet?`${oppName} takes your ${priceTag('coins',o.bet)} bet`:'No bet lost';
  const bot=findBot(o.opp.botId);if(bot){win?bot.l++:bot.w++;}}
 else if(mode==='pink'){
  if(win){const nc=JSON.parse(JSON.stringify(o.opp.car));nc.uid=uid();S.cars.push(nc);S.stats.pinkWon++;if(S.lobby)S.lobby.bots=S.lobby.bots.filter(x=>x.id!==o.opp.botId);reward=`🏆 You won <b>${oppName}'s ${carDef(nc.id).name}</b>! It's in your garage.`;}
  else{S.cars=S.cars.filter(c=>c.uid!==myCar.uid);S.active=S.cars[0].uid;S.stats.pinkLost++;reward=`💔 ${oppName} took your <b>${carDef(myCar.id).name}</b>.`;}
 }else if(mode==='boss'){
  const b=BOSSES[o.bossIdx];
  if(win&&o.bossIdx===S.career){S.career++;earn('coins',b.coins);earn('gems',b.gems);reward=`Boss defeated! +${priceTag('coins',b.coins)} +${priceTag('gems',b.gems)}`;if(b.pink){const nc=bossCar(o.bossIdx);nc.uid=uid();S.cars.push(nc);reward+=`<br>🏆 You won her <b>${carDef(nc.id).name}</b>!`;}}
  else reward=win?'Rematch won (no reward)':'The boss wins this time. Upgrade and try again!';
 }else if(mode==='event'){
  const e=todaysEvents().find(x=>x.id===o.evId),run=evState().runs[o.evId];
  if(run&&run.active){if(win){run.round++;if(run.round>=e.rounds){run.active=false;run.done=true;run.won=true;const pz={coins:Math.round(e.prize.coins*evScale()),gems:e.prize.gems};earn('coins',pz.coins);earn('gems',pz.gems);reward=`🏆 ${e.name} CHAMPION! +${rewardTag(pz)}`;}
    else{run.opp=makeBot(myPR()+5+run.round*10,roundDiff(run.round,e.rounds));reward=`Advanced to ${run.round===e.rounds-1?'the FINAL':'round '+(run.round+1)}!`;}}
   else{run.active=false;run.done=true;run.won=false;reward=`Knocked out of ${e.name}.`;}}
 }else if(mode==='war'){
  const w=S.turf.war;if(w){win?w.wins++:w.losses++;w.round++;
   if(w.wins>=2){S.turf.owners[w.terr]=myTag();S.crew.rep=(S.crew.rep||0)+100;earn('gems',10);earn('coins',Math.round(3000*sc));reward=`⚔️ Your crew captured <b>${w.terr}</b>! +${priceTag('coins',Math.round(3000*sc))} +${priceTag('gems',10)}`;S.turf.war=null;}
   else if(w.losses>=2){reward=`Your crew lost the war for ${w.terr}.`;S.turf.war=null;}
   else reward=`Crew war: ${w.wins}–${w.losses}. Next race!`;}
 }else if(mode==='defend'){
  const t=o.terr,att=S.turf.attacks[t];if(att){if(win){delete S.turf.attacks[t];S.crew.rep=(S.crew.rep||0)+50;earn('coins',Math.round(1500*sc));reward=`🛡️ ${t} defended! +${priceTag('coins',Math.round(1500*sc))}`;}else{S.turf.owners[t]=att.by;delete S.turf.attacks[t];reward=`[${att.by}] took ${t}.`;}}
 }else if(test){reward=`Dyno ghost: ${op.et.toFixed(3)}s. You were ${me.et<=op.et?'faster':'slower'} by ${Math.abs(me.et-op.et).toFixed(3)}s.`;}
 save();
 R.result={win,reward,extra};
 showResults();
}
function slipCol(r){const s=r.splits,q=R.dist===QUARTER,f=v=>v===undefined?'—':v.toFixed(3);
 return {rt:r.foul?'<span style="color:#ff6b6b">FOUL</span>':(r.rt||0).toFixed(3),t60:f(s.t60),t330:f(s.t330),t660:f(s.t660),m660:s.mph660?s.mph660.toFixed(2):'—',t1000:q?f(s.t1000):'',t1320:q?f(s.t1320):'',m1320:q&&s.mph1320?s.mph1320.toFixed(2):''};}
function showResults(){
 const me=R.me,op=R.opp,o=R.opts,res=R.result,q=R.dist===QUARTER;
 const A=slipCol(me),B=slipCol(op),rows=[['R/T','rt'],['60 ft','t60'],['330 ft','t330'],['1/8 ET','t660'],['1/8 MPH','m660']].concat(q?[['1000 ft','t1000'],['1/4 ET','t1320'],['1/4 MPH','m1320']]:[]);
 const title=o.mode==='test'?'TEST RUN':res.win?'YOU WIN!':R.forfeit?'FORFEIT':me.foul?'RED LIGHT':'YOU LOSE';
 const margin=!R.forfeit&&o.mode!=='test'?Math.abs(op.total-me.total):0;
 const again=(o.mode==='bet'&&findBot(o.opp.botId)&&canAfford('coins',o.bet))||o.mode==='test'||o.mode==='boss';
 modal(`<h2 class="${res.win||o.mode==='test'?'res-win':'res-lose'}" id="resTitle">${title}</h2>
 <div class="muted" style="text-align:center">${({bet:o.bet?'BET RACE':'FREE RACE',pink:'PINK SLIP RACE',boss:'BOSS RACE',event:'TOURNAMENT',war:'CREW WAR',defend:'TURF DEFENSE',test:'TEST RUN'})[o.mode]} · ${q?'¼':'⅛'} mile</div>
 <div class="timeslip"><div class="tshead">★ PINK SLIP RIVALS DRAGWAY ★<br>${new Date().toLocaleString()}</div>
 <table><tr><th></th><th>${res.win||o.mode==='test'?'🏆 ':''}YOU</th><th>${!res.win&&o.mode!=='test'?'🏆 ':''}${o.opp.name.slice(0,14)}</th></tr>
 ${rows.map(([n,k])=>`<tr><td>${n}</td><td>${A[k]}</td><td>${B[k]}</td></tr>`).join('')}
 <tr><td>Launch</td><td>${me.launchGrade||'-'}</td><td>${op.launchGrade||'-'}</td></tr>
 <tr><td>Perfect shifts</td><td>${me.shifts.PERFECT}/${me.gear-1}</td><td>${op.shifts.PERFECT}/${op.gear-1}</td></tr></table>
 ${margin&&margin<50?`<div class="tsfoot">Margin of victory: ${margin.toFixed(4)}s</div>`:''}</div>
 <p style="text-align:center;font-size:15px" id="resReward">${res.reward}</p>${res.extra}
 <div class="btns"><button class="btn blue" id="resReplay">▶ Replay</button>${again?`<button class="btn green" id="resAgain">${o.mode==='test'?'Run again':'Rematch'}</button>`:''}<button class="btn pink" id="resBack">Continue</button></div>`);
 $('#resBack').onclick=()=>{closeModal();quitRace();};
 $('#resReplay').onclick=()=>{closeModal();if(!R.rec.length)return;R.phase='replay';R.rp=0;R.ri=0;R.popups=[];setBtns();};
 if(again)$('#resAgain').onclick=()=>{const oo=R.opts;closeModal();Snd.stop();R=null;
  if(oo.mode==='test'){const g=JSON.parse(JSON.stringify(activeCar()));g.color='#ffffff';startRace({opp:{name:'Dyno ghost',car:g,diff:'Ghost'},mode:'test',dist:oo.dist});return;}
  needFuel(()=>{if(oo.mode==='bet'&&!spend('coins',oo.bet)){quitRace();return;}startRace(oo);});};
 updWallet();
}

/* ================= DRAWING ================= */
function hash(n){const s=Math.sin(n*127.1+R.seed)*43758.5453;return s-Math.floor(s);}
function draw(){
 const trackH=Math.round(H*0.46),me=R.me,op=R.opp,live=R.phase==='run'||R.phase==='replay'||R.phase==='done';
 ctx.clearRect(0,0,W,H);
 const ppm=Math.max(14,W/24),camX=me.x-(W*0.30)/ppm;
 let g=ctx.createLinearGradient(0,0,0,trackH*0.5);g.addColorStop(0,'#0b0420');g.addColorStop(0.7,'#3a0f4f');g.addColorStop(1,'#ff4fa3');ctx.fillStyle=g;ctx.fillRect(0,0,W,trackH*0.5);
 ctx.fillStyle='#fff';for(let i=0;i<40;i++){ctx.globalAlpha=0.3+hash(i)*0.6;ctx.fillRect(hash(i+50)*W,hash(i+90)*trackH*0.35,1.5,1.5);}ctx.globalAlpha=1;
 const hz=trackH*0.5;
 [[0.12,'#1d0b30',0.55],[0.3,'#14072a',0.75]].forEach(([par,col,hm],li)=>{const off=camX*ppm*par,bw=46,start=Math.floor(off/bw)-1;
  for(let i=start;i<start+W/bw+3;i++){const hh=(0.25+hash(i*7+li*31)*hm)*hz*0.8,bx=i*bw-off;ctx.fillStyle=col;ctx.fillRect(bx,hz-hh,bw-4,hh);
   if(li===1){ctx.fillStyle='#ffd86b55';for(let wy=hz-hh+6;wy<hz-6;wy+=9)for(let wx=bx+5;wx<bx+bw-8;wx+=8)if(hash(wx*0.37+wy*1.3)>0.6)ctx.fillRect(wx,wy,3,4);}}});
 // grandstand with crowd
 const roadTop=hz+(trackH-hz)*0.28,roadBot=trackH,gsTop=hz-6;
 ctx.fillStyle='#160a22';ctx.fillRect(0,gsTop,W,roadTop-gsTop);
 const off2=camX*ppm*0.7;for(let rI=0;rI<4;rI++){const yy=gsTop+4+rI*((roadTop-gsTop-6)/4);ctx.fillStyle='#2a1838';ctx.fillRect(0,yy+5,W,2);
  for(let k=Math.floor(off2/7)-1;k<off2/7+W/7+1;k++){if(hash(k*3.1+rI*17)<0.35)continue;ctx.fillStyle=['#ff4fa3','#4dd6ff','#ffd43b','#e9e3f0','#9775fa'][Math.floor(hash(k+rI*9)*5)];const bob=live&&R.raceT<1.5?Math.sin(R.clock*20+k)*1.5:0;ctx.fillRect(k*7-off2,yy+bob,4,4);}}
 // light poles
 for(let m=Math.floor((camX-20)/40)*40;m<camX+W/ppm+40;m+=40){const sx=(m-camX)*ppm*0.95;ctx.fillStyle='#333';ctx.fillRect(sx,hz-55,3,55);ctx.fillStyle='#fff8d0';ctx.fillRect(sx-8,hz-60,19,5);ctx.fillStyle='rgba(255,248,208,0.06)';ctx.beginPath();ctx.moveTo(sx-8,hz-55);ctx.lineTo(sx+11,hz-55);ctx.lineTo(sx+40,roadBot);ctx.lineTo(sx-37,roadBot);ctx.fill();}
 ctx.fillStyle='#2b2b33';ctx.fillRect(0,roadTop,W,roadBot-roadTop);
 // rubber in launch area
 const lx0=(-2-camX)*ppm,lx1=(60-camX)*ppm;const rg=ctx.createLinearGradient(lx0,0,lx1,0);rg.addColorStop(0,'rgba(0,0,0,0.55)');rg.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=rg;ctx.fillRect(lx0,roadTop,lx1-lx0,roadBot-roadTop);
 const laneOpp=roadTop+(roadBot-roadTop)*0.45,laneMe=roadTop+(roadBot-roadTop)*0.93;
 ctx.fillStyle='#ddd';ctx.fillRect(0,roadTop,W,2);
 ctx.fillStyle='#e8e8e8';const midY=roadTop+(roadBot-roadTop)*0.55;
 for(let m=Math.floor(camX/6)*6;m<camX+W/ppm+6;m+=6){const sx=(m-camX)*ppm;ctx.fillRect(sx,midY,3*ppm,3);}
 // boards (feet)
 const boards=[60,330,660,1000,1320].map(f=>f/3.28084).filter(m=>m<=R.dist+0.1);
 boards.forEach(m=>{const sx=(m-camX)*ppm;if(sx<-60||sx>W+60)return;ctx.fillStyle='#555';ctx.fillRect(sx,roadTop-24,3,24);ctx.fillStyle='#ffd43b';ctx.fillRect(sx-16,roadTop-40,36,16);ctx.fillStyle='#000';ctx.font='bold 10px sans-serif';ctx.textAlign='center';ctx.fillText(Math.round(m*3.28084)+"'",sx+2,roadTop-28);});
 // staging beams / start / finish
 {const sx=(0-camX)*ppm;ctx.fillStyle='#fff';ctx.fillRect(sx,roadTop,4,roadBot-roadTop);ctx.fillStyle='#ffd43b';ctx.fillRect(sx-0.4*ppm,roadTop,2,roadBot-roadTop);}
 {const sx=(R.dist-camX)*ppm;if(sx>-30&&sx<W+30){const sz=8;for(let yy=roadTop;yy<roadBot;yy+=sz)for(let c=0;c<3;c++){ctx.fillStyle=((yy-roadTop)/sz+c)%2<1?'#fff':'#000';ctx.fillRect(sx+c*sz,yy,sz,sz);}ctx.fillStyle='#ff4fa3';ctx.fillRect(sx,roadTop-60,4,60);ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText('FINISH',sx,roadTop-64);}}
 const L=4.4*ppm;
 const burnSmoke=(sx,ly,amt)=>{for(let k=0;k<7;k++){ctx.fillStyle=`rgba(225,225,235,${(0.3-k*0.035)*amt})`;ctx.beginPath();ctx.arc(sx+L*0.2-k*L*0.16-Math.random()*10,ly-L*0.06-k*4-Math.random()*4,L*0.1+k*L*0.05,0,Math.PI*2);ctx.fill();}};
 const drawR=(r,ly,isGhost)=>{const sx=(r.x-camX)*ppm-L;
  if(r.spin)burnSmoke(sx,ly,R.phase==='burnout'?1.6:1);
  if(sx>-L*1.2&&sx<W+L*0.2)drawCar(ctx,sx,ly,L,r.spec.color,r.spec.body,r.wheelA,{flame:r.nosT>0,alpha:isGhost?0.45:0});
  return sx;};
 const osx=drawR(op,laneOpp,R.ghost);drawR(me,laneMe,false);
 if(osx<-L||osx>W){const gap=op.x-me.x;ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign=osx<0?'left':'right';ctx.fillText((osx<0?'◀ ':'')+(gap>0?'+':'')+gap.toFixed(1)+'m'+(osx<0?'':' ▶'),osx<0?8:W-8,laneOpp-12);}
 ctx.font='bold 11px sans-serif';ctx.textAlign='left';ctx.fillStyle='#ffffffcc';ctx.fillText(R.opts.opp.name+' · '+op.spec.name,8,roadTop+12);
 // HUD
 const pbY=SAT+12,pbx=12,pbw=W-70;ctx.fillStyle='#0008';ctx.fillRect(pbx,pbY,pbw,8);
 ctx.fillStyle='#ff4fa3';ctx.fillRect(pbx,pbY,pbw*clamp(me.x/R.dist,0,1),4);ctx.fillStyle='#ffd43b';ctx.fillRect(pbx,pbY+4,pbw*clamp(op.x/R.dist,0,1),4);
 ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
 const rtTxt=me.foul?'FOUL':me.launched?me.rt.toFixed(3):'—';const etTxt=me.fin?me.et.toFixed(3):me.launched&&R.raceT>me.launchT?(R.raceT-me.launchT).toFixed(2):'0.00';
 ctx.fillText(`${R.dist===QUARTER?'¼':'⅛'} MILE`,pbx,pbY+24);ctx.fillText(`R/T ${rtTxt}`,pbx,pbY+40);ctx.fillText(`ET ${etTxt}`,pbx,pbY+56);
 if(R.phase==='replay'){ctx.fillStyle='#ff4fa3';ctx.font='900 italic 18px sans-serif';ctx.textAlign='right';ctx.fillText('● REPLAY',W-58,pbY+28);}
 if(R.phase==='burnout'){const bx=W/2-80,by=pbY+60;ctx.fillStyle='#000a';ctx.fillRect(bx-6,by-22,172,48);ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('TIRE TEMP · hold BURNOUT',W/2,by-8);
  ctx.fillStyle='#333';ctx.fillRect(bx,by,160,12);ctx.fillStyle='#3ddc8455';ctx.fillRect(bx+160*0.6/1.1,by,160*0.3/1.1,12);const tc=R.tire>0.9?'#ff6b6b':R.tire>=0.6?'#3ddc84':'#ffd43b';ctx.fillStyle=tc;ctx.fillRect(bx,by+3,160*Math.min(1,R.tire/1.1),6);}
 if(R.phase==='stage'||R.phase==='tree'||(R.phase==='run'&&R.raceT<1.5))drawTree(W/2,pbY+22);
 if((R.phase==='tree'||R.phase==='stage')&&!me.pendingFoul){ctx.font='bold 13px sans-serif';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(R.phase==='stage'?'STAGING… rev into the GREEN':'HOLD GAS · TAP LAUNCH ON GREEN',W/2,pbY+196);}
 if(R.phase==='run'&&!me.launched){ctx.font='900 italic 22px sans-serif';ctx.textAlign='center';ctx.fillStyle='#22ff66';ctx.fillText('GO! GO! GO!',W/2,pbY+196);}
 g=ctx.createLinearGradient(0,trackH,0,H);g.addColorStop(0,'#1a0a28');g.addColorStop(1,'#07020d');ctx.fillStyle=g;ctx.fillRect(0,trackH,W,H-trackH);
 ctx.fillStyle='#ff4fa3';ctx.fillRect(0,trackH,W,2);
 const btnTop=R.phase==='replay'?H-20:H-Math.max(120,H*0.24);const avail=btnTop-trackH;const rad=Math.min(W*0.3,avail*0.42);
 drawTach(W/2,trackH+avail*0.56,rad);
 R.popups.forEach((p,i)=>{ctx.globalAlpha=1-p.t/1.3;ctx.fillStyle=p.color;ctx.font=`900 italic ${Math.round(Math.min(28,W/14))}px sans-serif`;ctx.textAlign='center';ctx.strokeStyle='#000';ctx.lineWidth=4;const y=trackH*0.66-p.t*30-(R.popups.length-1-i)*34;ctx.strokeText(p.text,W/2,y);ctx.fillText(p.text,W/2,y);ctx.globalAlpha=1;});
}
function drawTree(tx,ty){
 const me=R.me,op=R.opp,colW=26,w=colW*2+16,hgt=166;
 ctx.fillStyle='#0d0d10ee';ctx.fillRect(tx-w/2,ty,w,hgt);ctx.fillStyle='#222';ctx.fillRect(tx-3,ty+hgt,6,20);
 const cols=[[tx-colW/2-4,op],[tx+colW/2+4,me]];
 const amb=R.phase==='tree'?R.amberAt.filter(t=>R.phaseT>=t).length:0;
 const green=R.phase==='run'||R.phase==='done';
 const bulb=(x,y,r,on,col)=>{ctx.fillStyle=on?col:'#2a2a2a';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();if(on){ctx.shadowColor=col;ctx.shadowBlur=14;ctx.fill();ctx.shadowBlur=0;}};
 cols.forEach(([cx,r])=>{
  const pre=r.x>=-0.7,stg=r.x>=0;
  bulb(cx-6,ty+10,4,pre,'#fff4c2');bulb(cx+6,ty+10,4,pre,'#fff4c2');
  bulb(cx-6,ty+22,4,stg,'#fff4c2');bulb(cx+6,ty+22,4,stg,'#fff4c2');
  for(let i=0;i<3;i++)bulb(cx,ty+44+i*24,9,R.phase==='tree'&&(S.settings.tree==='pro'?amb>0:amb===i+1||(amb>i&&false)),'#ffb700');
  bulb(cx,ty+44+72,10,green&&!r.foul,'#22ff66');
  bulb(cx,ty+44+98,10,r.foul||(r===me&&me.pendingFoul),'#ff2222');
 });
 ctx.fillStyle='#888';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('OPP',cols[0][0],ty+hgt-4);ctx.fillText('YOU',cols[1][0],ty+hgt-4);
}
function drawTach(cx,cy,rad){
 const me=R.me,s=me.spec,rpm=me.rpm,x=rpm/s.redline,maxR=Math.ceil(s.redline/1000+0.5),pre=!me.launched||R.phase!=='run'&&R.phase!=='replay'&&R.phase!=='done';
 const a0=Math.PI*0.75,a1=Math.PI*2.25,ang=v=>a0+(a1-a0)*clamp(v/(maxR*1000),0,1);
 ctx.fillStyle='#0c0614';ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff4fa3';ctx.lineWidth=3;ctx.stroke();
 const band=(lo,hi,col)=>{ctx.strokeStyle=col;ctx.lineWidth=rad*0.12;ctx.beginPath();ctx.arc(cx,cy,rad*0.86,ang(lo),ang(hi));ctx.stroke();};
 band(s.redline*0.985,maxR*1000,'#d6283b');
 if(pre)band(s.redline*(s.launchC-s.launchW),s.redline*(s.launchC+s.launchW),'#3ddc84');else band(s.redline*s.perfLo,s.redline*s.perfHi,'#4dd6ff');
 ctx.strokeStyle='#ddd';ctx.fillStyle='#ddd';ctx.font=`bold ${Math.round(rad*0.13)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
 for(let k=0;k<=maxR;k++){const a=ang(k*1000);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*rad*0.74,cy+Math.sin(a)*rad*0.74);ctx.lineTo(cx+Math.cos(a)*rad*0.66,cy+Math.sin(a)*rad*0.66);ctx.stroke();ctx.fillText(k,cx+Math.cos(a)*rad*0.55,cy+Math.sin(a)*rad*0.55);}
 const na=ang(rpm);ctx.strokeStyle='#ff3b6b';ctx.lineWidth=Math.max(3,rad*0.04);ctx.beginPath();ctx.moveTo(cx-Math.cos(na)*rad*0.12,cy-Math.sin(na)*rad*0.12);ctx.lineTo(cx+Math.cos(na)*rad*0.9,cy+Math.sin(na)*rad*0.9);ctx.stroke();
 ctx.fillStyle='#222';ctx.beginPath();ctx.arc(cx,cy,rad*0.1,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff';ctx.font=`900 ${Math.round(rad*0.36)}px sans-serif`;ctx.fillText(!me.launched?'N':me.shiftT>0?'-':me.gear,cx,cy+rad*0.38);
 ctx.font=`bold ${Math.round(rad*0.14)}px sans-serif`;ctx.fillStyle='#ffb3d9';ctx.fillText(Math.round(mph(me.v))+' MPH',cx,cy+rad*0.7);
 ctx.fillStyle='#888';ctx.font=`${Math.round(rad*0.09)}px sans-serif`;ctx.fillText('x1000 rpm',cx,cy-rad*0.3);
 const n=7,sp=Math.min(26,rad*0.26),ly=cy-rad-sp*0.65,inWin=!pre&&x>=s.perfLo&&x<=s.perfHi,flash=Math.floor(R.clock*14)%2;
 for(let i=0;i<n;i++){const th=s.perfLo-0.18+i*0.03;let col='#2a2a2a';
  if(!pre){if(inWin)col=flash?'#4dd6ff':'#fff';else if(x>=0.985)col='#ff2b2b';else if(x>=th)col=i<3?'#3ddc84':i<5?'#ffd43b':'#ff6b6b';}
  else{const lx=s.launchC;if(Math.abs(x-lx)<=s.launchW)col='#3ddc84';else if(x>lx+s.launchW)col='#ff2b2b';else if(x>=lx-0.3+i*0.04)col='#ffd43b';}
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx+(i-(n-1)/2)*sp,ly,sp*0.36,0,Math.PI*2);ctx.fill();}
 const gx=cx+rad+14,gh=rad*1.4,gy=cy-gh/2,gw=Math.min(18,W*0.04);
 if(gx+gw<W-4){ctx.fillStyle='#0c0614';ctx.fillRect(gx,gy,gw,gh);ctx.strokeStyle='#4dd6ff';ctx.lineWidth=2;ctx.strokeRect(gx,gy,gw,gh);
  const f=me.nosUsed?me.nosT/s.nosDur:1;ctx.fillStyle='#4dd6ff';ctx.fillRect(gx+2,gy+2+(gh-4)*(1-f),gw-4,(gh-4)*f);ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('NOS',gx+gw/2,gy+gh+10);}
 const ox=cx-rad-14-gw;if(ox>4){ctx.fillStyle='#0c0614';ctx.fillRect(ox,gy,gw,gh);ctx.strokeStyle='#ffd43b';ctx.lineWidth=2;ctx.strokeRect(ox,gy,gw,gh);const f=clamp(R.opp.rpm/R.opp.spec.redline,0,1);ctx.fillStyle='#ffd43b';ctx.fillRect(ox+2,gy+2+(gh-4)*(1-f),gw-4,(gh-4)*f);ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('OPP',ox+gw/2,gy+gh+10);}
 ctx.textBaseline='alphabetic';
}

/* ================= INIT ================= */
window.PSR={get S(){return S;},get R(){return R;},startRace,buildSpec,estimateET,dyno,prOf,genLobby,render,CARS,showDaily};
initTurf();render();
if(dailyAvailable())setTimeout(showDaily,600);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
