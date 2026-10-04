/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raw={get(k){try{return JSON.parse(localStorage.getItem('bloom_'+k))}catch(e){return null}},set(k,v){try{localStorage.setItem('bloom_'+k,JSON.stringify(v))}catch(e){}}};
let UID=raw.get('session')||null;
function me(){return UID?((raw.get('accounts')||[]).find(a=>a.id===UID)||null):null}
if(UID&&!me())UID=null;
const S={pre(){return UID?'bloom_u'+UID+'_':'bloom_'},get(k,d){try{const v=localStorage.getItem(this.pre()+k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(this.pre()+k,JSON.stringify(v))}catch(e){}}};
const Y=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);
const G=q=>'https://www.google.com/search?q='+encodeURIComponent(q);
const inr=n=>'₹'+Math.round(n).toLocaleString('en-IN');
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2600)}
function openModal(h){$('#mbox').innerHTML=h;$('#modal').hidden=false}
function closeModal(){$('#modal').hidden=true;stopRing()}
function openNav(){$('#side').classList.add('open');$('#scrim').classList.add('show')}
function closeNav(){$('#side').classList.remove('open');$('#scrim').classList.remove('show')}
function quickExit(){location.replace('https://www.google.com')}
let escN=0;document.addEventListener('keydown',e=>{if(e.key==='Escape'){escN++;setTimeout(()=>escN=0,700);if(escN>=2)quickExit()}});
function rerender(id){const y=window.scrollY;$('#view').innerHTML=PAGES[id]();window.scrollTo(0,y);if(INIT[id])INIT[id]()}

/* ---------- navigation ---------- */
const NAV=[
['home','Home','🏡'],['scholarships','Scholarships','🎓'],['exams','Exams','📝'],['skills','Skills','💡'],['safety','Safety (SOS)','🛡️'],
['finance','Finance','🪙'],['wellness','Wellness','🌸'],['contacts','Contacts','📞'],['achievers','Achievers','✨'],['community','Community','👭'],['dashboard','Dashboard','📊'],['account','My Account','👤']];
$('#nav').innerHTML=NAV.map(n=>`<a href="#/${n[0]}" data-id="${n[0]}"><span>${n[2]}</span>${n[1]}</a>`).join('');
const TILES=[
['scholarships','Scholarships','Find government and private scholarships matched to your qualification, category and income.','rgba(255,92,154,.2)'],
['exams','Exams','Which exam should you give? Government and private options, cheapest preparation and free resources.','rgba(120,160,255,.2)'],
['skills','Skills','Free certificate courses from NPTEL, Coursera, Udemy and more, plus 10 skills every girl should learn.','rgba(240,189,90,.2)'],
['safety','Safety & SOS','One-tap SOS guidance, a personal safety plan and your rights at work and at home.','rgba(229,72,77,.22)'],
['finance','Finance','SIP calculator, 50/30/20 budget planner and loan and savings schemes for women.','rgba(80,210,150,.2)'],
['wellness','Wellness','Guided breathing, 5-4-3-2-1 grounding and a private mood journal.','rgba(180,130,240,.22)'],
['contacts','Contacts','Important helplines and your own trusted circle, one tap away.','rgba(120,160,255,.2)'],
['community','Community','A moderated space to share, ask and cheer each other on.','rgba(80,210,150,.2)'],
['dashboard','Dashboard','See your safety, wellness, skills and goals progress at a glance.','rgba(255,160,110,.2)']];
const EMO=Object.fromEntries(NAV.map(n=>[n[0],n[2]]));

/* ---------- DATA: scholarships ---------- */
const NSP='https://scholarships.gov.in';
const LEVELS={pre:'Class 8 – 10',hs:'Class 11 – 12',ug:'Undergraduate (Degree)',pg:'Postgraduate',tech:'Diploma / Engineering / Medical / Professional'};
const SCH=[
/* ---------------- GOVERNMENT ---------------- */
{id:'pmsc',t:'gov',name:'Post Matric Scholarship for SC Students',by:'Ministry of Social Justice & Empowerment',levels:['hs','ug','pg','tech'],cats:['SC'],inc:2.5,amt:'Course fee + monthly maintenance allowance',desc:'Helps SC students continue studies after Class 10 by covering fees and living costs.',link:NSP,nsp:1},
{id:'pmst',t:'gov',name:'Post Matric Scholarship for ST Students',by:'Ministry of Tribal Affairs',levels:['hs','ug','pg','tech'],cats:['ST'],inc:2.5,amt:'Course fee + monthly maintenance allowance',desc:'Financial support for ST students studying after Class 10.',link:NSP,nsp:1},
{id:'prem',t:'gov',name:'Pre-Matric Scholarship for SC / ST (Class 9 – 10)',by:'Ministry of Social Justice / Tribal Affairs',levels:['pre'],cats:['SC','ST'],inc:2.5,amt:'Yearly allowance + admission fee support',desc:'Keeps SC/ST students in school by supporting costs in Class 9 and 10.',link:NSP,nsp:1},
{id:'nmms',t:'gov',name:'National Means-cum-Merit Scholarship (NMMSS)',by:'Department of School Education & Literacy',levels:['pre','hs'],inc:3.5,marks:55,amt:'₹12,000 per year',desc:'Prevents talented students from economically weaker families from dropping out after Class 8.',link:NSP,nsp:1,extra:['Selected through a state-level scholarship exam taken in Class 8','Studying in a government or government-aided school']},
{id:'yas',t:'gov',name:'PM YASASVI Scholarship (OBC / EBC / DNT)',by:'Ministry of Social Justice & Empowerment',levels:['pre','hs'],cats:['OBC'],inc:2.5,amt:'Merit-based, varies with class',desc:'Scholarship for OBC students selected through the YASASVI entrance test.',link:NSP,nsp:1,extra:['Selection through the YASASVI Entrance Test (YET) by NTA']},
{id:'bhm',t:'gov',name:'Begum Hazrat Mahal National Scholarship (girls)',by:'Maulana Azad Education Foundation',levels:['pre','hs'],req:['minority'],inc:2,marks:50,amt:'About ₹5,000 – ₹6,000 per year',desc:'Only for meritorious girls from notified minority communities, Class 9 – 12.',link:'https://www.maef.nic.in'},
{id:'minpre',t:'gov',name:'Pre-Matric Scholarship for Minorities',by:'Ministry of Minority Affairs',levels:['pre'],req:['minority'],inc:1,marks:50,amt:'Yearly allowance + fees (varies)',desc:'Helps minority students stay in school.',link:NSP,nsp:1},
{id:'minpost',t:'gov',name:'Post-Matric & Merit-cum-Means Scholarship for Minorities',by:'Ministry of Minority Affairs',levels:['hs','ug','pg','tech'],req:['minority'],inc:2.5,marks:50,amt:'Course fee + maintenance allowance',desc:'Supports minority students in Class 11 up to professional and technical courses.',link:NSP,nsp:1},
{id:'css',t:'gov',name:'Central Sector Scholarship for College & University Students',by:'Department of Higher Education',levels:['ug','pg','tech'],inc:4.5,marks:80,amt:'About ₹12,000 – ₹20,000 per year',desc:'For students above the 80th percentile in Class 12 who join regular college courses.',link:NSP,nsp:1,extra:['Must be in top 20 percentile of your board in Class 12 (cut-offs vary by board)']},
{id:'pragati',t:'gov',name:'Pragati Scholarship for Girl Students (AICTE)',by:'All India Council for Technical Education',levels:['tech'],inc:8,amt:'About ₹50,000 per year',desc:'Helps girls take up technical education (diploma or degree) in AICTE-approved institutions.',link:'https://www.aicte-india.org/schemes/students-development-schemes',extra:['Maximum two girl children per family','Admitted to the first year (or lateral entry second year) of an AICTE-approved college']},
{id:'saksham',t:'gov',name:'Saksham Scholarship for Specially-Abled (AICTE)',by:'All India Council for Technical Education',levels:['tech'],req:['disability'],inc:8,amt:'About ₹50,000 per year',desc:'For students with 40% or more disability studying technical courses.',link:'https://www.aicte-india.org/schemes/students-development-schemes'},
{id:'pgi',t:'gov',name:'Indira Gandhi Scholarship for Single Girl Child (UGC)',by:'University Grants Commission',levels:['pg'],req:['single'],amt:'₹36,200 per year for 2 years',desc:'For the only girl child in the family pursuing a regular postgraduate course.',link:NSP,nsp:1,extra:['Age up to 30 years at the time of admission']},
{id:'cbse',t:'gov',name:'CBSE Merit Scholarship for Single Girl Child',by:'Central Board of Secondary Education',levels:['hs'],req:['single'],marks:60,amt:'₹1,000 per month for 2 years',desc:'For single girl children who score well in Class 10 CBSE and continue to Class 11 – 12.',link:'https://www.cbse.gov.in',extra:['Passed Class 10 from a CBSE school with 60% or more','Tuition fee not above the limit set by CBSE']},
{id:'inspire',t:'gov',name:'INSPIRE Scholarship for Higher Education (SHE)',by:'Department of Science & Technology',levels:['ug'],req:['stem'],marks:85,amt:'₹80,000 per year (approx.)',desc:'For top students who choose pure sciences like B.Sc. or Integrated M.Sc.',link:'https://www.online-inspire.gov.in',extra:['Top 1% in Class 12 board exam, or a good rank in JEE / NEET']},
{id:'mahadbt',t:'gov',name:'Maharashtra EBC Fee Concession (Shahu Maharaj Scheme)',by:'Government of Maharashtra – MahaDBT',levels:['ug','pg','tech'],cats:['General','EWS'],state:'Maharashtra',inc:8,amt:'About 50% of tuition & exam fees',desc:'Fee concession for economically backward open-category students in Maharashtra.',link:'https://mahadbt.maharashtra.gov.in'},
{id:'mahasc',t:'gov',name:'Maharashtra Scholarships for SC / ST / OBC / VJNT (MahaDBT)',by:'Government of Maharashtra – MahaDBT',levels:['hs','ug','pg','tech'],cats:['SC','ST','OBC'],state:'Maharashtra',amt:'Fee reimbursement / allowance (varies by scheme)',desc:'One portal for many state scholarships and free-ship schemes for reserved categories.',link:'https://mahadbt.maharashtra.gov.in',extra:['Income limits differ by scheme – the portal shows the ones you qualify for']},
{id:'tnpp',t:'gov',name:'Pudhumai Penn Scheme (Tamil Nadu)',by:'Government of Tamil Nadu',levels:['ug','tech'],state:'Tamil Nadu',amt:'₹1,000 per month',desc:'Monthly support for girls who studied in government schools and now pursue college or diploma.',link:'https://www.pudhumaipenn.tn.gov.in'},
{id:'kanya',t:'gov',name:'Kanyashree Prakalpa (West Bengal)',by:'Government of West Bengal',levels:['pre','hs','ug'],state:'West Bengal',inc:1.2,amt:'₹1,000 per year (K1) / ₹25,000 one-time (K2)',desc:'Encourages girls to continue studies and delays early marriage.',link:'https://wbkanyashree.gov.in'},
/* ---------------- PRIVATE ---------------- */
{id:'reliance',t:'pvt',name:'Reliance Foundation Undergraduate Scholarships',by:'Reliance Foundation',levels:['ug','tech'],inc:15,marks:60,amt:'Up to ₹2,00,000 over the course',desc:'Merit-cum-means scholarship; students with lower family income get priority.',link:'https://scholarships.reliancefoundation.org'},
{id:'hdfc',t:'pvt',name:"HDFC Bank Parivartan's ECSS Scholarship",by:'HDFC Bank',levels:['pre','hs','ug','pg','tech'],inc:2.5,marks:55,amt:'Varies by course (up to ₹75,000)',desc:'Helps students facing financial crisis to continue their education.',link:'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme'},
{id:'pankh',t:'pvt',name:'Tata Capital Pankh Scholarship',by:'Tata Capital',levels:['hs','ug','tech'],inc:4,marks:60,amt:'Partial tuition support (varies)',desc:'Supports students from Class 11 to graduation or diploma.',link:'https://www.buddy4study.com/page/tata-capital-pankh-scholarship-programme'},
{id:'loreal',t:'pvt',name:"L'Oréal India For Young Women in Science",by:"L'Oréal India",levels:['ug'],req:['stem'],inc:6,marks:85,amt:'Up to ₹2,50,000 in total',desc:'For girls who passed Class 12 in science and want to study science, engineering or medicine.',link:'https://www.buddy4study.com/page/loreal-india-for-young-women-in-science-scholarship'},
{id:'google',t:'pvt',name:'Google Generation Scholarship (Asia-Pacific)',by:'Google',levels:['ug','pg','tech'],req:['stem'],amt:'Cash award + Google events & mentoring',desc:'For women pursuing computer science or closely related degrees.',link:'https://buildyourfuture.withgoogle.com/scholarships',extra:['Strong academic record and interest in computing and leadership']},
{id:'kotak',t:'pvt',name:'Kotak Kanya Scholarship',by:'Kotak Education Foundation',levels:['ug','tech'],inc:6,marks:75,amt:'Up to ₹1,50,000 per year',desc:'For meritorious girls from low-income families entering professional courses.',link:'https://www.buddy4study.com/page/kotak-kanya-scholarship'},
{id:'ffe',t:'pvt',name:'Foundation for Excellence (FFE) Scholarship',by:'Foundation for Excellence',levels:['tech'],inc:3,marks:60,amt:'Covers a large part of course fees (varies)',desc:'Supports bright students from low-income families who get into professional courses like engineering and medicine.',link:'https://www.ffe.org',extra:['Criteria and income limit change each year, so check ffe.org for the latest rules']},
{id:'sbi',t:'pvt',name:'SBI Foundation Asha Scholarship',by:'SBI Foundation',levels:['pre','hs'],inc:3,marks:75,amt:'Annual financial aid (approx. ₹10,000)',desc:'Supports school students from low-income families.',link:'https://www.sbifoundation.in'},
{id:'vidya',t:'pvt',name:'Vidyasaarathi – Corporate Scholarship Portal',by:'NSDL e-Governance',levels:['pre','hs','ug','pg','tech'],amt:'Many CSR scholarships; amounts vary',desc:'One free portal where several companies list their scholarships for students.',link:'https://www.vidyasaarathi.co.in'},
{id:'b4s',t:'pvt',name:'Buddy4Study – Scholarship Finder',by:'Buddy4Study',levels:['pre','hs','ug','pg','tech'],amt:'Thousands of listings; amounts vary',desc:'India\'s largest free scholarship search portal. Create a profile and get matched automatically.',link:'https://www.buddy4study.com'}
];
const REQT={single:'Only for single girl child',minority:'Only for notified minority communities',disability:'Only for students with 40%+ disability',stem:'Only for science / technology / engineering students'};
function checkSch(s,p){const w=[];
 if(!s.levels.includes(p.level))w.push('Not for your education level');
 if(s.cats&&!s.cats.includes(p.cat))w.push('Meant for '+s.cats.join(' / ')+' category');
 if(s.inc!=null&&p.income>s.inc*100000)w.push('Family income above ₹'+s.inc+' lakh');
 if(s.marks&&p.marks<s.marks)w.push('Needs at least '+s.marks+'% marks');
 (s.req||[]).forEach(r=>{if(!p[r])w.push(REQT[r])});
 if(s.state&&s.state!==p.state)w.push('Only for '+s.state+' residents');
 return w}
function eligList(s){const l=[];l.push('Education level: '+s.levels.map(x=>LEVELS[x]).join(', '));
 if(s.cats)l.push('Category: '+s.cats.join(' / '));
 if(s.inc!=null)l.push('Annual family income up to ₹'+s.inc+' lakh');
 if(s.marks)l.push('Minimum '+s.marks+'% marks in the previous exam');
 (s.req||[]).forEach(r=>l.push(REQT[r].replace('Only for ','Applicant must be: ')));
 if(s.state)l.push('Resident of '+s.state);
 (s.extra||[]).forEach(x=>l.push(x));
 l.push('Indian citizen studying at a recognised school / college');return l}
function docList(s){const d=['Aadhaar card','Recent passport-size photograph','Previous class marksheet','Bank passbook of the student (Aadhaar-linked account)','Bonafide / admission proof or fee receipt from school / college','Mobile number and email ID'];
 if(s.inc!=null)d.push('Family income certificate');if(s.cats&&!s.cats.includes('General'))d.push('Caste certificate');
 if((s.req||[]).includes('minority'))d.push('Minority community declaration / certificate');
 if((s.req||[]).includes('disability'))d.push('Disability certificate (40% or above)');
 if((s.req||[]).includes('single'))d.push('Single girl child certificate / affidavit');
 if(s.state)d.push('Domicile / residence certificate');return d}
function stepList(s){return s.nsp?['Open scholarships.gov.in and choose "New Registration". Note down your One Time Registration (OTR) ID.','Log in with the OTR ID and complete your personal, academic and bank details.','Pick this scheme from the list of schemes you are eligible for.','Upload scanned documents (PDF / JPG within the size limit).','Submit the form, download the acknowledgement and keep a printout.','Get it verified by your institute, then track the status on the portal.']
 :['Open the official page with the button below and read the latest notification and last date.','Create an account with your email and mobile number.','Fill the form carefully (name must match your Aadhaar and bank account).','Upload the documents listed above in the required format.','Submit, save the application number / acknowledgement.','Track status regularly and respond if the organisation asks for more documents.']}

const scDefault=()=>{const u=me();return {type:null,done:false,p:{level:(u&&u.level)||'ug',marks:'',cat:'General',income:'',state:(u&&u.state)||'Other',single:false,minority:false,disability:false,stem:false}}};
let SC=scDefault();
function opt(list,sel){return list.map(x=>Array.isArray(x)?`<option value="${x[0]}" ${x[0]==sel?'selected':''}>${x[1]}</option>`:`<option ${x==sel?'selected':''}>${x}</option>`).join('')}
function schCard(s){const link=s.link;return `<article class="card sch">
<div class="sch-h"><div><span class="badge ok">✓ You may be eligible</span><h3>${s.name}</h3><p class="by">${s.by}</p></div><div class="amt">${s.amt}</div></div>
<p>${s.desc}</p>
<details open><summary>Eligibility criteria</summary><ul>${eligList(s).map(x=>`<li>${x}</li>`).join('')}</ul></details>
<details><summary>Documents required</summary><ul>${docList(s).map(x=>`<li>${x}</li>`).join('')}</ul></details>
<details><summary>How to apply, step by step</summary><ol>${stepList(s).map(x=>`<li>${x}</li>`).join('')}</ol></details>
<div class="actions"><a class="btn" href="${link}" target="_blank" rel="noopener">Apply on official website ↗</a><a class="btn ghost" href="${G(s.name+' last date apply')}" target="_blank" rel="noopener">Check latest notification</a></div>
<div class="yt"><div class="play">▶</div><div class="t"><b>Reference video: how to fill the form</b><small>Step-by-step videos and the documents you need</small></div><a class="btn sm plum" href="${Y('How to apply '+s.name+' form fill step by step documents required')}" target="_blank" rel="noopener">Watch on YouTube</a></div>
</article>`}
function pageSch(){
 if(!SC.type)return `<div class="page-h"><h1>🎓 Scholarships for girls</h1><p>Tell us a little about yourself and Bloom will show only the scholarships you can apply for, with documents, steps and a direct apply link. First, choose a type.</p></div>
 <div class="choose"><button class="choice" onclick="pickSch('gov')"><span class="ico" style="background:rgba(120,160,255,.2)">🏛️</span><h3>Government scholarships</h3><p>Central and state schemes such as NSP, AICTE Pragati, CBSE, MahaDBT and more.</p></button>
 <button class="choice" onclick="pickSch('pvt')"><span class="ico" style="background:rgba(240,189,90,.2)">🏢</span><h3>Private scholarships</h3><p>Company and foundation scholarships such as Reliance, HDFC, Tata, Kotak and Google.</p></button></div>`;
 const p=SC.p,gov=SC.type==='gov';
 let h=`<div class="page-h"><h1>${gov?'🏛️ Government':'🏢 Private'} scholarships</h1><p>Step 1: fill your details. Step 2: see scholarships you can apply for. Step 3: check criteria, apply and watch the video guide.</p></div>
 <div class="tabs"><button class="chip" onclick="pickSch(null)">← Change type</button><button class="chip" onclick="pickSch('${gov?'pvt':'gov'}')">Switch to ${gov?'private':'government'}</button></div>
 <div class="card"><h3 style="margin-bottom:16px">Your details</h3><div class="form">
 <label class="f">Basic qualification (current / completed)<select id="sLevel">${opt(Object.entries(LEVELS),p.level)}</select></label>
 <label class="f">Marks in last exam (%)<input id="sMarks" type="number" min="0" max="100" placeholder="e.g. 78" value="${p.marks}"></label>
 <label class="f">Category / caste<select id="sCat">${opt(['General','EWS','OBC','SC','ST'],p.cat)}</select></label>
 <label class="f">Annual family income (₹)<input id="sInc" type="number" min="0" placeholder="e.g. 240000" value="${p.income}"></label>
 <label class="f">State<select id="sState">${opt(['Maharashtra','Tamil Nadu','West Bengal','Other'],p.state)}</select></label></div>
 <div class="checks">
 <label><input type="checkbox" id="sSingle" ${p.single?'checked':''}> Single girl child</label>
 <label><input type="checkbox" id="sMin" ${p.minority?'checked':''}> Minority community</label>
 <label><input type="checkbox" id="sDis" ${p.disability?'checked':''}> Person with disability (40%+)</label>
 <label><input type="checkbox" id="sStem" ${p.stem?'checked':''}> Studying science / tech / engineering</label></div>
 <button class="btn" onclick="findSch()">Find my scholarships</button></div><div id="res">`;
 if(SC.done){const list=SCH.filter(s=>s.t===SC.type),ok=[],no=[];
  list.forEach(s=>{const w=checkSch(s,p);(w.length?no:ok).push([s,w])});
  h+=`<h2 class="sec">${ok.length?`You can apply for ${ok.length} scholarship${ok.length>1?'s':''}`:'No exact match found'}</h2>`;
  if(!ok.length)h+=`<div class="note">No ${gov?'government':'private'} scholarship matched your details right now. Try the other type, check your income or marks entry, or use the free portals <a href="https://www.buddy4study.com" target="_blank" rel="noopener">Buddy4Study</a> and <a href="${NSP}" target="_blank" rel="noopener">National Scholarship Portal</a>.</div>`;
  h+=ok.map(x=>schCard(x[0])).join('');
  if(no.length)h+=`<details class="card" style="margin-top:20px"><summary>Not matched for you (${no.length}) – see why</summary><ul>${no.map(x=>`<li><b>${x[0].name}</b> – ${x[1].join('; ')}</li>`).join('')}</ul></details>`;
  h+=`<div class="note">💡 Eligibility here is a guide based on common rules. Final rules, amounts and last dates are decided by the scholarship provider and change every year.</div>`}
 return h+'</div>'}
function pickSch(t){SC.type=t;SC.done=false;rerender('scholarships');window.scrollTo(0,0)}
function findSch(){const p=SC.p;p.level=$('#sLevel').value;p.marks=+$('#sMarks').value||0;p.cat=$('#sCat').value;p.income=$('#sInc').value===''?0:+$('#sInc').value;p.state=$('#sState').value;
 p.single=$('#sSingle').checked;p.minority=$('#sMin').checked;p.disability=$('#sDis').checked;p.stem=$('#sStem').checked;
 if($('#sInc').value===''){toast('Please enter your annual family income');return}
 SC.done=true;S.set('schSearch',S.get('schSearch',0)+1);
 S.set('schMatched',SCH.filter(s=>checkSch(s,p).length===0).length);
 rerender('scholarships');$('#res').scrollIntoView({behavior:'smooth'})}

/* ---------- DATA: exams ---------- */
const EX=[
{id:'upsc',g:1,after:'grad',name:'UPSC Civil Services (IAS / IPS / IFS)',by:'Union Public Service Commission',who:'Any graduate. General category age about 21 – 32 (relaxation for OBC / SC / ST).',info:'3 stages: Prelims (objective) → Mains (written) → Interview.',posts:'IAS, IPS, IFS, IRS and other central services',cheap:['Read NCERT books of Class 6 – 12 (free PDFs or library copies)','Read one newspaper at a public library and PIB summaries instead of paid magazines','Solve the last 10 years\' prelims papers rather than buying costly test series','Form a free peer group for answer-writing practice'],free:[['NCERT textbooks','https://ncert.nic.in/textbook.php'],['PIB – official news','https://pib.gov.in'],['Free UPSC strategy videos',Y('UPSC free preparation strategy beginners')]],ben:['Officer rank with real power to create change','Starting basic pay of about ₹56,100 (Level 10) plus allowances, housing and security','Lifetime job security, pension and national-level career growth'],off:'https://upsc.gov.in'},
{id:'mpsc',g:1,after:'grad',name:'State PSC (e.g. MPSC – Maharashtra)',by:'State Public Service Commissions',who:'Graduate; age and attempts as per the state rules.',info:'Prelims → Mains → Interview. Includes state-specific topics and the state language.',posts:'Deputy Collector, DySP, Tehsildar, Sales Tax Inspector and more',cheap:['Use the state board textbooks (free) for history, geography and polity','Practise previous MPSC papers from the official site','Join free government library study rooms'],free:[['MPSC official previous papers','https://mpsc.gov.in'],['Free MPSC videos',Y('MPSC free preparation strategy')],['PIB','https://pib.gov.in']],ben:['Serve in your own state and community','Many states offer reservation for women in state services (for example, Maharashtra) – check the latest rule','Stable government career with good growth'],off:'https://mpsc.gov.in'},
{id:'ssc',g:1,after:'grad',name:'SSC CGL (Combined Graduate Level)',by:'Staff Selection Commission',who:'Graduate in any stream; age mostly 18 – 32 depending on post.',info:'Tier 1 and Tier 2 computer-based tests: Maths, Reasoning, English, General Awareness.',posts:'Income Tax Inspector, Auditor, Assistant Section Officer, CBI / CBIC Inspector',cheap:['Free YouTube maths and reasoning playlists','Free online mock tests and previous papers','Revise NCERT Maths of Class 6 – 10 for the basics'],free:[['SSC official site','https://ssc.gov.in'],['Free SSC CGL full course',Y('SSC CGL free full course')],['Free mock tests','https://testbook.com']],ben:['Central government Group B / C jobs with fixed hours','Pay as per the Pay Commission with allowances','Job security, promotions and retirement benefits'],off:'https://ssc.gov.in'},
{id:'bank',g:1,after:'grad',name:'Bank exams – IBPS PO / Clerk, SBI PO / Clerk',by:'IBPS and State Bank of India',who:'Graduate; age about 20 – 30 for PO and 20 – 28 for Clerk.',info:'Prelims → Mains → Interview (PO). English, Quant, Reasoning, Banking awareness.',posts:'Probationary Officer, Clerk, Specialist Officer',cheap:['Free bank-exam classes on YouTube','Previous year papers and free mock tests','Read business news free on PIB and newspaper sites'],free:[['IBPS official','https://www.ibps.in'],['SBI Careers','https://sbi.co.in/web/careers'],['Free bank exam classes',Y('IBPS PO free preparation course')]],ben:['Stable job with good salary and perks','Growth up to branch manager and beyond','Strong money and finance knowledge for life'],off:'https://www.ibps.in'},
{id:'rrb',g:1,after:'both',name:'Railway exams – RRB NTPC / Group D / ALP',by:'Railway Recruitment Boards',who:'Class 10, Class 12 or graduate depending on the post.',info:'CBT 1 → CBT 2 → typing / skill test or document verification depending on the post.',posts:'Station Master, Clerk, Goods Guard, Group D, Assistant Loco Pilot',cheap:['Free RRB previous papers and YouTube classes','Practise basic maths and general science daily','Free mock tests on exam apps'],free:[['RRB portal','https://www.rrbcdg.gov.in'],['Free RRB classes',Y('RRB NTPC free full course')],['NCERT books','https://ncert.nic.in/textbook.php']],ben:['Indian Railways job with free travel passes and quarters','Fixed duty hours and medical benefits','Opportunities in every state'],off:'https://www.rrbcdg.gov.in'},
{id:'nda',g:1,after:'12',name:'NDA (National Defence Academy)',by:'UPSC',who:'Unmarried women and men after Class 12 (Maths + Physics for Air Force and Navy); age about 16½ – 19½.',info:'Written exam (Maths + General Ability) → 5-day SSB interview → medical.',posts:'Officer in Army, Navy or Air Force',cheap:['NCERT Class 11 – 12 Maths and Science','Free SSB preparation videos','Daily running and exercise – costs nothing'],free:[['UPSC NDA details','https://upsc.gov.in'],['Free NDA preparation for girls',Y('NDA exam free preparation for girls')],['NCERT books','https://ncert.nic.in/textbook.php']],ben:['Become a commissioned officer in the armed forces','Free training and a graduation degree','Respect, adventure and strong salary and benefits'],off:'https://upsc.gov.in'},
{id:'cds',g:1,after:'grad',name:'CDS & AFCAT (officer entry for graduates)',by:'UPSC / Indian Air Force',who:'Graduates; limits differ by academy and branch.',info:'CDS: written test + SSB interview. AFCAT: online test + AFSB interview.',posts:'Officer in Army, Navy and Air Force',cheap:['Free YouTube coaching and previous papers','Basic English and Maths practice','Free fitness routine at home'],free:[['UPSC','https://upsc.gov.in'],['Free CDS / AFCAT classes',Y('CDS AFCAT free preparation')],['SSB tips',Y('SSB interview free preparation girls')]],ben:['Officer career with leadership training','Excellent pay, housing and medical facilities','Lifelong respect and discipline'],off:'https://upsc.gov.in'},
{id:'ctet',g:1,after:'both',name:'CTET / TET (teacher eligibility)',by:'CBSE and State governments',who:'After Class 12 + D.El.Ed (Paper 1) or graduate + B.Ed (Paper 2).',info:'Paper 1: Classes 1 – 5. Paper 2: Classes 6 – 8. Child development, languages, maths, EVS / science.',posts:'Government and private school teacher',cheap:['NCERT books of Classes 1 – 8','Previous year papers from the official site','Free pedagogy playlists on YouTube'],free:[['CTET official','https://ctet.nic.in'],['Free CTET course',Y('CTET free preparation course')],['NCERT','https://ncert.nic.in/textbook.php']],ben:['Respected career with fixed hours and holidays','Eligible for teacher posts in many schools','CTET certificate is valid for life'],off:'https://ctet.nic.in'},
{id:'neet',g:1,after:'12',name:'NEET UG (medical entrance)',by:'National Testing Agency',who:'Class 12 with Physics, Chemistry, Biology.',info:'One paper with questions from Physics, Chemistry and Biology; 720 marks.',posts:'MBBS, BDS, BAMS, BHMS, Nursing, Veterinary',cheap:['NCERT Biology line-by-line is the base','Free YouTube channels with full courses','Solve past papers and free test series'],free:[['NTA','https://nta.ac.in'],['Free NEET course',Y('NEET free full course')],['NCERT','https://ncert.nic.in/textbook.php']],ben:['Become a doctor – a respected, in-demand profession','Government college seats with very low fees','Wide career: hospital, research, public health, own clinic'],off:'https://nta.ac.in'},
{id:'jee',g:1,after:'12',name:'JEE Main / Advanced (engineering)',by:'NTA and IITs',who:'Class 12 with Physics, Chemistry, Maths.',info:'JEE Main for NITs / IIITs, JEE Advanced for IITs. Girls have extra (supernumerary) seats in IITs and NITs.',posts:'B.Tech at IITs, NITs, IIITs',cheap:['NCERT + free video lectures','Previous papers from NTA site','Free test series and doubt groups'],free:[['NTA JEE','https://nta.ac.in'],['NPTEL','https://nptel.ac.in/courses'],['Free JEE course',Y('JEE free full course')]],ben:['Top engineering colleges with strong placements','Dedicated seats for girls to improve representation','High-paying tech and research careers'],off:'https://nta.ac.in'},
{id:'cuet',g:1,after:'12',name:'CUET UG (central university admission)',by:'National Testing Agency',who:'Class 12 pass or appearing.',info:'Language + domain subjects + general test; computer-based.',posts:'Admission to Delhi University, BHU, JNU and many central universities',cheap:['NCERT of your chosen subjects','Free sample papers on NTA site','YouTube revision playlists'],free:[['NTA','https://nta.ac.in'],['Free CUET course',Y('CUET UG free preparation')],['NCERT','https://ncert.nic.in/textbook.php']],ben:['Low-fee, high-quality central university degrees','One exam for many universities','Hostel and scholarship options'],off:'https://nta.ac.in'},
{id:'gate',g:1,after:'grad',name:'GATE (engineering post-graduate)',by:'IITs / IISc',who:'Final-year or graduate in engineering / science.',info:'Computer-based test in your chosen branch; score valid for 3 years.',posts:'M.Tech at IITs / NITs and many PSU jobs',cheap:['Free NPTEL lectures for each subject','Previous GATE papers','Free test series from YouTube channels'],free:[['NPTEL courses','https://nptel.ac.in/courses'],['Official GATE website',G('GATE exam official website')],['Free GATE classes',Y('GATE free preparation')]],ben:['M.Tech admission with monthly scholarship','Jobs in PSUs like ONGC, BHEL, NTPC through GATE score','Research and teaching careers'],off:G('GATE exam official website')},
{id:'cat',g:0,after:'grad',name:'CAT (MBA entrance)',by:'Indian Institutes of Management',who:'Graduate with 50% marks (45% for SC / ST / PwD).',info:'Computer-based test: Verbal Ability, Data Interpretation & Logical Reasoning, Quantitative Ability. Then GD / interview.',posts:'MBA at IIMs and top B-schools → management careers',cheap:['Free official mock CAT','YouTube lessons for quant and verbal','Daily reading habit for verbal ability'],free:[['Official CAT site','https://iimcat.ac.in'],['Free CAT course',Y('CAT free preparation course')],['Free reading: PIB & newspapers','https://pib.gov.in']],ben:['High-paying management and consulting jobs','Strong network and leadership skills','Base to start your own business'],off:'https://iimcat.ac.in'},
{id:'clat',g:0,after:'12',name:'CLAT (law entrance)',by:'Consortium of National Law Universities',who:'Class 12 pass (45% marks; 40% SC / ST).',info:'English, current affairs, legal reasoning, logical reasoning and maths.',posts:'5-year integrated law degree at NLUs',cheap:['Read a newspaper daily and make notes','Free previous papers on the consortium site','Free YouTube legal-reasoning lessons'],free:[['Consortium of NLUs','https://consortiumofnlus.ac.in'],['Free CLAT classes',Y('CLAT free preparation')],['Free current affairs','https://pib.gov.in']],ben:['Careers as lawyer, judge, legal advisor','Fights for rights of women and others','Corporate and government legal jobs'],off:'https://consortiumofnlus.ac.in'},
{id:'ca',g:0,after:'12',name:'CA (Chartered Accountant)',by:'ICAI',who:'Register after Class 12 (Foundation) or after graduation (Intermediate).',info:'Foundation → Intermediate → Final plus practical training (articleship).',posts:'Chartered Accountant – audit, tax, finance',cheap:['ICAI study material and free mock tests on icai.org','YouTube faculty lectures','Self-study with past papers'],free:[['ICAI','https://www.icai.org'],['Free CA lectures',Y('CA foundation free lectures')],['Zerodha Varsity','https://zerodha.com/varsity']],ben:['One of the most respected finance careers','High earning potential, own practice possible','Jobs in every industry'],off:'https://www.icai.org'},
{id:'cs',g:0,after:'12',name:'CS (Company Secretary)',by:'ICSI',who:'After Class 12 (Foundation) or graduation.',info:'Foundation → Executive → Professional with training.',posts:'Company Secretary, compliance officer',cheap:['ICSI free e-resources','YouTube lectures','Previous question papers'],free:[['ICSI','https://www.icsi.edu'],['Free CS classes',Y('CS foundation free classes')],['Company law basics',Y('company law basics free')]],ben:['Corporate law and governance career','Lower cost than many professional courses','Stable demand in companies'],off:'https://www.icsi.edu'},
{id:'tcs',g:0,after:'grad',name:'TCS NQT & company hiring tests',by:'TCS and other companies',who:'Final-year students or graduates (BE / B.Tech / BSc / BCA / MCA etc.).',info:'Aptitude, reasoning, English and coding, followed by interviews. Scores are accepted by many companies.',posts:'IT and business roles in private companies',cheap:['Free aptitude on YouTube','freeCodeCamp for coding basics','Free mock tests on the TCS iON portal'],free:[['TCS NQT',G('TCS NQT official registration')],['freeCodeCamp','https://www.freecodecamp.org'],['Free aptitude classes',Y('aptitude for placements free')]],ben:['Private-sector job offer right after graduation','Learning and growth with training','Opportunities to work abroad'],off:G('TCS NQT official registration')},
{id:'abroad',g:0,after:'grad',name:'GRE / IELTS / TOEFL (study abroad)',by:'ETS / IDP / British Council',who:'Graduates planning masters abroad.',info:'GRE: verbal, quant, writing. IELTS / TOEFL: English skills.',posts:'Masters and PhD abroad with scholarships',cheap:['Free official practice material','British Council free English lessons','YouTube prep playlists'],free:[['ETS GRE','https://www.ets.org/gre'],['IELTS','https://ielts.org'],['LearnEnglish – British Council','https://learnenglish.britishcouncil.org']],ben:['Study at top global universities','International career and research','Scholarships such as Chevening and Fulbright'],off:'https://ielts.org'}];
let EXS={tab:1,f:'all'};
function examCard(e){const sv=S.get('examSaved',[]).includes(e.id);return `<article class="card exam" id="ex-${e.id}">
<div class="eh"><div><h3>${e.name}</h3><p class="by">Conducted by ${e.by}</p></div><button class="star" onclick="saveExam('${e.id}')" aria-label="${sv?'Remove from saved':'Save exam'}" title="Save to dashboard">${sv?'★':'☆'}</button></div>
<div class="kv"><div><b>Who can apply</b><span>${e.who}</span></div><div><b>Exam pattern</b><span>${e.info}</span></div><div><b>Jobs / courses</b><span>${e.posts}</span></div></div>
<h4>Cheapest way to prepare</h4><ul>${e.cheap.map(x=>`<li>${x}</li>`).join('')}</ul>
<h4>Free sources you can use</h4><div class="links">${e.free.map(f=>`<a href="${f[1]}" target="_blank" rel="noopener">${f[0]} ↗</a>`).join('')}</div>
<h4>Benefits after clearing</h4><ul>${e.ben.map(x=>`<li>${x}</li>`).join('')}</ul>
<a class="btn sm" href="${e.off}" target="_blank" rel="noopener">Official website ↗</a></article>`}
function pageExams(){const list=EX.filter(e=>e.g===EXS.tab&&(EXS.f==='all'||e.after===EXS.f||e.after==='both'));
 return `<div class="page-h"><h1>📝 Which exam should I give?</h1><p>Pick government or non-government, then see the basics, the cheapest way to prepare, free resources and what you gain after clearing.</p></div>
 <div class="choose" style="margin-bottom:22px"><button class="choice" onclick="exTab(1)" style="${EXS.tab?'border-color:var(--rose)':''}"><span class="ico" style="background:rgba(120,160,255,.2)">🏛️</span><h3>Government exams</h3><p>Civil services, SSC, banking, railways, defence, teaching and entrance exams.</p></button>
 <button class="choice" onclick="exTab(0)" style="${EXS.tab?'':'border-color:var(--rose)'}"><span class="ico" style="background:rgba(240,189,90,.2)">💼</span><h3>Non-government exams</h3><p>MBA, law, CA / CS, company hiring tests and study-abroad exams.</p></button></div>
 <div class="tabs"><button class="chip ${EXS.f==='all'?'on':''}" onclick="exF('all')">All</button><button class="chip ${EXS.f==='12'?'on':''}" onclick="exF('12')">After Class 12</button><button class="chip ${EXS.f==='grad'?'on':''}" onclick="exF('grad')">After graduation</button></div>
 <div class="card" style="margin-bottom:22px"><h4 style="margin-top:0">All ${EXS.tab?'government':'non-government'} exams in this list (tap to jump)</h4><div class="links">${list.map(e=>`<a href="javascript:void(0)" onclick="document.getElementById('ex-${e.id}').scrollIntoView({behavior:'smooth'})">${e.name.split('(')[0].trim()}</a>`).join('')}</div></div>
 ${list.map(examCard).join('')||'<div class="note">No exam in this filter. Try "All".</div>'}
 <div class="note">💡 Dates, age limits and vacancies change every year. Always confirm on the official website. Tap ☆ to save an exam to your Dashboard.</div>`}
function exTab(t){EXS.tab=t;rerender('exams')}function exF(f){EXS.f=f;rerender('exams')}
function saveExam(id){let a=S.get('examSaved',[]);a=a.includes(id)?a.filter(x=>x!==id):[...a,id];S.set('examSaved',a);rerender('exams');toast(a.includes(id)?'Saved to Dashboard':'Removed')}

/* ---------- DATA: skills ---------- */
const CORE=[['Digital literacy & safe internet use','https://www.skillindiadigital.gov.in'],['MS Office / Google Docs & Sheets','https://spoken-tutorial.org'],['Basic coding & logical thinking','https://www.freecodecamp.org'],['Clear English communication','https://learnenglish.britishcouncil.org'],['Money & financial literacy','https://zerodha.com/varsity'],['Resume & interview skills',Y('resume and interview skills for freshers')],['Self-defence basics',Y('basic self defence for girls')],['First-aid basics',Y('basic first aid course free')],['Time management & goal setting',Y('time management for students')],['Public speaking & confidence',Y('public speaking for beginners')]];
const SK=[
['Digital & technology',[['NPTEL','IITs & IISc','Free videos; certificate exam has a small fee','https://nptel.ac.in/courses','Python, data science, soft skills and entrepreneurship courses by IIT professors.'],['SWAYAM','Government of India','Free; optional proctored exam','https://swayam.gov.in','University-credit courses from school level to postgraduate.'],['Coursera','Top universities','Free to audit; financial aid for certificates','https://www.coursera.org','Apply for Financial Aid to earn certificates at no cost.'],['Udemy','Instructors worldwide','Free and paid; frequent sales','https://www.udemy.com','Search "free" courses on Excel, Python, design, spoken English and more.'],['Google Career Certificates','Google','Paid, financial aid available','https://grow.google/certificates','Data Analytics, UX Design, IT Support and Project Management.'],['freeCodeCamp','freeCodeCamp','Free certificates','https://www.freecodecamp.org','Web development, Python and data analysis with projects.'],['CS50','Harvard University','Free; paid certificate optional','https://cs50.harvard.edu/x','The world-famous introduction to computer science.'],['Microsoft Learn','Microsoft','Free with badges','https://learn.microsoft.com/training','Excel, Power BI, Azure and AI fundamentals.'],['Cisco Skills for All','Cisco','Free','https://www.skillsforall.com','Cybersecurity, networking and Python basics.'],['Infosys Springboard','Infosys','Free with certificates','https://infyspringboard.onwingspan.com','Technology, soft skills and career readiness.']]],
['Career & communication',[['Skill India Digital','Government of India','Free','https://www.skillindiadigital.gov.in','Government skill courses and job links.'],['Spoken Tutorial','IIT Bombay','Free with certificate','https://spoken-tutorial.org','LibreOffice, Python, Scratch and more in your own language.'],['HP LIFE','HP Foundation','Free certificates','https://www.life-global.org','Business, IT and communication skills.'],['LearnEnglish','British Council','Free','https://learnenglish.britishcouncil.org','Grammar, speaking and listening practice.']]],
['Money & business',[['Zerodha Varsity','Zerodha','Free','https://zerodha.com/varsity','Simple lessons on markets, investing and personal finance.'],['Google Digital Garage','Google','Free certificates','https://learndigital.withgoogle.com/digitalgarage','Fundamentals of digital marketing – ideal to start freelancing.'],['Startup India Learning','Government of India','Free','https://www.startupindia.gov.in','Learn how to start and run your own business.']]]];
function skillCard(c){return `<div class="card"><span class="badge gold">${c[2]}</span><h3 style="font-size:20px;margin:10px 0 2px">${c[0]}</h3><p class="by">${c[1]}</p><p>${c[4]}</p><a class="btn sm" href="${c[3]}" target="_blank" rel="noopener">Start learning ↗</a></div>`}
function pageSkills(){const done=S.get('skills',[]);
 return `<div class="page-h"><h1>💡 Basic skills every girl should learn</h1><p>Certificates make your resume stronger. Start with free courses from NPTEL, Coursera, Udemy and more, and tick off the core skills as you learn them.</p></div>
 <div class="card"><div class="sec-row"><h3>My core skills checklist</h3><span class="badge ok">${done.length} / ${CORE.length} done</span></div>
 ${CORE.map((c,i)=>`<label class="check-row"><input type="checkbox" ${done.includes(i)?'checked':''} onchange="tickSkill(${i})"><span><b>${c[0]}</b><br><a href="${c[1]}" target="_blank" rel="noopener" style="color:var(--rose)">Learn it here ↗</a></span></label>`).join('')}</div>
 ${SK.map(g=>`<h2 class="sec">${g[0]}</h2><div class="grid2">${g[1].map(skillCard).join('')}</div>`).join('')}
 <div class="note">💡 Tip: employers value certificates plus a small project. Finish one course fully before starting another.</div>`}
function tickSkill(i){let a=S.get('skills',[]);a=a.includes(i)?a.filter(x=>x!==i):[...a,i];S.set('skills',a);rerender('skills')}

/* ---------- SAFETY ---------- */
const PLAN=['I saved 112, 1091 and 181 in my phone favourites','I added at least 2 trusted people in Bloom Contacts','I know a safe public place near my home, school / college and workplace','I have a safe word that I share with one trusted person','I share my live location when I travel late','My phone is charged and I carry a power bank and a little cash','I have read my rights in Bloom','I backed up my Aadhaar and certificates in DigiLocker'];
const RIGHTS=[
['At work',['The POSH Act 2013 protects you from sexual harassment. Workplaces with 10 or more employees must have an Internal Committee.','You can file a complaint within 3 months of the incident (extendable by another 3 months).','Equal pay for equal work, and no discrimination in hiring or promotion because you are a woman.','Maternity Benefit Act: 26 weeks of paid maternity leave for the first two children.']],
['At home',['The Protection of Women from Domestic Violence Act 2005 covers physical, emotional, sexual and economic abuse.','You can seek protection orders, a right to stay in the shared home, and monetary relief. Call 181 or contact a Protection Officer.','Giving or taking dowry is illegal under the Dowry Prohibition Act.','Daughters have equal rights in ancestral property (Hindu Succession Amendment Act 2005).']],
['With the police',['You can file a Zero FIR at any police station, whatever the location of the crime.','A woman generally cannot be arrested between sunset and sunrise without a magistrate\'s permission, and a woman officer must be present.','Women should not be called to the police station for questioning; the police can question you at your home.','You have the right to free legal aid. Call the NALSA helpline 15100.']],
['Online',['Report cyber harassment or fraud at cybercrime.gov.in or call 1930.','Take screenshots, save links and do not delete evidence before reporting.','If someone shares private images without consent, use StopNCII.org to help block them from spreading.','Never share OTPs, and keep social profiles private.']]];
function pageSafety(){const plan=S.get('plan',[]);
 return `<div class="page-h"><h1>🛡️ Safety & SOS</h1><p>Quick help when you feel unsafe, a safety plan you can build today, and a simple guide to your rights.</p></div>
 <div class="card" style="text-align:center"><h3>Feeling unsafe right now?</h3><p class="by">Press the button for step-by-step guidance and one-tap calling.</p><button class="sos" onclick="showSOS()" aria-label="Open SOS guidance">SOS</button>
 <div class="actions" style="justify-content:center"><a class="btn" href="tel:112">Call 112</a><a class="btn ghost" href="tel:1091">Women in distress 1091</a><button class="btn ghost" onclick="fakeCall()">Fake incoming call</button></div></div>
 <h2 class="sec">My personal safety plan</h2><div class="card"><div class="bar" style="margin-bottom:8px"><i style="width:${plan.length/PLAN.length*100}%;background:var(--rose)"></i></div><p class="by">${plan.length} of ${PLAN.length} steps done</p>
 ${PLAN.map((x,i)=>`<label class="check-row"><input type="checkbox" ${plan.includes(i)?'checked':''} onchange="tickPlan(${i})"><span>${x}</span></label>`).join('')}
 <h4>My private note (only on this device)</h4><textarea id="planNote" rows="3" placeholder="Safe places I can go, people I can call…" oninput="S.set('planNote',this.value)">${esc(S.get('planNote',''))}</textarea></div>
 <h2 class="sec">Know your rights</h2><div class="card">${RIGHTS.map(r=>`<details><summary>${r[0]}</summary><ul>${r[1].map(x=>`<li>${x}</li>`).join('')}</ul></details>`).join('')}</div>
 <h2 class="sec">Everyday safety habits</h2><div class="grid3">
 <div class="card"><h4 style="margin-top:0">Travelling</h4><ul><li>Share trip details of cabs and autos</li><li>Sit near the driver or in a lit area at night</li><li>Trust your instincts and move away</li></ul></div>
 <div class="card"><h4 style="margin-top:0">Online</h4><ul><li>Do not accept unknown requests</li><li>Turn off location tags on photos</li><li>Use strong passwords and 2-step login</li></ul></div>
 <div class="card"><h4 style="margin-top:0">In public</h4><ul><li>Keep your phone and keys ready</li><li>Make noise to attract attention</li><li>Go to shops or crowded places</li></ul></div></div>`}
function tickPlan(i){let a=S.get('plan',[]);a=a.includes(i)?a.filter(x=>x!==i):[...a,i];S.set('plan',a);rerender('safety')}
function showSOS(){openModal(`<h2>Stay calm. You are not alone.</h2><ol style="margin:14px 0">
<li>Move to a safe, well-lit, public place – a shop, petrol pump or police booth.</li><li>Call <b>112</b> (all emergencies) or <b>1091</b> (women in distress).</li><li>Send your live location to a trusted person.</li><li>Make noise to draw attention. Shouting "Fire!" often brings more help than "Help".</li><li>Note the vehicle number, place and time if you can.</li><li>Later: you can file a Zero FIR at any police station and get free legal help on 15100.</li></ol>
<div class="actions"><a class="btn" href="tel:112">Call 112</a><a class="btn ghost" href="tel:1091">Call 1091</a><a class="btn ghost" href="tel:181">Call 181</a></div>
<div class="actions"><button class="btn plum" onclick="shareLoc()">Share my location</button><button class="btn ghost" onclick="closeModal();fakeCall()">Fake call</button></div><div id="locOut"></div><button class="link-btn" onclick="closeModal()">Close</button>`)}
function shareLoc(btnOnly){const out=$('#locOut');out.innerHTML='<p class="by">Getting your location…</p>';
 if(!navigator.geolocation){out.innerHTML='<p>Location is not available in this browser.</p>';return}
 navigator.geolocation.getCurrentPosition(p=>{const u=`https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`,m=`I need help. My current location: ${u}`;
 out.innerHTML=`<div class="note">${esc(m)}</div><div class="actions"><a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(m)}">Send on WhatsApp</a><a class="btn sm ghost" href="sms:?body=${encodeURIComponent(m)}">Send by SMS</a><button class="btn sm ghost" onclick="navigator.clipboard&&navigator.clipboard.writeText(${JSON.stringify(m).replace(/"/g,'&quot;')});toast('Copied')">Copy</button></div>`},
 ()=>{out.innerHTML='<div class="note">Location permission was blocked. Allow location in your browser settings, or call 112 right away.</div>'},{timeout:10000})}
let ringT=null;function stopRing(){clearInterval(ringT)}
function fakeCall(){openModal(`<div style="text-align:center;padding:20px 0"><div class="avatar" style="--h:300">M</div><h2>Mom</h2><p class="by" id="fcState">Incoming call…</p><div class="actions" style="justify-content:center"><button class="btn plum" onclick="answerFake()">Answer</button><button class="btn" style="background:#e5484d" onclick="closeModal()">Decline</button></div></div>`)}
function answerFake(){let s=0;const el=$('#fcState');el.textContent='00:00';ringT=setInterval(()=>{s++;el.textContent='0'+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')},1000)}

/* ---------- FINANCE ---------- */
const FS=[['Sukanya Samriddhi Yojana','Government savings account for a girl child with attractive interest and tax benefits.','https://www.indiapost.gov.in'],['PM Jan Dhan Yojana','Zero-balance bank account with RuPay card and accident insurance.','https://pmjdy.gov.in'],['Atal Pension Yojana','Get a fixed monthly pension after 60 by saving a small amount every month.','https://www.jansuraksha.gov.in'],['PPF (Public Provident Fund)','Long-term, safe, tax-friendly savings option.','https://www.indiapost.gov.in'],['Mudra Yojana','Collateral-free loans for small businesses.','https://www.mudra.org.in'],['Stand-Up India','Loans for women and SC/ST entrepreneurs to start a new enterprise.','https://www.standupmitra.in'],['Lakhpati Didi / DAY-NRLM','Self-help group support to help rural women earn a sustainable income.','https://nrlm.gov.in'],['Vidya Lakshmi Education Loan','One portal to apply for education loans from many banks.','https://www.vidyalakshmi.co.in']];
function pageFinance(){const inc=S.get('income',20000);
 return `<div class="page-h"><h1>🪙 Finance for young women</h1><p>Plan your money, see how small savings grow, and discover schemes designed for women.</p></div>
 <div class="grid2"><div class="card"><h3>SIP calculator</h3><p class="by">See how a monthly investment can grow.</p><div class="form" style="margin:14px 0"><label class="f">Monthly amount (₹)<input id="sipP" type="number" value="2000" oninput="calcSip()"></label><label class="f">Expected return (% a year)<input id="sipR" type="number" value="12" oninput="calcSip()"></label><label class="f">Years<input id="sipY" type="number" value="10" oninput="calcSip()"></label></div><div id="sipOut"></div></div>
 <div class="card"><h3>50 / 30 / 20 budget planner</h3><p class="by">50% needs, 30% wants, 20% savings.</p><label class="f" style="margin:14px 0">Monthly income or pocket money (₹)<input id="bInc" type="number" value="${inc}" oninput="calcBudget()"></label><div id="budOut"></div></div></div>
 <div class="note">SIP returns are not guaranteed. Mutual funds are subject to market risk. This is for learning only, not financial advice.</div>
 <h2 class="sec">Savings, loan and business schemes for women</h2><div class="grid3">${FS.map(f=>`<div class="card"><h3 style="font-size:19px">${f[0]}</h3><p>${f[1]}</p><a class="btn sm ghost" href="${f[2]}" target="_blank" rel="noopener">Official site ↗</a></div>`).join('')}</div>
 <div class="note">Interest rates and rules change. Confirm the latest details with a bank or post office.</div>`}
function calcSip(){const P=+$('#sipP').value||0,r=(+$('#sipR').value||0)/1200,n=(+$('#sipY').value||0)*12,fv=r?P*((Math.pow(1+r,n)-1)/r)*(1+r):P*n,inv=P*n,ret=fv-inv;
 $('#sipOut').innerHTML=`<div class="bar"><i style="width:${fv?inv/fv*100:0}%;background:var(--plum2)"></i><i style="width:${fv?ret/fv*100:0}%;background:var(--rose2)"></i></div><div class="stat"><span>Amount invested</span><b>${inr(inv)}</b></div><div class="stat"><span>Estimated returns</span><b>${inr(ret)}</b></div><div class="stat"><span>Total value</span><span class="big">${inr(fv)}</span></div>`}
function calcBudget(){const v=+$('#bInc').value||0;S.set('income',v);const rows=[['Needs (food, travel, fees)',.5,'var(--plum2)'],['Wants (fun, shopping)',.3,'var(--gold)'],['Savings & goals',.2,'var(--rose2)']];
 $('#budOut').innerHTML=`<div class="bar" style="margin-bottom:8px">${rows.map(r=>`<i style="width:${r[1]*100}%;background:${r[2]}"></i>`).join('')}</div>`+rows.map(r=>`<div class="stat"><span>${r[0]}</span><b>${inr(v*r[1])}</b></div>`).join('')}

/* ---------- WELLNESS ---------- */
const MOODS=['😞','😕','😐','🙂','😄'];let BR={t:null,run:false,c:0},MD=3,GR=0;
const GRD=[[5,'things you can SEE','Look around and name five things.'],[4,'things you can TOUCH','Feel your clothes, a table, your hair.'],[3,'things you can HEAR','Listen closely, near and far.'],[2,'things you can SMELL','Find two scents, or remember two you love.'],[1,'thing you can TASTE','Notice any taste, or sip some water.']];
function moodList(){const m=S.get('moods',[]);return m.length?m.slice().reverse().map(e=>`<div class="entry"><button class="del" onclick="delMood(${e.t})" aria-label="Delete entry">×</button><b>${MOODS[e.m-1]}</b> <small>${new Date(e.t).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</small><div>${esc(e.n||'')}</div></div>`).join(''):'<p class="by">No entries yet. Your first note will show here.</p>'}
function pageWellness(){return `<div class="page-h"><h1>🌸 Wellness</h1><p>Small, calming tools for stress, exam pressure and tough days. Everything here is private to your device.</p></div>
<div class="grid2"><div class="card" style="text-align:center"><h3>Guided breathing</h3><p class="by">In for 4, hold for 4, out for 6.</p><div class="breath" id="breathCircle"><span id="breathTxt">Ready?</span></div><p class="by">Cycles completed: <b id="breathC">0</b></p><button class="btn" id="breathBtn" onclick="toggleBreath()">Start</button></div>
<div class="card" id="grCard">${grHTML()}</div></div>
<h2 class="sec">Private mood journal</h2><div class="grid2"><div class="card"><h3>How are you feeling?</h3><div class="moods">${MOODS.map((m,i)=>`<button class="mood ${MD===i+1?'on':''}" onclick="setMood(${i+1})" aria-label="Mood ${i+1}">${m}</button>`).join('')}</div><textarea id="moodNote" rows="4" placeholder="Write what is on your mind (optional)…"></textarea><div class="actions"><button class="btn" onclick="saveMood()">Save entry</button></div></div>
<div class="card"><h3>My entries</h3><div id="moodList">${moodList()}</div></div></div>
<div class="note">If you feel very low or unsafe for many days, please talk to someone you trust. Tele-MANAS offers free 24x7 mental health support on <a href="tel:14416"><b>14416</b></a>.</div>`}
function grHTML(){if(GR>=5)return `<h3>Well done 🌿</h3><p>You are here and you are safe. Take one slow breath.</p><button class="btn" onclick="GR=0;$('#grCard').innerHTML=grHTML()">Do it again</button>`;const g=GRD[GR];return `<h3>5-4-3-2-1 grounding</h3><p class="by">Brings you back to the present when you feel anxious.</p><div style="text-align:center;margin:12px 0"><div class="big" style="font-size:64px">${g[0]}</div><b>${g[1]}</b><p class="by">${g[2]}</p></div><button class="btn" onclick="nextGr()">${GR<4?'Done, next':'Finish'}</button>`}
function nextGr(){GR++;if(GR>=5)S.set('grounds',S.get('grounds',0)+1);$('#grCard').innerHTML=grHTML()}
function toggleBreath(){if(BR.run){stopBreath(true);return}BR.run=true;BR.c=0;$('#breathBtn').textContent='Stop';const seq=[['Breathe in',4000,1.35],['Hold',4000,1.35],['Breathe out',6000,1]];
 const step=i=>{if(!BR.run)return;const[t,ms,sc]=seq[i],c=$('#breathCircle');if(!c)return;$('#breathTxt').textContent=t;c.style.transitionDuration=ms+'ms';c.style.transform=`scale(${sc})`;if(i===2){BR.c++;$('#breathC').textContent=BR.c}BR.t=setTimeout(()=>step((i+1)%3),ms)};step(0)}
function stopBreath(save){clearTimeout(BR.t);if(BR.run&&save&&BR.c>0)S.set('breaths',S.get('breaths',0)+1);BR.run=false;const c=$('#breathCircle');if(c){c.style.transform='scale(1)';$('#breathTxt').textContent='Well done';$('#breathBtn').textContent='Start'}}
function setMood(m){MD=m;document.querySelectorAll('.mood').forEach((b,i)=>b.classList.toggle('on',i+1===m))}
function saveMood(){const a=S.get('moods',[]);a.push({t:Date.now(),m:MD,n:$('#moodNote').value.trim()});S.set('moods',a);$('#moodNote').value='';$('#moodList').innerHTML=moodList();toast('Saved privately')}
function delMood(t){S.set('moods',S.get('moods',[]).filter(e=>e.t!==t));$('#moodList').innerHTML=moodList()}

/* ---------- CONTACTS ---------- */
const HL=[['112','All emergencies (Police, Fire, Ambulance)'],['1091','Women in distress'],['181','Women helpline (support, shelter, legal info)'],['7827170170','National Commission for Women (NCW) helpline'],['1098','Childline (under 18)'],['1930','Cyber crime helpline'],['14416','Tele-MANAS mental health support'],['15100','Free legal aid (NALSA)'],['108','Ambulance']];
function circle(){const c=S.get('circle',[]);return c.length?c.map((p,i)=>{const d=p.n.replace(/\D/g,''),w=d.length===10?'91'+d:d;return `<div class="card helpline" style="margin-bottom:12px;padding:14px 18px"><div><b style="font-family:'DM Sans';font-size:17px;color:var(--plum)">${esc(p.name)}</b><br><span class="by">${esc(p.rel||'Trusted person')} · ${esc(p.n)}</span></div><div class="actions" style="margin:0"><a class="btn sm" href="tel:${esc(p.n)}">Call</a><a class="btn sm ghost" target="_blank" rel="noopener" href="https://wa.me/${w}">WhatsApp</a><button class="link-btn" onclick="delCircle(${i})">Remove</button></div></div>`}).join(''):'<p class="by">Add up to five people you trust. Their numbers are saved only on this device.</p>'}
function pageContacts(){return `<div class="page-h"><h1>📞 Contacts</h1><p>Important helplines and your own trusted circle, one tap away.</p></div>
<h2 class="sec" style="margin-top:0">Helplines (India)</h2><div class="grid3">${HL.map(h=>`<div class="card helpline"><div><b>${h[0]}</b><div class="by">${h[1]}</div></div><a class="btn sm" href="tel:${h[0]}">Call</a></div>`).join('')}</div>
<h2 class="sec">My trusted circle</h2><div class="grid2"><div class="card"><h3>Add a person</h3><div class="form" style="margin:14px 0"><label class="f">Name<input id="cName" placeholder="e.g. Aai"></label><label class="f">Phone number<input id="cNum" type="tel" placeholder="10-digit number"></label><label class="f">Relation<input id="cRel" placeholder="Mother, friend, teacher…"></label></div><button class="btn" onclick="addCircle()">Add to circle</button></div><div id="circleList">${circle()}</div></div>`}
function addCircle(){const n=$('#cName').value.trim(),p=$('#cNum').value.trim(),r=$('#cRel').value.trim(),a=S.get('circle',[]);if(!n||p.replace(/\D/g,'').length<10){toast('Enter a name and a valid phone number');return}if(a.length>=5){toast('You can add up to 5 people');return}a.push({name:n,n:p,rel:r});S.set('circle',a);rerender('contacts');toast('Added to your circle')}
function delCircle(i){const a=S.get('circle',[]);a.splice(i,1);S.set('circle',a);rerender('contacts')}

/* ---------- ACHIEVERS ---------- */
const ACH=[
['Savitribai Phule','Pioneers',"India's first female teacher",'She opened a school for girls in Pune in 1848 and spent her life fighting for education and equal rights for women.',330],
['Anandibai Joshi','Pioneers','One of the first Indian women doctors','She earned a medical degree in the USA in 1886 and proved that women can lead in medicine.',280],
['Bachendri Pal','Sports','First Indian woman on Mount Everest','She reached the summit of Everest in 1984 and later trained many women mountaineers.',20],
['Kalpana Chawla','Science & Space','Astronaut and engineer','She was the first woman of Indian origin in space, flying on the Space Shuttle in 1997.',250],
['Tessy Thomas','Science & Space','"Missile Woman of India"','A DRDO scientist who led the Agni-V missile project.',210],
['Ritu Karidhal','Science & Space','ISRO rocket scientist','She played a major role in the Mars Orbiter Mission and was Mission Director for Chandrayaan-2.',190],
['Gagandeep Kang','Science & Space','Virologist and vaccine scientist','She became the first Indian woman elected a Fellow of the Royal Society (2019) for her work on infectious diseases.',160],
['Mary Kom','Sports','Boxing champion','Six-time world champion and Olympic bronze medallist (2012).',350],
['PV Sindhu','Sports','Badminton star','Olympic silver (2016) and bronze (2020) medallist and 2019 world champion.',320],
['Avani Lekhara','Sports','Para-shooter','The first Indian woman to win a Paralympic gold medal in shooting (Tokyo 2020).',140],
['Sheetal Devi','Sports','Para-archer','Born without arms, she shoots with her feet and shoulder and has won Asian Para Games golds and a Paralympic medal.',10],
['Mithali Raj','Sports','Cricket legend','One of the greatest batters in women\'s cricket, with a record number of international runs.',200],
['Arunima Sinha','Sports','Mountaineer','After losing a leg, she became the first female amputee to climb Mount Everest in 2013.',30],
['Kiran Bedi','Leadership','First woman IPS officer','Joined the Indian Police Service in 1972 and became known for prison reforms.',270],
['Droupadi Murmu','Leadership','15th President of India','The first tribal woman to become President of India.',340],
['Kiran Mazumdar-Shaw','Business','Founder of Biocon','Built one of India\'s leading biotechnology companies from a garage start.',300],
['Falguni Nayar','Business','Founder of Nykaa','Started her entrepreneurial journey at 50 and built a major beauty and fashion platform.',350]];
let AF='All';
function personHTML(a,i){return `<div class="card"><div class="avatar" style="--h:${a[4]}">${a[0][0]}</div><h3 style="text-align:center;font-size:19px">${a[0]}</h3><p style="text-align:center;margin:4px 0 10px"><span class="badge info">${a[1]}</span></p><p style="text-align:center;font-weight:700;margin:0 0 8px">${a[2]}</p><details><summary>Her story</summary><p>${a[3]}</p><a class="link-btn" style="color:var(--rose)" target="_blank" rel="noopener" href="${G(a[0]+' biography')}">Read more ↗</a></details></div>`}
function pageAch(){const cats=['All','Pioneers','Science & Space','Sports','Leadership','Business'];
 return `<div class="page-h"><h1>✨ Women who inspire</h1><p>Real women who broke barriers in science, sports, leadership and business. Let their stories remind you what is possible.</p></div>
 <div class="tabs">${cats.map(c=>`<button class="chip ${AF===c?'on':''}" onclick="AF='${c}';rerender('achievers')">${c}</button>`).join('')}</div>
 <div class="grid3">${ACH.filter(a=>AF==='All'||a[1]===AF).map(personHTML).join('')}</div>`}

/* ---------- COMMUNITY ---------- */
const SEED=[{id:1,n:'Anika',tp:'Study',x:'Got my scholarship acknowledgement today! The Bloom checklist helped me gather every document in one go.',c:12,seed:1},{id:2,n:'Rutuja',tp:'Career',x:'Anyone preparing for MPSC? Looking for a free study group in Pune.',c:7,seed:1},{id:3,n:'Meera',tp:'Wellness',x:'The breathing exercise before my viva really helped me stay calm.',c:15,seed:1},{id:4,n:'Sana',tp:'Money',x:'Started a ₹500 monthly SIP. Small steps count!',c:9,seed:1}];
let CF='All';
function posts(){return [...S.get('posts',[]),...SEED]}
function pageCommunity(){const hid=S.get('hidden',[]),tp=['All','Study','Career','Money','Wellness','Safety','Cheers'];const l=posts().filter(p=>!hid.includes(p.id)&&(CF==='All'||p.tp===CF));
 return `<div class="page-h"><h1>👭 Community</h1><p>A moderated space to share, ask and cheer each other on. Be kind, never share phone numbers or addresses, and report anything that feels wrong.</p></div>
 <div class="card" style="margin-bottom:22px"><h3>Share something</h3><div class="form" style="margin:14px 0"><label class="f">Display name (use a nickname)<input id="pName" maxlength="20" placeholder="e.g. Riya" value="${me()?esc(me().name.split(' ')[0]):''}"></label><label class="f">Topic<select id="pTopic">${opt(tp.slice(1))}</select></label></div><textarea id="pText" rows="3" maxlength="300" placeholder="Ask a question, share a win, or cheer someone on…"></textarea><div class="actions"><button class="btn" onclick="addPost()">Post</button></div></div>
 <div class="tabs">${tp.map(c=>`<button class="chip ${CF===c?'on':''}" onclick="CF='${c}';rerender('community')">${c}</button>`).join('')}</div>
 ${l.map(p=>`<div class="card post"><div class="meta"><span class="av">${esc(p.n[0]||'B').toUpperCase()}</span><b style="color:var(--plum)">${esc(p.n)}</b><span class="badge info">${p.tp}</span>${p.seed?'<small>(sample post)</small>':''}</div><p style="margin:6px 0">${esc(p.x)}</p><button class="link-btn" onclick="cheer(${p.id})">💗 Cheer · ${p.c}</button><button class="link-btn" onclick="report(${p.id})">Report</button></div>`).join('')||'<p class="by">No posts in this topic yet. Be the first!</p>'}`}
function addPost(){const n=($('#pName').value.trim()||'Bloom friend'),x=$('#pText').value.trim();if(x.length<5){toast('Write a few more words');return}
 if(/\d{8,}|https?:\/\/|www\.|@\w+\.\w+/i.test(x.replace(/[\s-]/g,''))||/\b(idiot|stupid|hate you|kill|slut|bitch)\b/i.test(x)){toast('Please remove numbers, links or unkind words and try again');return}
 const a=S.get('posts',[]);a.unshift({id:Date.now(),n,tp:$('#pTopic').value,x,c:0});S.set('posts',a);rerender('community');toast('Posted')}
function cheer(id){const a=S.get('posts',[]),p=a.find(x=>x.id===id);if(p){p.c++;S.set('posts',a)}else{const s=SEED.find(x=>x.id===id),ch=S.get('seedCheers',{});ch[id]=(ch[id]||0)+1;S.set('seedCheers',ch);s.c=(s.base??(s.base=s.c-(ch[id]-1)))+ch[id]}rerender('community')}
function report(id){const h=S.get('hidden',[]);h.push(id);S.set('hidden',h);rerender('community');toast('Thank you. The post is hidden and flagged for review.')}

/* ---------- DASHBOARD ---------- */
function ring(p,label){return `<div class="card" style="text-align:center"><div class="ring" style="--p:${p};margin:0 auto"><span>${Math.round(p)}%</span></div><b>${label}</b></div>`}
function pageDash(){const plan=S.get('plan',[]).length/PLAN.length*100,sk=S.get('skills',[]).length/CORE.length*100,moods=S.get('moods',[]),goals=S.get('goals',[]),sg=S.get('saveGoal',{name:'',target:0,saved:0}),saved=S.get('examSaved',[]);
 const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=d.toDateString(),e=moods.filter(m=>new Date(m.t).toDateString()===k);return{l:d.toLocaleDateString('en-IN',{weekday:'short'}),v:e.length?e.reduce((a,b)=>a+b.m,0)/e.length:0}});
 const gd=goals.filter(g=>g.d).length;
 return `<div class="page-h"><h1>📊 ${me()?esc(me().name.split(' ')[0])+"'s dashboard":'My dashboard'}</h1><p>Your safety, wellness, learning and goals at a glance. Everything is stored only on this device.</p></div>${me()?'':'<div class="note">You are using Bloom as a guest. <a href="#/account"><b>Create a free account</b></a> to keep your progress under your own name.</div>'}
 <div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${ring(plan,'Safety plan')}${ring(sk,'Core skills')}${ring(goals.length?gd/goals.length*100:0,'My goals')}
 <div class="card" style="text-align:center"><div class="big">${S.get('schMatched',0)}</div><b>Scholarships matched</b><p class="by">${S.get('schSearch',0)} search(es) done</p><a class="link-btn" href="#/scholarships" style="color:var(--rose)">Find more →</a></div></div>
 <div class="grid2" style="margin-top:20px">
 <div class="card"><h3>Mood this week</h3><div class="bars">${days.map(d=>`<div><i style="height:${d.v*18}px"></i>${d.l}</div>`).join('')}</div><p class="by">Breathing sessions: <b>${S.get('breaths',0)}</b> · Grounding done: <b>${S.get('grounds',0)}</b> · Journal entries: <b>${moods.length}</b></p></div>
 <div class="card"><h3>Savings goal</h3>${sg.target?`<p><b>${esc(sg.name)}</b>: ${inr(sg.saved)} of ${inr(sg.target)}</p><div class="bar"><i style="width:${Math.min(100,sg.saved/sg.target*100)}%;background:var(--rose)"></i></div><div class="actions"><input id="addSave" type="number" placeholder="Add ₹" style="max-width:130px"><button class="btn sm" onclick="addSave()">Add</button><button class="link-btn" onclick="S.set('saveGoal',{name:'',target:0,saved:0});rerender('dashboard')">Reset</button></div>`:`<div class="form" style="margin:12px 0"><label class="f">Goal name<input id="sgN" placeholder="Laptop, course fees…"></label><label class="f">Target (₹)<input id="sgT" type="number"></label></div><button class="btn sm" onclick="setSave()">Set goal</button>`}</div>
 <div class="card"><h3>My goals</h3><div class="actions" style="margin-top:0"><input id="gIn" placeholder="e.g. Finish NPTEL Python course" style="flex:1;min-width:180px"><button class="btn sm" onclick="addGoal()">Add</button></div>${goals.map((g,i)=>`<label class="check-row"><input type="checkbox" ${g.d?'checked':''} onchange="togGoal(${i})"><span style="flex:1;${g.d?'text-decoration:line-through;color:var(--mut)':''}">${esc(g.t)}</span><button class="link-btn" onclick="event.preventDefault();delGoal(${i})">×</button></label>`).join('')||'<p class="by">Add your first goal for this month.</p>'}</div>
 <div class="card"><h3>Saved exams</h3>${saved.length?saved.map(id=>{const e=EX.find(x=>x.id===id);return `<p style="margin:6px 0"><a href="#/exams" style="color:var(--rose);font-weight:700" onclick="EXS.tab=${e.g}">${e.name}</a></p>`}).join(''):'<p class="by">Tap ☆ on an exam to save it here.</p>'}</div></div>`}
function setSave(){const n=$('#sgN').value.trim(),t=+$('#sgT').value;if(!n||t<=0){toast('Enter a name and target');return}S.set('saveGoal',{name:n,target:t,saved:0});rerender('dashboard')}
function addSave(){const g=S.get('saveGoal'),v=+$('#addSave').value;if(v>0){g.saved+=v;S.set('saveGoal',g);rerender('dashboard');if(g.saved>=g.target)toast('Goal reached! 🎉')}}
function addGoal(){const t=$('#gIn').value.trim();if(!t)return;const g=S.get('goals',[]);g.push({t,d:false});S.set('goals',g);rerender('dashboard')}
function togGoal(i){const g=S.get('goals',[]);g[i].d=!g[i].d;S.set('goals',g);rerender('dashboard')}
function delGoal(i){const g=S.get('goals',[]);g.splice(i,1);S.set('goals',g);rerender('dashboard')}

/* ---------- HOME ---------- */
function pageHome(){return `<section class="hero"><div>${me()?`<div class="greet">Welcome back, <b>${esc(me().name.split(' ')[0])}</b> 🌸</div>`:''}<h1>Every girl deserves a plan, a path and a place to bloom.</h1><p>Scholarships, exams, skills, safety, money and wellbeing, organised in one calm and private space made for girls and young women.</p>
<div class="cta"><a class="btn" href="#/scholarships">Find my scholarships</a><a class="btn ghost" href="#/exams">Which exam should I give?</a><a class="btn ghost" href="#/safety">I need help now</a>${me()?'':'<a class="btn plum" href="#/account">Create my free account</a>'}</div></div>
<svg class="flower" viewBox="0 0 300 300" role="img" aria-label="A blooming flower">${[0,45,90,135,180,225,270,315].map((r,i)=>`<g transform="rotate(${r} 150 150)"><ellipse class="petal" style="animation-delay:${i*.12}s" cx="150" cy="82" rx="30" ry="62" fill="${i%2?'#f06a9a':'#fbb4cf'}" opacity=".92"/></g>`).join('')}<circle cx="150" cy="150" r="32" fill="#e8b04a"/><circle cx="150" cy="150" r="14" fill="#fff3d0"/></svg></section>
<h2 class="sec">Everything you need, in one place</h2><div class="grid3">${TILES.map(t=>`<a class="card tile" href="#/${t[0]}"><span class="ico" style="background:${t[3]}">${EMO[t[0]]}</span><h3>${t[1]}</h3><p>${t[2]}</p><span class="open">Open →</span></a>`).join('')}</div>
<div class="sec-row"><h2 class="sec">Women who inspire</h2><a class="btn ghost" href="#/achievers">See all achievers</a></div>
<div class="inspire">${ACH.filter((a,i)=>[0,3,7,9].includes(i)).map(a=>`<a class="person" href="#/achievers"><div class="avatar" style="--h:${a[4]}">${a[0][0]}</div><b>${a[0]}</b><span>${a[2]}</span></a>`).join('')}</div>`}


/* ---------- ACCOUNT ---------- */
async function hashPw(pw,salt){try{const b=new TextEncoder().encode(salt+pw),d=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){let h=5381;for(const c of salt+pw)h=((h<<5)+h+c.charCodeAt(0))|0;return 'x'+h}}
let AUTH='signup';
function authMsg(t,ok){const m=$('#authMsg');if(m){m.className=ok?'note':'err';m.textContent=t}}
function setUser(id){UID=id;if(id)raw.set('session',id);else{try{localStorage.removeItem('bloom_session')}catch(e){}}SC=scDefault();renderWho()}
function renderWho(){const u=me(),el=$('#who');if(!el)return;el.innerHTML=u?`<a class="who-in" href="#/account"><span class="av">${esc(u.name[0].toUpperCase())}</span><span><b>${esc(u.name.split(' ')[0])}</b><small>My account</small></span></a><button class="who-out" onclick="logout()">Log out</button>`:`<a class="btn sm" href="#/account" style="width:100%;justify-content:center">Log in / Sign up</a>`}
const pwToggle='<label class="check-row" style="border:0;padding:4px 0"><input type="checkbox" onchange="document.querySelectorAll(\'.pw\').forEach(i=>i.type=this.checked?\'text\':\'password\')"> <span>Show password</span></label>';
function pageAccount(){const u=me();
 if(!u){const su=AUTH==='signup';
  return `<div class="page-h"><h1>👤 My account</h1><p>Create your free Bloom account to keep your scholarship profile, safety plan, journal, goals and saved exams under your own name.</p></div>
  <div class="grid2"><div class="card"><div class="tabs"><button class="chip ${su?'on':''}" onclick="AUTH='signup';rerender('account')">Sign up</button><button class="chip ${su?'':'on'}" onclick="AUTH='login';rerender('account')">Log in</button></div>
  ${su?`<form onsubmit="return doSignup(event)"><div class="form" style="grid-template-columns:1fr">
   <label class="f">Your name<input id="aName" maxlength="40" autocomplete="name" placeholder="e.g. Riya Patil"></label>
   <label class="f">Email address<input id="aEmail" type="email" autocomplete="email" placeholder="you@example.com"></label>
   <label class="f">Password (at least 6 characters)<input id="aPw" class="pw" type="password" autocomplete="new-password"></label>
   <label class="f">Confirm password<input id="aPw2" class="pw" type="password" autocomplete="new-password"></label>
   <label class="f">State<select id="aState">${opt(['Maharashtra','Tamil Nadu','West Bengal','Other'],'Maharashtra')}</select></label>
   <label class="f">Current education<select id="aLevel">${opt(Object.entries(LEVELS),'ug')}</select></label></div>${pwToggle}
   <div class="actions"><button class="btn" type="submit">Create my account</button></div></form>`
  :`<form onsubmit="return doLogin(event)"><div class="form" style="grid-template-columns:1fr">
   <label class="f">Email address<input id="lEmail" type="email" autocomplete="email"></label>
   <label class="f">Password<input id="lPw" class="pw" type="password" autocomplete="current-password"></label></div>${pwToggle}
   <div class="actions"><button class="btn" type="submit">Log in</button></div></form>`}
  <div id="authMsg" role="alert"></div></div>
  <div class="card"><h3>Why create an account?</h3><ul>
   <li>Your scholarship form is pre-filled with your state and education</li><li>Your safety plan, mood journal, goals and saved exams are kept under your name</li><li>Several girls can use the same computer without mixing their data</li><li>Your community posts use your name</li></ul>
   <div class="note">🔒 Privacy: Bloom has no server. Your account and your notes are stored only in this browser on this device, and passwords are saved in scrambled (hashed) form. Because of this, you cannot log in from a different device, and clearing browser data will remove the account.</div></div></div>`}
 const plan=Math.round(S.get('plan',[]).length/PLAN.length*100),sk=S.get('skills',[]).length;
 return `<div class="page-h"><h1>👤 My account</h1><p>Manage your profile and your Bloom data.</p></div>
 <div class="grid2"><div class="card"><div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap"><div class="avatar" style="--h:320;margin:0">${esc(u.name[0].toUpperCase())}</div><div><h2 style="font-size:26px">${esc(u.name)}</h2><p class="by">${esc(u.email)}</p><p class="by">Member since ${new Date(u.joined).toLocaleDateString('en-IN',{dateStyle:'medium'})}</p></div></div>
  <div class="stat" style="margin-top:16px"><span>Scholarships matched</span><b>${S.get('schMatched',0)}</b></div><div class="stat"><span>Safety plan done</span><b>${plan}%</b></div><div class="stat"><span>Core skills learned</span><b>${sk} / ${CORE.length}</b></div><div class="stat"><span>Exams saved</span><b>${S.get('examSaved',[]).length}</b></div>
  <div class="actions"><a class="btn" href="#/dashboard">Open my dashboard</a><button class="btn ghost" onclick="logout()">Log out</button></div></div>
 <div class="card"><h3>Edit profile</h3><div class="form" style="grid-template-columns:1fr;margin:14px 0"><label class="f">Name<input id="eName" value="${esc(u.name)}" maxlength="40"></label>
  <label class="f">State<select id="eState">${opt(['Maharashtra','Tamil Nadu','West Bengal','Other'],u.state)}</select></label>
  <label class="f">Current education<select id="eLevel">${opt(Object.entries(LEVELS),u.level)}</select></label></div><button class="btn" onclick="saveProfile()">Save changes</button></div>
 <div class="card"><h3>Change password</h3><div class="form" style="grid-template-columns:1fr;margin:14px 0"><label class="f">Current password<input id="cpOld" class="pw" type="password"></label><label class="f">New password<input id="cpNew" class="pw" type="password"></label></div>${pwToggle}<div class="actions"><button class="btn" onclick="changePw()">Update password</button></div><div id="authMsg" role="alert"></div></div>
 <div class="card"><h3>Delete my account</h3><p class="by">This permanently removes your account and all your saved Bloom data from this device.</p><button class="btn" style="background:#e5484d" onclick="delAccount()">Delete account</button></div></div>`}
async function doSignup(e){e.preventDefault();const name=$('#aName').value.trim(),email=$('#aEmail').value.trim().toLowerCase(),pw=$('#aPw').value,pw2=$('#aPw2').value;
 if(name.length<2)return authMsg('Please enter your name.');
 if(!/^\S+@\S+\.\S+$/.test(email))return authMsg('Enter a valid email address.');
 if(pw.length<6)return authMsg('Password must have at least 6 characters.');
 if(pw!==pw2)return authMsg('The two passwords do not match.');
 const accs=raw.get('accounts')||[];if(accs.some(a=>a.email===email))return authMsg('This email already has an account. Please use the Log in tab.');
 const salt=Math.random().toString(36).slice(2),id=Date.now().toString(36);
 accs.push({id,name,email,salt,hash:await hashPw(pw,salt),state:$('#aState').value,level:$('#aLevel').value,joined:Date.now()});
 raw.set('accounts',accs);setUser(id);toast('Welcome to Bloom, '+name.split(' ')[0]+'! 🌸');go('home');return false}
async function doLogin(e){e.preventDefault();const email=$('#lEmail').value.trim().toLowerCase(),pw=$('#lPw').value,a=(raw.get('accounts')||[]).find(x=>x.email===email);
 if(!a||a.hash!==await hashPw(pw,a.salt))return authMsg('Email or password is incorrect. If you are new, use the Sign up tab.');
 setUser(a.id);toast('Welcome back, '+a.name.split(' ')[0]+'! 🌸');go('home');return false}
function logout(){setUser(null);AUTH='login';toast('You are logged out');go('home')}
function saveProfile(){const accs=raw.get('accounts')||[],a=accs.find(x=>x.id===UID),n=$('#eName').value.trim();if(!a)return;if(n.length<2){toast('Please enter your name');return}a.name=n;a.state=$('#eState').value;a.level=$('#eLevel').value;raw.set('accounts',accs);SC=scDefault();renderWho();rerender('account');toast('Profile updated')}
async function changePw(){const accs=raw.get('accounts')||[],a=accs.find(x=>x.id===UID),o=$('#cpOld').value,n=$('#cpNew').value;if(!a)return;
 if(a.hash!==await hashPw(o,a.salt))return authMsg('Your current password is incorrect.');
 if(n.length<6)return authMsg('New password must have at least 6 characters.');
 a.hash=await hashPw(n,a.salt);raw.set('accounts',accs);$('#cpOld').value='';$('#cpNew').value='';authMsg('Password updated.',true)}
function delAccount(){if(!confirm('Delete your account and all saved data on this device? This cannot be undone.'))return;const id=UID;
 raw.set('accounts',(raw.get('accounts')||[]).filter(a=>a.id!==id));
 try{Object.keys(localStorage).filter(k=>k.startsWith('bloom_u'+id+'_')).forEach(k=>localStorage.removeItem(k))}catch(e){}
 setUser(null);toast('Account deleted');go('home')}

/* ---------- ROUTER ---------- */
const PAGES={home:pageHome,scholarships:pageSch,exams:pageExams,skills:pageSkills,safety:pageSafety,finance:pageFinance,wellness:pageWellness,contacts:pageContacts,achievers:pageAch,community:pageCommunity,dashboard:pageDash,account:pageAccount};
const INIT={finance(){calcSip();calcBudget()}};
let CUR='home';
function route(){const r=PAGES[CUR]?CUR:'home';
 if(BR.run)stopBreath(true);GR=0;closeNav();renderWho();
 document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('on',a.dataset.id===r));
 try{$('#view').innerHTML=PAGES[r]();if(INIT[r])INIT[r]()}catch(err){$('#view').innerHTML='<div class="card"><h3>Something went wrong</h3><p class="by">'+esc(err.message)+'</p></div>'}
 window.scrollTo(0,0);document.title='Bloom – '+(NAV.find(n=>n[0]===r)[1])}
function go(id){CUR=PAGES[id]?id:'home';try{history.replaceState(null,'','#/'+CUR)}catch(e){}route()}
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href^="#/"]');if(a){e.preventDefault();go(a.getAttribute('href').slice(2))}});
window.addEventListener('hashchange',()=>{const id=location.hash.replace('#/','').split('?')[0];if(PAGES[id]&&id!==CUR){CUR=id;route()}});
try{const h0=location.hash.replace('#/','').split('?')[0];if(PAGES[h0])CUR=h0}catch(e){}
route();

/* ---------- HELPER CHAT (understands spelling mistakes) ---------- */
const INTENTS=[
{k:['sos','unsafe','danger','scared','afraid','harass','harassment','followed','following','stalk','stalker','emergency','abuse','attack','threat','safe','safety'],r:'safety',l:'Open Safety & SOS',a:'I am here with you. If you are in danger right now, call 112 or 1091. The SOS page has step-by-step guidance, location sharing and a fake call.'},
{k:['scholarship','scholarships','scholar','fee','fees','stipend','grant','funding','financial','merit','bursary','excellence'],r:'scholarships',l:'Open Scholarships',a:'I can match you with scholarships using your qualification, category and income. Choose government or private, fill your details and I will show what you can apply for.',web:' scholarship'},
{k:['exam','exams','upsc','neet','jee','ssc','bank','mpsc','prepare','preparation','entrance','clat','gate','ctet','nda','ibps','railway','cuet','govt','government','job','jobs'],r:'exams',l:'Open Exams',a:'The Exams section lists government and non-government exams, the cheapest way to prepare, free resources and the benefits after clearing.',web:' exam'},
{k:['skill','skills','course','courses','certificate','certification','nptel','udemy','coursera','learn','learning','swayam','coding','typing'],r:'skills',l:'Open Skills',a:'Great choice! You will find free certificate courses from NPTEL, Coursera, Udemy and more, plus a checklist of core skills.'},
{k:['money','sip','save','saving','savings','budget','loan','invest','investment','mutual','finance','salary','business'],r:'finance',l:'Open Finance',a:'Try the SIP calculator and the 50/30/20 budget planner, and explore savings, loan and business schemes for women.'},
{k:['stress','stressed','anxious','anxiety','sad','panic','worried','tired','mood','depressed','lonely','breathe','breathing','calm','cry','crying','upset'],r:'wellness',l:'Open Wellness',a:'I am sorry you are feeling this way. Try the guided breathing or the 5-4-3-2-1 grounding exercise. If it feels heavy, Tele-MANAS (14416) offers free support.'},
{k:['helpline','helplines','number','numbers','call','contact','contacts','police','ambulance'],r:'contacts',l:'Open Contacts',a:'Here are the important helplines and your own trusted circle.'},
{k:['inspire','inspiration','role','model','woman','women','story','stories','achiever','achievers','motivation'],r:'achievers',l:'See Achievers',a:'Meet women who broke barriers in science, sports, leadership and business.'},
{k:['community','share','friends','post','posts'],r:'community',l:'Open Community',a:'The community is a kind, moderated place to share, ask and cheer each other on.'},
{k:['progress','goal','goals','dashboard'],r:'dashboard',l:'Open Dashboard',a:'See your progress, savings goal and to-do goals in one place.'},
{k:['account','login','signin','signup','register','password','profile','logout'],r:'account',l:'Open My Account',a:'You can create a free account, log in, edit your profile or log out from the My Account page.'}];
const STOP=new Set('tell me about for the of and is are what how can could i to a an in on give info information details please want need know my who which do you your with from this that any some there get got have has'.split(' '));
const GENERIC=new Set(['scholarship','scholarships','exam','exams','foundation','national','central','girl','girls','student','students','merit','college','programme','program','scheme','india','indian','bank','government','private','school','undergraduate','postgraduate','science','women','young','university','education','fund']);
function words(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(' ').filter(Boolean)}
function lev(a,b){const m=a.length,n=b.length,d=[];for(let i=0;i<=m;i++)d[i]=[i];for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
function near(a,b){if(a===b)return true;const L=Math.max(a.length,b.length);if(Math.min(a.length,b.length)<4||L<=4)return false;return lev(a,b)<=(L>=7?2:1)}
function findItem(tokens){const q=tokens.filter(t=>t.length>=3&&!STOP.has(t));let best=null,bs=0;
 const items=[...SCH.map(s=>({k:'s',o:s,n:s.name+' '+s.by})),...EX.map(e=>({k:'e',o:e,n:e.name}))];
 for(const it of items){const iw=words(it.n).filter(w=>w.length>=3&&!STOP.has(w));let sc=0,dist=0;
  q.forEach(t=>{if(iw.some(w=>near(t,w))){sc++;if(!GENERIC.has(t)&&t.length>=4)dist++}});
  if(dist>=1&&sc+dist*2>bs){bs=sc+dist*2;best=it}}
 return best}
function botReply(v){const tk=words(v),home=[{l:'Scholarships',r:'scholarships'},{l:'Exams',r:'exams'},{l:'I feel unsafe',r:'safety'}];
 if(tk.length<=3&&tk.some(t=>['hi','hii','hello','hey','namaste','hlo'].includes(t)))return{t:'Hello! 🌸 What would you like help with today?',b:home};
 if(tk.some(t=>near(t,'thanks')||near(t,'thank')||t==='ty'))return{t:'You are welcome! I am always here if you need anything else. 💗',b:[]};
 const it=findItem(tk);
 if(it&&it.k==='s'){const s=it.o;return{t:`${s.name}\nBy ${s.by}.\n${s.desc}\nBenefit: ${s.amt}.\nTip: use the Scholarships page to check if you are eligible, then apply on the official website.`,b:[{l:'Check my eligibility',r:'scholarships',pre:s.t},{l:'Apply on official site ↗',u:s.link},{l:'Watch how to fill form ↗',u:Y('How to apply '+s.name+' form fill step by step')}]}}
 if(it&&it.k==='e'){const e=it.o;return{t:`${e.name}\nWho can apply: ${e.who}\nPattern: ${e.info}\nOpen the Exams page for the cheapest way to prepare, free sources and benefits.`,b:[{l:'Open Exams',r:'exams',tab:e.g},{l:'Official website ↗',u:e.off}]}}
 const sc=INTENTS.map(n=>({n,s:tk.filter(t=>t.length>=3&&n.k.some(k=>near(t,k)||t===k)).length})).sort((a,b)=>b.s-a.s)[0];
 if(sc&&sc.s>0){const n=sc.n,b=[{l:n.l,r:n.r}];
  if(n.web)b.push({l:'Search the web for this ↗',u:G(v+n.web)});
  const extra=n.web?'\nI could not find that exact name in Bloom\'s list, so you can also search the web for it.':'';
  return{t:n.a+extra,b}}
 return{t:'I did not fully understand, but I can help with these. You can also search the web for your question.',b:[...home,{l:'Search the web ↗',u:G(v)}]}}
function addMsg(t,who,btns){const m=$('#msgs'),d=document.createElement('div');d.className='msg '+who;
 d.innerHTML=esc(t).replace(/\n/g,'<br>')+((btns&&btns.length)?'<div class="chat-btns">'+btns.map((b,i)=>b.u?`<a class="btn sm ghost" target="_blank" rel="noopener" href="${esc(b.u)}">${esc(b.l)}</a>`:b.q?`<button class="btn sm ghost" data-q="${esc(b.q)}">${esc(b.l)}</button>`:`<a class="btn sm" href="#/${b.r}" data-pre="${b.pre||''}" data-tab="${b.tab===undefined?'':b.tab}">${esc(b.l)}</a>`).join('')+'</div>':'');
 d.querySelectorAll('[data-q]').forEach(x=>x.onclick=()=>{$('#chatIn').value=x.dataset.q;sendChat({preventDefault(){}})});
 d.querySelectorAll('a[data-pre]').forEach(x=>x.addEventListener('click',()=>{if(x.dataset.pre){SC.type=x.dataset.pre;SC.done=false}if(x.dataset.tab!==''){EXS.tab=+x.dataset.tab;EXS.f='all'}$('#chat').hidden=true}));
 m.appendChild(d);m.scrollTop=m.scrollHeight}
function toggleChat(){const c=$('#chat');c.hidden=!c.hidden;if(!c.hidden&&!$('#msgs').children.length){const u=me();addMsg(`Hi${u?' '+u.name.split(' ')[0]:''}! I am the Bloom helper. Ask me about scholarships, exams, skills, safety, money or wellbeing. Spelling mistakes are fine! 🌸`,'bot',[{l:'Which scholarships can I get?',q:'Which scholarships can I get?'},{l:'Which exam should I give?',q:'Which exam should I give?'},{l:'I feel unsafe',q:'I feel unsafe'}])}if(!c.hidden)setTimeout(()=>$('#chatIn').focus(),50)}
function sendChat(e){e.preventDefault();const i=$('#chatIn'),v=i.value.trim();if(!v)return false;addMsg(v,'me');i.value='';const r=botReply(v);setTimeout(()=>addMsg(r.t,'bot',r.b),350);return false}