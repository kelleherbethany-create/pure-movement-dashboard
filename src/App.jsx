import { useState, useEffect } from "react";

const C = { lavender:'#DFE5F3', cream:'#F2EFEA', navy:'#23303D', teal:'#395159', black:'#0D0D0D', white:'#FFFFFF' };
const CC = { redox:'#395159', gut:'#4A6E52', hormone:'#6B5580', bone:'#7A6545', 'anti-inflammatory':'#4A7A9B', recovery:'#5E5E6E', peptide:'#1A2530', immune:'#7A5C50', nutrition:'#506A52', hydration:'#4A8FAA', detox:'#6A5A7A' };
const DAYS = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
const DFULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const TL = {
  am:  '☀️  Wake — Empty Stomach',
  bk:  '🌅  Mid-Morning with Breakfast',
  md:  '🌤  Lunch',
  pre: '💦  Pre-Sauna / Sweat Session',
  pm:  '🌙  Dinner / Evening',
  bed: '🌑  Before Bed',
  lf:  '✓  Daily Commitments',
};
const B_THEMES = ['Foundation & Cellular Reset','Gut Healing & Hormone Balance','Mitochondrial Optimization','Peptide Prep — Final Integration'];
const A_THEMES = ['Gut Reset & Bone Foundation','Microbiome Rebuild','Inflammation Reduction','Athletic Performance Foundation'];

const it = (id,t,label,cat,note='') => ({id,t,label,cat,note});
const xe = (label,detail,icon) => ({label,detail,icon});

const getBItems = () => [
  it('am1','am','L-Glutamine 5g','gut','Empty stomach upon waking'),
  it('am2','am','Bovine Colostrum 1 scoop (~2.4g)','gut','Empty stomach upon waking'),
  it('am3','am','Zinc Carnosine 37.5mg','gut','Empty stomach — 1st dose'),
  it('bk1','bk','NAC 600mg','redox','With light breakfast'),
  it('bk2','bk','Ubiquinol CoQ10 100mg','redox','With light breakfast'),
  it('bk3','bk','PQQ 10mg','redox','With light breakfast'),
  it('md1','md','Bioavailable Curcumin 1000mg','anti-inflammatory','With lunch'),
  it('md2','md','High-EPA Omega-3 2000mg','anti-inflammatory','With lunch'),
  it('pre1','pre','High-sodium electrolyte 1 serving','hydration','In 24 oz water · before sauna or sweat session'),
  it('pm1','pm','Sulforaphane / Broccoli Seed Extract','redox','2 capsules ~30mg glucoraphanin · with dinner'),
  it('pm2','pm','Zinc Carnosine 37.5mg','gut','2nd dose · with dinner'),
  it('pm3','pm','Sermorelin .1ml SubQ injection','peptide','5 of 7 nights · per Dr. protocol'),
  it('bed1','bed','Activated Charcoal 500mg','detox','2+ hours after all food and supplements'),
  it('lf1','lf','100g+ protein daily','nutrition','Prioritize at every meal'),
  it('lf2','lf','No processed sugar or seed oils','nutrition'),
  it('lf3','lf','80–100 oz water','nutrition','+ electrolytes on training days'),
  it('lf4','lf','7–9 hours sleep','recovery','Critical for Sermorelin efficacy'),
  it('lf5','lf','10–15 min AM sunlight','recovery','Circadian reset · cortisol optimization'),
];

const getAItems = (wk) => [
  it('am1','am','Collagen Peptides 10g','bone','Empty stomach or with C · bone + tendon repair'),
  it('am2','am','Vitamin C 500mg','anti-inflammatory','Enhances collagen synthesis'),
  it('bk1','bk','Probiotic 25–50B CFU','gut','Age-appropriate dose'),
  it('bk2','bk', wk>=3 ? 'Omega-3 EPA/DHA 2g' : 'Omega-3 EPA/DHA 1–2g','bone', wk===3 ? '★ Slight increase wk 3' : 'Anti-inflammatory · bone density'),
  it('bk3','bk','Vitamin D3 2000IU + K2 100mcg','bone','Bone healing — critical'),
  it('bk4','bk','Calcium 500mg or food-based','bone','Check dietary intake — food first'),
  it('bk5','bk','Zinc 15mg','immune','With food'),
  ...(wk>=2 ? [it('bk6','bk','Prebiotic fiber or fermented food','gut', wk===2 ? '★ ADD WK 2 — kefir, sauerkraut, or prebiotic' : '')] : []),
  ...(wk>=3 ? [it('bk7','bk','Magnesium Malate 200mg AM','recovery', wk===3 ? '★ ADD WK 3 — energy + muscle recovery' : '')] : []),
  it('md1','md','Digestive Enzymes','gut','Support nutrient absorption'),
  it('md2','md','L-Glutamine 5g','gut','Gut lining repair'),
  it('pm1','pm','Magnesium Glycinate 200–300mg','recovery','Recovery + bone mineralization'),
  it('pm2','pm','Tart Cherry Extract','anti-inflammatory','Anti-inflammatory · sleep quality'),
  it('lf1','lf','80–100g protein — fuel the athlete','nutrition','DO NOT restrict — essential for bone healing'),
  it('lf2','lf','Anti-inflammatory foods daily','nutrition','Salmon, berries, greens, turmeric, ginger'),
  it('lf3','lf', wk>=3 ? 'Carb timing around workouts' : 'Adequate carbs on training days','nutrition','Bone healing requires energy'),
  it('lf4','lf','70–80 oz water','nutrition'),
  it('lf5','lf','8–9 hours sleep','recovery','Peak recovery window for teen athletes'),
];

const getBEx = (wk) => {
  const easyMi = [3,4,4,5][wk-1];
  const longMi = [6,7,7,8][wk-1];
  const hards = ['4×1mi @ tempo (RPE 7–8)','5×1mi @ tempo OR 8×400m','20 min tempo + 4×400m surges','25 min tempo — 28 days shows here'];
  const s1detail = ['Lower: Squat, RDL, Hip Thrust, BSS','Increase load 5–10% from wk 1','Progressive overload · track PRs','Peak load week'][wk-1];
  return [
    xe('Strength Day 1', 'Full Body Heavy · ' + s1detail, '🏋️'),
    xe('Easy Run', easyMi + ' miles · Zone 2 · conversational pace', '🏃'),
    xe('Strength Day 2 + Pilates', 'Full Body Heavy · Push/Pull · Pilates 30 min PM', '🏋️'),
    xe('Hard Run', 'Warm-up · ' + hards[wk-1] + ' · Cool-down', '⚡'),
    xe('Strength Day 3 + Easy Run', 'Full Body Heavy · Upper/Core · Easy Run ' + easyMi + 'mi', '🏋️'),
    xe('Long Run', longMi + ' miles · Easy effort · RPE 4–5 · fueled + hydrated', '🌿'),
    xe('Pilates + Easy Run', 'Pilates AM · Easy Run ' + (wk<4?3:4) + 'mi · active recovery' + (wk===4?' · 28 days!':''), '🧘'),
  ];
};

const getAEx = (wk) => {
  if (wk===1) return [
    xe('Foundation Strength','Hip/glute activation · band work · bodyweight · form focus','💪'),
    xe('Cross Training','Pool running 20 min OR cycling 30 min · zero impact','🏊'),
    xe('Strength + Mobility','Single-leg stability · core · hip hinge · yoga 20 min','💪'),
    xe('Active Recovery','Walk 20 min · foam roll · gentle stretch · breathwork','🌿'),
    xe('Foundation Strength','Full body light · posture + alignment · band resistance','💪'),
    xe('Walk/Run Intervals','20 min: 2 min easy jog / 2 min walk · flat surface','🏃'),
    xe('Rest + Nourish','Gentle yoga · meal prep · sleep priority · you are healing','🧘'),
  ];
  if (wk===2) return [
    xe('Foundation Strength','Hip/glute · increase band resistance · single-leg focus','💪'),
    xe('Cross Training','Pool running 25 min OR cycling 35 min','🏊'),
    xe('Strength + Mobility','Progressive single-leg · core stability · yoga','💪'),
    xe('Easy Run','2 miles easy · listen to your body','🏃'),
    xe('Foundation Strength','Full body · moderate resistance · add light DB work','💪'),
    xe('Easy Run','2.5 miles easy · flat route · fueled + hydrated','🏃'),
    xe('Rest + Nourish','Gentle movement only · prioritize sleep and eating well','🧘'),
  ];
  if (wk===3) return [
    xe('Progressive Strength','Hip/glute loaded · add light barbell · track weights','💪'),
    xe('Easy Run','3 miles · easy effort · no hills','🏃'),
    xe('Strength + Mobility','Full body moderate · step-up intro · core load','💪'),
    xe('Cross Training','Bike or pool 30 min · moderate HR','🏊'),
    xe('Progressive Strength','Total body · core load progression · confidence building','💪'),
    xe('Easy Run','3–4 miles · easy · grass surface preferred','🏃'),
    xe('Rest + Recovery','Foam roll · yoga · nourish · look how far you have come','🧘'),
  ];
  return [
    xe('Strength','Hip/glute loaded · progressive overload · confidence week','💪'),
    xe('Easy Run','4 miles · easy','🏃'),
    xe('Strength + Strides','Full body · 4x80m controlled strides post-lift','💪'),
    xe('Cross Training','Bike or pool 30 min','🏊'),
    xe('Total Body Strength','Peak week · assess all lifts · strong finish','💪'),
    xe('Easy Run','4–5 miles · easy · race-ready legs incoming','🏃'),
    xe('Active Recovery','Gentle yoga · stretch · celebrate — XC season ready!','🌟'),
  ];
};

export default function App() {
  const [prof, setProf] = useState('B');
  const [wk, setWk] = useState(1);
  const [di, setDi] = useState(0);
  const [tab, setTab] = useState('proto');
  const [chk, setChk] = useState({});

  useEffect(() => {
    try {
      const s = localStorage.getItem('pm_v4');
      if (s) setChk(JSON.parse(s));
    } catch(e) {}
  }, []);

  const persist = (nc) => {
    try { localStorage.setItem('pm_v4', JSON.stringify(nc)); } catch(e) {}
  };

  const toggle = (id) => {
    const k = prof+'_w'+wk+'_d'+di+'_'+id;
    const nc = Object.assign({}, chk, {[k]: !chk[k]});
    setChk(nc); persist(nc);
  };

  const toggleX = (idx) => {
    const k = prof+'_w'+wk+'_x'+idx;
    const nc = Object.assign({}, chk, {[k]: !chk[k]});
    setChk(nc); persist(nc);
  };

  const isOn  = (id)  => !!chk[prof+'_w'+wk+'_d'+di+'_'+id];
  const isXOn = (idx) => !!chk[prof+'_w'+wk+'_x'+idx];

  const items  = prof==='B' ? getBItems() : getAItems(wk);
  const exs    = prof==='B' ? getBEx(wk)  : getAEx(wk);
  const themes = prof==='B' ? B_THEMES : A_THEMES;

  const grp = {};
  items.forEach(item => { if (!grp[item.t]) grp[item.t]=[]; grp[item.t].push(item); });

  const dayDone = items.filter(item => isOn(item.id)).length;
  const dayPct  = items.length ? Math.round(dayDone/items.length*100) : 0;
  const xDone   = [0,1,2,3,4,5,6].filter(n => isXOn(n)).length;

  const cbStyle = (on) => ({
    width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1,
    border:'2px solid '+(on ? C.teal : '#C5CDD5'),
    background: on ? C.teal : 'transparent',
    display:'flex', alignItems:'center', justifyContent:'center',
    transition:'all 0.2s',
  });

  const timeSlots = prof==='B'
    ? ['am','bk','md','pre','pm','bed','lf']
    : ['am','bk','md','pm','lf'];

  return (
    <div style={{minHeight:'100vh', background:C.cream, fontFamily:'"Trebuchet MS",Gill Sans,Calibri,system-ui,sans-serif', color:C.black, maxWidth:480, margin:'0 auto'}}>

      {/* HEADER */}
      <div style={{background:C.navy, color:C.white, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:10}}>
        <div>
          <div style={{fontSize:18, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase'}}>PURE MOVEMENT</div>
          <div style={{fontSize:8, letterSpacing:'0.2em', opacity:0.5, textTransform:'uppercase'}}>28-Day Protocol</div>
        </div>
        <div style={{display:'flex', background:'rgba(255,255,255,0.08)', borderRadius:16, padding:3, gap:2}}>
          {['B','A'].map(p => (
            <button key={p} onClick={() => setProf(p)} style={{
              padding:'5px 10px', borderRadius:13, border:'none', cursor:'pointer',
              fontSize:11, fontWeight:700, letterSpacing:'0.07em',
              background: prof===p ? C.teal : 'transparent',
              color: prof===p ? C.white : 'rgba(255,255,255,0.45)',
              transition:'all 0.2s',
            }}>{p==='B' ? 'BETHANY' : 'ADDIE'}</button>
          ))}
        </div>
      </div>

      {/* PROFILE STRIPE */}
      <div style={{background:C.teal, color:C.white, padding:'7px 16px', fontSize:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontWeight:700, letterSpacing:'0.03em'}}>
          {prof==='B' ? 'Bethany · 42 · Redox + Sermorelin + Peptide Prep' : 'Addie · 16 · Gut Recovery + Athletic Foundation'}
        </span>
        <span style={{background:'rgba(255,255,255,0.15)', borderRadius:9, padding:'2px 7px', fontSize:9, flexShrink:0, marginLeft:6}}>
          Wk {wk} · {themes[wk-1]}
        </span>
      </div>

      <div style={{padding:'12px 12px 90px'}}>

        {/* WEEK NAV */}
        <div style={{display:'flex', gap:5, marginBottom:10}}>
          {[1,2,3,4].map(w => (
            <button key={w} onClick={() => setWk(w)} style={{
              flex:1, padding:'7px 0', borderRadius:7,
              border:'1.5px solid '+(wk===w ? C.navy : 'transparent'),
              background: wk===w ? C.navy : 'rgba(35,48,61,0.07)',
              color: wk===w ? C.white : C.navy,
              fontSize:11, fontWeight:700, cursor:'pointer', letterSpacing:'0.06em',
            }}>WEEK {w}</button>
          ))}
        </div>

        {/* DAY NAV */}
        <div style={{display:'flex', gap:4, marginBottom:10}}>
          {DAYS.map((d, idx) => {
            const done = items.length>0 && items.every(item => !!chk[prof+'_w'+wk+'_d'+idx+'_'+item.id]);
            return (
              <button key={d} onClick={() => setDi(idx)} style={{
                flex:1, padding:'6px 1px', borderRadius:7, border:'none',
                background: di===idx ? C.teal : done ? C.lavender : C.white,
                color: di===idx ? C.white : C.navy,
                fontSize:9, fontWeight:700, cursor:'pointer',
                boxShadow:'0 1px 2px rgba(0,0,0,0.06)',
              }}>
                <div>{d}</div>
                {done && <div style={{fontSize:7, color: di===idx ? 'rgba(255,255,255,0.8)' : C.teal}}>✓</div>}
              </button>
            );
          })}
        </div>

        {/* DAY PROGRESS */}
        <div style={{background:C.white, borderRadius:9, padding:'9px 13px', marginBottom:10, display:'flex', alignItems:'center', gap:10, boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
          <div style={{flex:1}}>
            <div style={{fontSize:9, color:C.teal, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4}}>
              {DFULL[di]} · Protocol Progress
            </div>
            <div style={{background:C.lavender, borderRadius:4, height:5, overflow:'hidden'}}>
              <div style={{width:dayPct+'%', height:'100%', background:'linear-gradient(90deg,'+C.teal+','+C.navy+')', borderRadius:4, transition:'width 0.4s'}} />
            </div>
          </div>
          <div style={{fontSize:18, fontWeight:700, color:C.navy, minWidth:38, textAlign:'right'}}>
            {dayPct}<span style={{fontSize:10}}>%</span>
          </div>
        </div>

        {/* TABS */}
        <div style={{display:'flex', background:C.white, borderRadius:8, padding:3, marginBottom:12, boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
          {[{id:'proto',l:'Protocol'},{id:'ex',l:'Exercise'},{id:'prog',l:'Progress'}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, padding:'7px 0', borderRadius:6, border:'none',
              background: tab===t.id ? C.navy : 'transparent',
              color: tab===t.id ? C.white : C.navy,
              fontSize:11, fontWeight:700, cursor:'pointer', letterSpacing:'0.07em', textTransform:'uppercase',
              transition:'all 0.2s',
            }}>{t.l}</button>
          ))}
        </div>

        {/* PROTOCOL TAB */}
        {tab==='proto' && (
          <div>
            {timeSlots.map(tk => {
              const ti = grp[tk] || [];
              if (!ti.length) return null;
              const allDone = ti.every(item => isOn(item.id));
              return (
                <div key={tk} style={{background:C.white, borderRadius:12, marginBottom:10, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
                  <div style={{background: allDone ? C.teal : C.navy, color:C.white, padding:'7px 13px', fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', display:'flex', justifyContent:'space-between', transition:'background 0.3s'}}>
                    <span>{TL[tk]}</span>
                    {allDone && <span>COMPLETE ✓</span>}
                  </div>
                  {ti.map((item, n) => {
                    const on = isOn(item.id);
                    return (
                      <div key={item.id} onClick={() => toggle(item.id)} style={{
                        display:'flex', alignItems:'flex-start', padding:'9px 13px', gap:9, cursor:'pointer',
                        borderBottom: n<ti.length-1 ? '1px solid '+C.lavender : 'none',
                        background: on ? 'rgba(223,229,243,0.25)' : C.white,
                      }}>
                        <div style={cbStyle(on)}>{on && <span style={{color:C.white, fontSize:11, lineHeight:1}}>✓</span>}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12, fontWeight:600, color: on ? '#9AAAB5' : C.black, textDecoration: on ? 'line-through' : 'none', lineHeight:1.3}}>
                            {item.label}
                          </div>
                          {item.note && <div style={{fontSize:9, color:'#A5B0BB', marginTop:2, fontStyle:'italic'}}>{item.note}</div>}
                        </div>
                        <div style={{fontSize:8, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:C.white, background: CC[item.cat]||C.teal, padding:'2px 5px', borderRadius:8, flexShrink:0, opacity: on ? 0.4 : 1, marginTop:1}}>
                          {item.cat}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* EXERCISE TAB */}
        {tab==='ex' && (
          <div>
            <div style={{background:C.navy, borderRadius:12, padding:'15px 16px', marginBottom:10, color:C.white}}>
              <div style={{fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', opacity:0.5, marginBottom:3}}>{DFULL[di]}</div>
              <div style={{fontSize:20, fontWeight:700, marginBottom:4}}>{exs[di] && exs[di].icon} {exs[di] && exs[di].label}</div>
              <div style={{fontSize:11, opacity:0.85, lineHeight:1.55}}>{exs[di] && exs[di].detail}</div>
              <div onClick={() => toggleX(di)} style={{
                display:'inline-flex', alignItems:'center', gap:7, marginTop:12,
                background: isXOn(di) ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                borderRadius:8, padding:'7px 13px', cursor:'pointer',
              }}>
                <div style={{width:17, height:17, borderRadius:4, border:'2px solid '+(isXOn(di) ? C.white : 'rgba(255,255,255,0.35)'), background: isXOn(di) ? C.white : 'transparent', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  {isXOn(di) && <span style={{color:C.navy, fontSize:11}}>✓</span>}
                </div>
                <span style={{fontSize:12, fontWeight:600}}>{isXOn(di) ? '💪 Done!' : 'Mark Complete'}</span>
              </div>
            </div>
            <div style={{fontSize:9, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', color:C.teal, marginBottom:8}}>
              Week {wk} · {xDone}/7 Workouts Complete
            </div>
            {exs.map((ex, idx) => {
              const done = isXOn(idx);
              const active = idx===di;
              return (
                <div key={idx} onClick={() => setDi(idx)} style={{
                  display:'flex', alignItems:'center', gap:9, padding:'9px 11px',
                  background: active ? C.lavender : C.white,
                  borderRadius:9, marginBottom:5, cursor:'pointer',
                  borderLeft:'3px solid '+(done ? C.teal : active ? C.navy : 'transparent'),
                  boxShadow:'0 1px 2px rgba(0,0,0,0.05)',
                }}>
                  <div style={{width:30, height:30, borderRadius:7, flexShrink:0, background: done ? C.teal : active ? C.navy : 'rgba(35,48,61,0.09)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color: done||active ? C.white : C.navy}}>
                    {done ? '✓' : ex.icon}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11, fontWeight:700, color: done ? C.teal : C.navy}}>{DAYS[idx]} — {ex.label}</div>
                    <div style={{fontSize:9, color:'#9AAAB5', marginTop:1, lineHeight:1.3}}>{ex.detail}</div>
                  </div>
                  <div onClick={e => { e.stopPropagation(); toggleX(idx); }} style={{width:18, height:18, borderRadius:4, border:'2px solid '+(done ? C.teal : '#C5CDD5'), background: done ? C.teal : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0}}>
                    {done && <span style={{color:C.white, fontSize:11}}>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PROGRESS TAB */}
        {tab==='prog' && (
          <div>
            <div style={{background:C.white, borderRadius:12, padding:'14px', marginBottom:10, boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:9, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', color:C.teal, marginBottom:10}}>
                Week {wk} · Daily Protocol
              </div>
              {DAYS.map((d, idx) => {
                const done = items.filter(item => !!chk[prof+'_w'+wk+'_d'+idx+'_'+item.id]).length;
                const pct  = items.length ? Math.round(done/items.length*100) : 0;
                return (
                  <div key={d} style={{display:'flex', alignItems:'center', gap:9, marginBottom:7}}>
                    <div style={{fontSize:9, fontWeight:700, color:C.navy, width:24}}>{d}</div>
                    <div style={{flex:1, background:C.lavender, borderRadius:3, height:5, overflow:'hidden'}}>
                      <div style={{width:pct+'%', height:'100%', background: pct===100 ? C.teal : 'linear-gradient(90deg,'+C.teal+','+C.navy+')', borderRadius:3, transition:'width 0.4s'}} />
                    </div>
                    <div style={{fontSize:9, color: pct===100 ? C.teal : '#9AAAB5', fontWeight: pct===100 ? 700 : 400, width:26, textAlign:'right'}}>{pct}%</div>
                  </div>
                );
              })}
            </div>

            <div style={{background:C.white, borderRadius:12, padding:'14px', marginBottom:10, boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:9, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', color:C.teal, marginBottom:10}}>
                Week {wk} · Exercise · {xDone}/7
              </div>
              <div style={{display:'flex', gap:5, flexWrap:'wrap'}}>
                {exs.map((ex, idx) => (
                  <div key={idx} style={{padding:'5px 10px', borderRadius:14, fontSize:10, fontWeight:700, background: isXOn(idx) ? C.teal : C.lavender, color: isXOn(idx) ? C.white : C.navy}}>
                    {isXOn(idx) ? '✓ ' : ''}{DAYS[idx]}
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:C.white, borderRadius:12, padding:'14px', marginBottom:10, boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:9, fontWeight:700, letterSpacing:'0.13em', textTransform:'uppercase', color:C.teal, marginBottom:12}}>28-Day Journey</div>
              {[1,2,3,4].map(wNum => {
                const wItems = prof==='B' ? getBItems() : getAItems(wNum);
                const wTotal = wItems.length * 7;
                const wDone  = Object.keys(chk).filter(k => k.startsWith(prof+'_w'+wNum+'_d') && chk[k]).length;
                const pct    = wTotal ? Math.round(wDone/wTotal*100) : 0;
                return (
                  <div key={wNum} style={{marginBottom:11}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:3}}>
                      <span style={{fontSize:10, fontWeight:700, color: wNum===wk ? C.teal : C.navy}}>Week {wNum} · {themes[wNum-1]}</span>
                      <span style={{fontSize:10, color:'#9AAAB5'}}>{pct}%</span>
                    </div>
                    <div style={{background:C.lavender, borderRadius:4, height:5, overflow:'hidden'}}>
                      <div style={{width:pct+'%', height:'100%', background: wNum===wk ? 'linear-gradient(90deg,'+C.teal+','+C.navy+')' : 'linear-gradient(90deg,#8A9AAA,#B0BBC4)', borderRadius:4, transition:'width 0.4s'}} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{background:C.lavender, borderRadius:11, padding:'13px 15px', fontSize:11, lineHeight:1.65, color:C.navy}}>
              <div style={{fontWeight:700, marginBottom:4, fontSize:12, letterSpacing:'0.03em'}}>Coach Note</div>
              {prof==='B'
                ? 'At 42 on Sermorelin, your sleep window IS the protocol. GH pulse peaks 90–120 min after sleep onset — every late night blunts that response. Activated charcoal before bed only works if you give it the full 2+ hour buffer. Lights out by 10–10:30pm protects both.'
                : 'Addie — your body is rebuilding from the inside out. Every day you eat enough and sleep fully, you are laying down new bone matrix. Composition follows function: fuel the athlete, train consistently, and leanness is a natural outcome. The goal is to be fast and strong, not just lighter. Trust the process.'
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
