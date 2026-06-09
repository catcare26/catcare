const {useState,useEffect,createElement:h}=React;
const C={mint:"#00C896",mintBg:"rgba(0,200,150,0.12)",dark:"#0D1B2A",card:"#132338",cardL:"#1A2F47",border:"rgba(0,200,150,0.18)",text:"#E8F4F0",muted:"#7A9BAD",amber:"#F5A623",amberBg:"rgba(245,166,35,0.12)",red:"#FF5C5C",redBg:"rgba(255,92,92,0.12)",blue:"#4B9EFF",blueBg:"rgba(75,158,255,0.12)",purple:"#A78BFA"};

const CATS_INIT=[
  {id:1,name:"Mochi",breed:"Scottish Fold",sex:"F",dob:"2021-03-15",weight:3.8,color:"Gri cu alb",chip:"941000023847102",steri:true,vet:"Dr. Ionescu Maria",notes:"Ii plac jucăriile cu pene",ico:"🐱",bg:"#1D9E75",
   vax:[{id:1,name:"Tricat Trio",date:"2025-01-15",vet:"Dr. Ionescu",next:"2026-01-15",lot:"A2024B"},{id:2,name:"Antirabic",date:"2025-05-10",vet:"Dr. Ionescu",next:"2026-05-10",lot:"R2025X"}],
   dewI:[{id:1,prod:"Milbemax",qty:"1 comprimat",date:"2025-02-01",mo:3},{id:2,prod:"Milbemax",qty:"1 comprimat",date:"2025-05-01",mo:3}],
   dewE:[{id:1,prod:"Frontline Spot-On",qty:"1 pipeta",date:"2025-04-15",mo:1}],
   treat:[{id:1,drug:"Amoxicilin",dose:"62.5mg",freq:"2x/zi",start:"2025-03-10",end:"2025-03-17",instr:"Cu mâncare"}],
   cons:[{id:1,reason:"Control anual",diag:"Sanatoasa",recs:"Continuat schema vaccinare",cost:150}],
   surg:[],anal:[],
   wts:[{date:"2024-01-01",v:3.2},{date:"2024-06-01",v:3.5},{date:"2025-01-01",v:3.7},{date:"2025-06-01",v:3.8}]},
  {id:2,name:"Simba",breed:"Maine Coon",sex:"M",dob:"2020-07-22",weight:6.2,color:"Tabby portocaliu",chip:"",steri:true,vet:"Dr. Popescu Alexandru",notes:"Foarte vocal",ico:"🦁",bg:"#BA7517",
   vax:[{id:1,name:"Tricat Trio",date:"2024-12-01",vet:"Dr. Popescu",next:"2025-12-01",lot:"B2024C"}],
   dewI:[{id:1,prod:"Drontal",qty:"1 comprimat",date:"2025-01-10",mo:3}],
   dewE:[{id:1,prod:"Advantage",qty:"1 pipeta",date:"2025-03-20",mo:1}],
   treat:[],
   cons:[{id:1,reason:"Tuse cronica",diag:"Astm felin usor",recs:"Inhalator Aerokat",cost:280}],
   surg:[{id:1,name:"Castrare",date:"2021-02-14",clinic:"VetClinic Iasi",dr:"Dr. Popescu",notes:"Recuperare rapida"}],
   anal:[{id:1,type:"Hemograma",result:"Valori normale",date:"2025-01-05"}],
   wts:[{date:"2024-01-01",v:5.8},{date:"2024-06-01",v:6.0},{date:"2025-01-01",v:6.1},{date:"2025-06-01",v:6.2}]}
];

const MEDS_INIT=[
  {id:1,name:"Milbemax",qty:4,unit:"comprimate",exp:"2026-03-01"},
  {id:2,name:"Frontline",qty:2,unit:"pipete",exp:"2025-08-15"},
  {id:3,name:"Amoxicilin",qty:1,unit:"cutii",exp:"2025-07-01"}
];

const NOTIFS_INIT=[
  {id:1,ico:"💊",txt:"Maine: Milbemax pentru Mochi",time:"acum 2 ore",col:C.mint,type:"urgent"},
  {id:2,ico:"💉",txt:"Tricat Trio Simba expira in 7 zile",time:"acum 5 ore",col:C.amber,type:"warn"},
  {id:3,ico:"🩺",txt:"Control anual Mochi in 14 zile",time:"ieri",col:C.blue,type:"info"},
  {id:4,ico:"⚠️",txt:"Stoc redus: Frontline (2 pipete)",time:"ieri",col:C.red,type:"stoc"}
];

const EVT_TYPES=[
  {id:"vaccin",l:"Vaccin",ico:"💉",col:C.mint},
  {id:"deparazitare",l:"Deparazitare",ico:"🪱",col:C.blue},
  {id:"tratament",l:"Tratament",ico:"💊",col:C.purple},
  {id:"consultatie",l:"Consultatie",ico:"🩺",col:"#4B9EFF"},
  {id:"analiza",l:"Analiza",ico:"🔬",col:C.amber},
  {id:"interventie",l:"Interventie chirurg.",ico:"🏥",col:C.red},
  {id:"altele",l:"Altele",ico:"📌",col:C.muted}
];

const NOTIF_OPTS=[
  {v:"0",l:"In ziua evenimentului"},
  {v:"1",l:"Cu 1 zi inainte"},
  {v:"3",l:"Cu 3 zile inainte"},
  {v:"7",l:"Cu 7 zile inainte"},
  {v:"14",l:"Cu 14 zile inainte"},
  {v:"custom",l:"Personalizat"}
];

// ---- HELPERS ----
function fmtDate(d){if(!d)return"-";return new Date(d).toLocaleDateString("ro-RO");}
function calcAge(dob){
  const b=new Date(dob),n=new Date();
  let y=n.getFullYear()-b.getFullYear(),m=n.getMonth()-b.getMonth();
  if(m<0){y--;m+=12;}
  return y===0?`${m} luni`:m===0?`${y} ani`:`${y} ani ${m} luni`;
}
function daysUntil(ds){
  const d=Math.ceil((new Date(ds)-new Date())/86400000);
  if(d<0)return`${Math.abs(d)} zile in urma`;
  if(d===0)return"Azi";
  if(d===1)return"Maine";
  return`${d} zile`;
}
function nextAct(cat){
  const it=[];
  cat.vax.forEach(v=>{if(v.next)it.push({date:v.next,label:`Vaccin ${v.name}`,col:C.mint});});
  cat.dewI.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);it.push({date:nd.toISOString().slice(0,10),label:`Dep. int. ${d.prod}`,col:C.blue});});
  cat.dewE.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);it.push({date:nd.toISOString().slice(0,10),label:`Dep. ext. ${d.prod}`,col:C.amber});});
  it.sort((a,b)=>new Date(a.date)-new Date(b.date));
  return it[0]||null;
}

// ---- STORAGE ----
function loadState(key,fallback){
  try{const s=localStorage.getItem(key);return s?JSON.parse(s):fallback;}
  catch(e){return fallback;}
}
function saveState(key,val){
  try{localStorage.setItem(key,JSON.stringify(val));}
  catch(e){}
}

// ---- SMALL COMPONENTS ----
function Badge({children,col=C.mint}){
  return h("span",{style:{background:`${col}22`,color:col,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700,letterSpacing:.3,whiteSpace:"nowrap"}},children);
}
function Btn({children,onClick,primary,small,danger}){
  return h("button",{onClick,style:{
    background:primary?C.mint:danger?C.redBg:"none",
    color:primary?C.dark:danger?C.red:C.muted,
    border:`1px solid ${primary?C.mint:danger?C.red:C.border}`,
    borderRadius:10,padding:small?"5px 12px":"8px 16px",
    fontSize:small?11:13,fontWeight:primary?700:400,
    cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6
  }},children);
}
function Inp({label,value,onChange,type="text",placeholder=""}){
  return h("div",{style:{marginBottom:10}},
    label&&h("div",{style:{fontSize:10,color:C.muted,marginBottom:4,fontWeight:700}},label),
    h("input",{type,value,onChange:e=>onChange(e.target.value),placeholder,
      style:{width:"100%",background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"}
    })
  );
}
function Sel({label,value,onChange,options}){
  return h("div",{style:{marginBottom:10}},
    label&&h("div",{style:{fontSize:10,color:C.muted,marginBottom:4,fontWeight:700}},label),
    h("select",{value,onChange:e=>onChange(e.target.value),
      style:{width:"100%",background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px",color:C.text,fontSize:13,outline:"none"}
    },options.map(o=>h("option",{key:o.v,value:o.v},o.l)))
  );
}

function MiniChart({data}){
  if(!data||data.length<2)return null;
  const W=200,H=55,p=8;
  const vs=data.map(d=>d.v),mn=Math.min(...vs),mx=Math.max(...vs),rng=mx-mn||1;
  const pts=data.map((d,i)=>({x:p+(i/(data.length-1))*(W-p*2),y:H-p-((d.v-mn)/rng)*(H-p*2)}));
  const line=pts.map((pt,i)=>`${i===0?"M":"L"}${pt.x},${pt.y}`).join(" ");
  const area=line+` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  return h("svg",{width:W,height:H,style:{display:"block"}},
    h("path",{d:area,fill:`${C.mint}22`}),
    h("path",{d:line,fill:"none",stroke:C.mint,strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"}),
    pts.map((pt,i)=>h("circle",{key:i,cx:pt.x,cy:pt.y,r:3,fill:C.mint}))
  );
}

// ---- PDF GENERATOR ----
function generatePDF(cat,customEvents){
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
  const W=210,margin=18;
  let y=margin;
  function col(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);doc.setTextColor(r,g,b);}
  function fillCol(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);doc.setFillColor(r,g,b);}

  fillCol("#0D1B2A");doc.rect(0,0,W,42,"F");
  fillCol("#132338");doc.rect(0,42,W,8,"F");
  fillCol("#00C896");doc.roundedRect(margin,8,26,26,4,4,"F");
  col("#0D1B2A");doc.setFontSize(18);doc.text(cat.ico||"🐾",margin+4,23);
  col("#E8F4F0");doc.setFontSize(22);doc.setFont("helvetica","bold");
  doc.text("CatCare",margin+32,20);
  col("#7A9BAD");doc.setFontSize(10);doc.setFont("helvetica","normal");
  doc.text("Raport Medical Digital",margin+32,27);
  doc.text(`Generat: ${new Date().toLocaleDateString("ro-RO")}`,margin+32,34);
  y=58;

  fillCol("#132338");doc.setDrawColor(30,60,80);doc.setLineWidth(0.3);
  doc.roundedRect(margin,y,W-margin*2,36,4,4,"FD");
  fillCol("#1A2F47");doc.circle(margin+16,y+18,12,"F");
  col("#E8F4F0");doc.setFontSize(13);doc.text(cat.ico||"?",margin+11,y+22);
  col("#00C896");doc.setFontSize(18);doc.setFont("helvetica","bold");
  doc.text(cat.name,margin+34,y+14);
  col("#7A9BAD");doc.setFontSize(9);doc.setFont("helvetica","normal");
  doc.text(`${cat.breed}  ·  ${calcAge(cat.dob)}  ·  ${cat.sex==="F"?"Femela":"Mascul"}  ·  ${cat.weight} kg`,margin+34,y+21);
  doc.text(`Veterinar: ${cat.vet}`,margin+34,y+28);
  if(cat.chip){col("#4B9EFF");doc.text(`Microcip: ${cat.chip}`,margin+34,y+33);}
  fillCol(cat.steri?"#085041":"#633806");
  doc.roundedRect(W-margin-30,y+6,28,8,2,2,"F");
  col(cat.steri?"#9FE1CB":"#FAC775");doc.setFontSize(7);doc.setFont("helvetica","bold");
  doc.text(cat.steri?"STERILIZAT":"NESTERILIZAT",W-margin-29,y+11.5);
  y+=44;

  function section(title,ico,items,cols){
    if(!items||items.length===0)return;
    if(y>255){doc.addPage();y=margin;}
    col("#00C896");doc.setFontSize(11);doc.setFont("helvetica","bold");
    doc.text(`${ico}  ${title}`,margin,y);
    fillCol("#00C896");doc.rect(margin,y+1.5,W-margin*2,0.4,"F");
    y+=7;
    items.forEach((item,idx)=>{
      if(y>265){doc.addPage();y=margin;}
      fillCol(idx%2===0?"#132338":"#0D1B2A");
      doc.rect(margin,y-1,W-margin*2,6,"F");
      cols.forEach(c=>{
        col(c.color||"#E8F4F0");doc.setFontSize(8);doc.setFont("helvetica",c.bold?"bold":"normal");
        const txt=String(item[c.key]||"—");
        doc.text(txt.length>c.maxLen?txt.slice(0,c.maxLen)+"…":txt,margin+c.x,y+3.5);
      });
      y+=6;
    });
    y+=6;
  }

  section("Vaccinuri","💉",cat.vax,[
    {key:"name",x:0,maxLen:30,bold:true},{key:"date",x:60,maxLen:15,color:"#7A9BAD"},
    {key:"vet",x:90,maxLen:25,color:"#7A9BAD"},{key:"next",x:140,maxLen:15,color:"#00C896"}
  ]);
  section("Deparazitari interne","🪱",cat.dewI,[
    {key:"prod",x:0,maxLen:30,bold:true},{key:"qty",x:60,maxLen:20,color:"#7A9BAD"},{key:"date",x:100,maxLen:15,color:"#7A9BAD"}
  ]);
  section("Deparazitari externe","🐛",cat.dewE,[
    {key:"prod",x:0,maxLen:30,bold:true},{key:"qty",x:60,maxLen:20,color:"#7A9BAD"},{key:"date",x:100,maxLen:15,color:"#7A9BAD"}
  ]);
  section("Tratamente","💊",cat.treat,[
    {key:"drug",x:0,maxLen:25,bold:true},{key:"dose",x:55,maxLen:12,color:"#7A9BAD"},
    {key:"freq",x:80,maxLen:15,color:"#7A9BAD"},{key:"start",x:110,maxLen:13,color:"#7A9BAD"},{key:"end",x:138,maxLen:13,color:"#A78BFA"}
  ]);
  section("Consultatii","🩺",cat.cons,[
    {key:"reason",x:0,maxLen:30,bold:true},{key:"diag",x:70,maxLen:30,color:"#7A9BAD"},{key:"cost",x:148,maxLen:10,color:"#00C896"}
  ]);
  section("Interventii chirurgicale","🏥",cat.surg,[
    {key:"name",x:0,maxLen:30,bold:true},{key:"date",x:65,maxLen:15,color:"#7A9BAD"},
    {key:"clinic",x:95,maxLen:30,color:"#7A9BAD"},{key:"dr",x:148,maxLen:20,color:"#7A9BAD"}
  ]);
  section("Analize","🔬",cat.anal,[
    {key:"type",x:0,maxLen:30,bold:true},{key:"date",x:70,maxLen:15,color:"#7A9BAD"},{key:"result",x:100,maxLen:40,color:"#00C896"}
  ]);

  const catEvts=(customEvents||[]).filter(e=>e.catId===cat.id);
  if(catEvts.length>0){
    section("Evenimente programate","📅",catEvts.map(e=>({name:e.title,date:e.date,time:e.time||"",note:e.note||""})),[
      {key:"name",x:0,maxLen:30,bold:true},{key:"date",x:70,maxLen:15,color:"#7A9BAD"},
      {key:"time",x:110,maxLen:10,color:"#7A9BAD"},{key:"note",x:130,maxLen:25,color:"#A78BFA"}
    ]);
  }

  if(cat.wts&&cat.wts.length>0){
    if(y>230){doc.addPage();y=margin;}
    col("#00C896");doc.setFontSize(11);doc.setFont("helvetica","bold");
    doc.text("📊  Evolutie greutate",margin,y);
    fillCol("#00C896");doc.rect(margin,y+1.5,W-margin*2,0.4,"F");
    y+=9;
    const bw=20,gap=8,bh=25;
    const vals=cat.wts.map(w=>w.v),mx2=Math.max(...vals)*1.1;
    cat.wts.forEach((w,i)=>{
      const bx=margin+i*(bw+gap),bHeight=(w.v/mx2)*bh;
      fillCol("#1A2F47");doc.rect(bx,y,bw,bh,"F");
      fillCol("#00C896");doc.rect(bx,y+bh-bHeight,bw,bHeight,"F");
      col("#E8F4F0");doc.setFontSize(7);doc.setFont("helvetica","bold");
      doc.text(`${w.v}kg`,bx+2,y+bh-bHeight-2);
      col("#7A9BAD");doc.setFontSize(6);doc.setFont("helvetica","normal");
      doc.text(fmtDate(w.date).slice(0,7),bx,y+bh+5);
    });
    y+=bh+14;
  }

  const pages=doc.getNumberOfPages();
  for(let i=1;i<=pages;i++){
    doc.setPage(i);
    fillCol("#132338");doc.rect(0,287,W,10,"F");
    col("#7A9BAD");doc.setFontSize(7);doc.setFont("helvetica","normal");
    doc.text("CatCare — Carnet Medical Digital",margin,293);
    doc.text(`Pagina ${i} din ${pages}`,W-margin-20,293);
  }
  return doc;
}

// ---- SHARE MODAL ----
function ShareModal({cat,customEvents,onClose}){
  const [status,setStatus]=useState("");
  function doDownload(){
    const doc=generatePDF(cat,customEvents);
    doc.save(`CatCare_${cat.name}_${new Date().toISOString().slice(0,10)}.pdf`);
    setStatus("✅ PDF descarcat cu succes!");
  }
  function doEmail(){
    doDownload();
    const subject=encodeURIComponent(`Raport Medical CatCare — ${cat.name}`);
    const body=encodeURIComponent(`Buna ziua,\n\nAlaturat gasiti raportul medical pentru ${cat.name}.\nData: ${new Date().toLocaleDateString("ro-RO")}\n\nCatCare`);
    window.open(`mailto:?subject=${subject}&body=${body}`,"_blank");
    setStatus("📧 Deschide clientul de email si ataseaza PDF-ul descarcat!");
  }
  function doWhatsApp(){
    doDownload();
    const msg=encodeURIComponent(`Raport medical CatCare pentru ${cat.name} 🐱\nData: ${new Date().toLocaleDateString("ro-RO")}\nRasa: ${cat.breed} · Varsta: ${calcAge(cat.dob)} · Greutate: ${cat.weight}kg`);
    window.open(`https://wa.me/?text=${msg}`,"_blank");
    setStatus("💬 WhatsApp deschis! Ataseaza PDF-ul descarcat.");
  }
  function doPrint(){
    const doc=generatePDF(cat,customEvents);
    const blob=doc.output("bloburl");
    window.open(blob,"_blank");
    setStatus("🖨️ PDF deschis pentru printare!");
  }
  const btns=[
    {l:"Descarca PDF",i:"📥",fn:doDownload,col:C.mint},
    {l:"Trimite pe Email",i:"📧",fn:doEmail,col:C.blue},
    {l:"Share WhatsApp",i:"💬",fn:doWhatsApp,col:"#25D366"},
    {l:"Printeaza",i:"🖨️",fn:doPrint,col:C.amber}
  ];
  return h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16},onClick:onClose},
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,maxWidth:400,width:"100%"},onClick:e=>e.stopPropagation()},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}},
        h("div",null,
          h("div",{style:{fontSize:16,fontWeight:800,color:C.text}},"📄 Raport PDF"),
          h("div",{style:{fontSize:12,color:C.muted,marginTop:2}},cat.ico+" "+cat.name)),
        h("button",{onClick:onClose,style:{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}},"×")),
      h("div",{style:{background:C.cardL,borderRadius:12,padding:14,marginBottom:18}},
        h("div",{style:{fontSize:11,color:C.muted,marginBottom:6}},"Raportul include:"),
        ["Date generale","Vaccinuri & deparazitari","Tratamente & consultatii","Interventii & analize","Grafic greutate","Evenimente calendar"].map((item,idx)=>
          h("div",{key:idx,style:{fontSize:12,color:C.text,display:"flex",alignItems:"center",gap:7,marginBottom:3}},
            h("span",{style:{color:C.mint}},"✓"),item))),
      h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}},
        btns.map((b,i)=>h("button",{key:i,onClick:b.fn,style:{background:`${b.col}18`,border:`1px solid ${b.col}44`,borderRadius:12,padding:"14px 10px",cursor:"pointer",textAlign:"center"},
          onMouseEnter:e=>e.currentTarget.style.background=`${b.col}33`,
          onMouseLeave:e=>e.currentTarget.style.background=`${b.col}18`},
          h("div",{style:{fontSize:22,marginBottom:5}},b.i),
          h("div",{style:{fontSize:11,fontWeight:700,color:b.col}},b.l)))),
      status&&h("div",{style:{padding:"10px 14px",background:`${C.mint}18`,border:`1px solid ${C.mint}33`,borderRadius:10,fontSize:12,color:C.mint}},status)
    )
  );
}

// ---- ADD EVENT MODAL ----
function AddEventModal({cats,initialDate,onClose,onSave}){
  const today=new Date().toISOString().slice(0,10);
  const [f,setF]=useState({title:"",type:"vaccin",catId:String(cats[0]?.id||""),date:initialDate||today,time:"09:00",notif:"1",customDays:"",note:"",repeat:"none",location:""});
  const t=EVT_TYPES.find(e=>e.id===f.type)||EVT_TYPES[0];
  function save(){if(!f.title||!f.date)return;onSave({...f,id:Date.now(),catId:parseInt(f.catId)});onClose();}
  return h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:12},onClick:onClose},
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:22,maxWidth:420,width:"100%",overflow:"hidden"},onClick:e=>e.stopPropagation()},
      h("div",{style:{background:C.cardL,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
        h("button",{onClick:onClose,style:{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",padding:0}},"Anuleaza"),
        h("div",{style:{fontSize:14,fontWeight:700,color:C.text}},"Eveniment nou"),
        h("button",{onClick:save,style:{background:"none",border:"none",color:C.mint,fontSize:13,fontWeight:700,cursor:"pointer",padding:0}},"Adauga")),
      h("div",{style:{padding:"16px 18px",maxHeight:"65vh",overflowY:"auto"}},
        h("div",{style:{background:C.cardL,borderRadius:12,padding:"14px",marginBottom:12,border:`1px solid ${t.col}44`}},
          h("div",{style:{display:"flex",alignItems:"center",gap:10,marginBottom:10}},
            h("div",{style:{width:36,height:36,borderRadius:10,background:`${t.col}22`,border:`1px solid ${t.col}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}},t.ico),
            h("input",{value:f.title,onChange:e=>setF(p=>({...p,title:e.target.value})),placeholder:"Titlu eveniment",style:{flex:1,background:"none",border:"none",color:C.text,fontSize:16,fontWeight:600,outline:"none"}})),
          h("textarea",{value:f.note,onChange:e=>setF(p=>({...p,note:e.target.value})),placeholder:"Note, detalii, doza...",rows:2,style:{width:"100%",background:"none",border:"none",borderTop:`1px solid ${C.border}`,paddingTop:8,color:C.muted,fontSize:13,outline:"none",resize:"none",boxSizing:"border-box"}})),
        h("div",{style:{marginBottom:12}},
          h("div",{style:{fontSize:10,color:C.muted,marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}},"Tip eveniment"),
          h("div",{style:{display:"flex",flexWrap:"wrap",gap:6}},
            EVT_TYPES.map(tp=>h("button",{key:tp.id,onClick:()=>setF(p=>({...p,type:tp.id})),style:{background:f.type===tp.id?`${tp.col}33`:`${tp.col}11`,border:`1px solid ${f.type===tp.id?tp.col:tp.col+"33"}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:f.type===tp.id?700:400,cursor:"pointer",color:tp.col}},tp.ico+" "+tp.l)))),
        h("div",{style:{background:C.cardL,borderRadius:12,marginBottom:12,overflow:"hidden"}},
          h("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
            h("span",{style:{fontSize:13,color:C.text}},"Pisica"),
            h("select",{value:f.catId,onChange:e=>setF(p=>({...p,catId:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:13,fontWeight:600,cursor:"pointer",outline:"none"}},
              cats.map(c=>h("option",{key:c.id,value:c.id},`${c.ico} ${c.name}`)))),
          h("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
            h("span",{style:{fontSize:13,color:C.text}},"Data"),
            h("input",{type:"date",value:f.date,onChange:e=>setF(p=>({...p,date:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:13,fontWeight:600,cursor:"pointer",outline:"none"}})),
          h("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
            h("span",{style:{fontSize:13,color:C.text}},"Ora"),
            h("input",{type:"time",value:f.time,onChange:e=>setF(p=>({...p,time:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:13,fontWeight:600,cursor:"pointer",outline:"none"}})),
          h("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.border}`}},
            h("span",{style:{fontSize:13,color:C.text}},"Locatie"),
            h("input",{value:f.location,onChange:e=>setF(p=>({...p,location:e.target.value})),placeholder:"ex: VetClinic",style:{background:"none",border:"none",color:C.mint,fontSize:13,outline:"none",textAlign:"right",width:140}})),
          h("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
            h("span",{style:{fontSize:13,color:C.text}},"Repetare"),
            h("select",{value:f.repeat,onChange:e=>setF(p=>({...p,repeat:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:13,fontWeight:600,cursor:"pointer",outline:"none"}},
              [{v:"none",l:"Niciodata"},{v:"daily",l:"Zilnic"},{v:"weekly",l:"Saptamanal"},{v:"monthly",l:"Lunar"},{v:"yearly",l:"Anual"}].map(o=>h("option",{key:o.v,value:o.v},o.l))))),
        h("div",{style:{background:C.cardL,borderRadius:12,marginBottom:12,overflow:"hidden"}},
          h("div",{style:{padding:"10px 14px",background:`${C.mint}11`,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}},
            h("span",{style:{fontSize:16}},"🔔"),
            h("span",{style:{fontSize:13,fontWeight:700,color:C.text}},"Notificare")),
          h("div",{style:{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}},
            h("span",{style:{fontSize:13,color:C.text}},"Cand"),
            h("select",{value:f.notif,onChange:e=>setF(p=>({...p,notif:e.target.value})),style:{background:"none",border:"none",color:C.mint,fontSize:13,fontWeight:600,cursor:"pointer",outline:"none"}},
              NOTIF_OPTS.map(o=>h("option",{key:o.v,value:o.v},o.l)))),
          f.notif==="custom"&&h("div",{style:{padding:"0 14px 10px",display:"flex",alignItems:"center",gap:10}},
            h("span",{style:{fontSize:12,color:C.muted}},"Cu"),
            h("input",{type:"number",value:f.customDays,onChange:e=>setF(p=>({...p,customDays:e.target.value})),style:{width:60,background:C.dark,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 8px",color:C.text,fontSize:13,outline:"none"}}),
            h("span",{style:{fontSize:12,color:C.muted}},"zile inainte")),
          h("div",{style:{padding:"8px 14px",background:`${C.mint}0A`,borderTop:`1px solid ${C.border}`}},
            h("div",{style:{fontSize:11,color:C.muted}},"Preview:"),
            h("div",{style:{fontSize:12,color:C.mint,marginTop:2,fontStyle:"italic"}},
              f.title?`"${f.notif==="0"?"Azi":"Reminder:"} ${f.title} ${cats.find(c=>c.id===parseInt(f.catId))?.name?"pentru "+cats.find(c=>c.id===parseInt(f.catId))?.name:""}"`:
              "Completeaza titlul pentru preview..."))),
        h("button",{onClick:save,style:{width:"100%",background:C.mint,color:C.dark,border:"none",borderRadius:12,padding:"13px",fontSize:15,fontWeight:800,cursor:"pointer"}},"✓  Adauga eveniment"))));
}

// ---- CALENDAR PAGE ----
function CalendarPage({cats,customEvents,setCustomEvents}){
  const today=new Date();
  const [yr,setYr]=useState(today.getFullYear());
  const [mo,setMo]=useState(today.getMonth());
  const [sel,setSel]=useState(null);
  const [fcat,setFcat]=useState("all");
  const [addModal,setAddModal]=useState(false);
  const [addDate,setAddDate]=useState(null);
  const dim=new Date(yr,mo+1,0).getDate();
  const fd=new Date(yr,mo,1).getDay(),off=fd===0?6:fd-1;
  const MN=["Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie","Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"];

  function getEvs(day){
    const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const evs=[];
    const fc=fcat==="all"?cats:cats.filter(c=>c.id===parseInt(fcat));
    fc.forEach(cat=>{
      cat.vax.forEach(v=>{if(v.next===ds)evs.push({cat:cat.name,catId:cat.id,label:`Vaccin ${v.name}`,col:C.mint,ico:"💉",time:"",note:""});});
      cat.dewI.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);if(nd.toISOString().slice(0,10)===ds)evs.push({cat:cat.name,catId:cat.id,label:`Dep.int. ${d.prod}`,col:C.blue,ico:"🪱",time:"",note:d.qty});});
      cat.dewE.forEach(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);if(nd.toISOString().slice(0,10)===ds)evs.push({cat:cat.name,catId:cat.id,label:`Dep.ext. ${d.prod}`,col:C.amber,ico:"🐛",time:"",note:d.qty});});
      cat.treat.forEach(t=>{if(t.start===ds)evs.push({cat:cat.name,catId:cat.id,label:`Tratament ${t.drug} ${t.dose}`,col:C.purple,ico:"💊",time:"",note:t.freq});});
    });
    const fcIds=fcat==="all"?cats.map(c=>c.id):cats.filter(c=>c.id===parseInt(fcat)).map(c=>c.id);
    customEvents.filter(e=>e.date===ds&&fcIds.includes(e.catId)).forEach(e=>{
      const et=EVT_TYPES.find(t=>t.id===e.type)||EVT_TYPES[0];
      const cn=cats.find(c=>c.id===e.catId);
      evs.push({cat:cn?.name||"",catId:e.catId,label:e.title,col:et.col,ico:et.ico,time:e.time,note:e.note,custom:true,id:e.id,notif:e.notif});
    });
    return evs;
  }
  const selEvs=sel?getEvs(sel):[];

  return h("div",null,
    h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}},
      h("div",{style:{display:"flex",alignItems:"center",gap:8}},
        h(Btn,{small:true,onClick:()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);}},"‹"),
        h("span",{style:{fontSize:16,fontWeight:700,color:C.text,minWidth:155,textAlign:"center"}},`${MN[mo]} ${yr}`),
        h(Btn,{small:true,onClick:()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);}},"›")),
      h("div",{style:{display:"flex",gap:8,alignItems:"center"}},
        h("select",{value:fcat,onChange:e=>setFcat(e.target.value),style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"6px 10px",color:C.text,fontSize:12,cursor:"pointer"}},
          h("option",{value:"all"},"Toate"),cats.map(c=>h("option",{key:c.id,value:c.id},`${c.ico} ${c.name}`))),
        h("button",{onClick:()=>{setAddDate(null);setAddModal(true);},style:{background:C.mint,border:"none",borderRadius:10,padding:"7px 14px",color:C.dark,fontSize:13,fontWeight:800,cursor:"pointer"}},
          "+ Adauga"))),
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:10}},
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",background:C.cardL}},
        ["Lu","Ma","Mi","Jo","Vi","Sa","Du"].map(d=>h("div",{key:d,style:{padding:"8px 0",textAlign:"center",fontSize:11,fontWeight:700,color:C.muted}},d))),
      h("div",{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}},
        Array(off).fill(null).map((_,i)=>h("div",{key:`e${i}`,style:{minHeight:54}})),
        Array(dim).fill(null).map((_,i)=>{
          const day=i+1,evs=getEvs(day);
          const isT=today.getFullYear()===yr&&today.getMonth()===mo&&today.getDate()===day;
          const isSel=sel===day;
          return h("div",{key:day,
            onClick:()=>setSel(isSel?null:day),
            onDoubleClick:()=>{const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;setAddDate(ds);setAddModal(true);},
            style:{minHeight:54,padding:"5px 3px",border:`0.5px solid ${C.border}`,cursor:"pointer",background:isSel?`${C.mint}22`:"transparent"}},
            h("div",{style:{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:isT?C.mint:"transparent",color:isT?C.dark:C.text,fontSize:12,fontWeight:isT?800:400,margin:"0 auto 3px"}},day),
            evs.length>0&&h("div",{style:{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap"}},
              evs.slice(0,4).map((ev,ei)=>h("div",{key:ei,style:{width:5,height:5,borderRadius:"50%",background:ev.col}})))
          );
        })
      )),
    sel&&h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}},
        h("div",{style:{fontSize:14,fontWeight:700,color:C.text}},`${sel} ${MN[mo]} ${yr}`),
        h("button",{onClick:()=>{setAddDate(`${yr}-${String(mo+1).padStart(2,"0")}-${String(sel).padStart(2,"0")}`);setAddModal(true);},style:{background:C.mint,border:"none",borderRadius:8,padding:"5px 12px",color:C.dark,fontSize:11,fontWeight:700,cursor:"pointer"}},
          "+ eveniment")),
      selEvs.length===0?h("div",{style:{color:C.muted,fontSize:12}},"Niciun eveniment. Dublu-click pe zi pentru a adauga."):
      selEvs.map((ev,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.cardL,borderRadius:12,marginBottom:7,border:`1px solid ${ev.col}33`}},
        h("div",{style:{width:36,height:36,borderRadius:10,background:`${ev.col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}},ev.ico),
        h("div",{style:{flex:1}},
          h("div",{style:{fontSize:13,fontWeight:700,color:C.text}},ev.label),
          h("div",{style:{display:"flex",gap:8,marginTop:3,flexWrap:"wrap"}},
            ev.time&&h("span",{style:{fontSize:10,color:C.muted}},"🕐 "+ev.time),
            ev.note&&h("span",{style:{fontSize:10,color:C.muted}},"📝 "+ev.note),
            ev.notif&&ev.notif!=="0"&&h("span",{style:{fontSize:10,color:C.mint}},"🔔 "+NOTIF_OPTS.find(o=>o.v===ev.notif)?.l),
            h(Badge,{col:ev.col},ev.cat))),
        ev.custom&&h("button",{onClick:()=>setCustomEvents(p=>p.filter(e=>e.id!==ev.id)),style:{background:"none",border:"none",color:C.muted,fontSize:16,cursor:"pointer",padding:0}},"×")))),
    h("div",{style:{fontSize:11,color:C.muted,marginTop:8,textAlign:"center"}},"Dublu-click pe o zi pentru a adauga rapid"),
    addModal&&h(AddEventModal,{cats,initialDate:addDate,onClose:()=>setAddModal(false),onSave:ev=>{setCustomEvents(p=>[...p,ev]);setAddModal(false);}})
  );
}

// ---- CAT PROFILE ----
function CatProfile({cat,onBack,customEvents,onShare}){
  const [tab,setTab]=useState("general");
  const tabs=[{id:"general",l:"General"},{id:"vax",l:"Vaccinuri"},{id:"dew",l:"Deparazitari"},{id:"treat",l:"Tratamente"},{id:"cons",l:"Consultatii"},{id:"surg",l:"Interventii"},{id:"anal",l:"Analize"},{id:"wt",l:"Greutate"}];
  return h("div",null,
    h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
      h("button",{onClick:onBack,style:{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:5}},"← Inapoi"),
      h("button",{onClick:onShare,style:{background:`${C.mint}18`,border:`1px solid ${C.mint}44`,borderRadius:12,padding:"8px 16px",color:C.mint,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:7}},
        "📄 Raport PDF / Share")),
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:20,marginBottom:16,display:"flex",alignItems:"center",gap:18,flexWrap:"wrap"}},
      h("div",{style:{width:80,height:80,borderRadius:"50%",background:`${cat.bg}33`,border:`3px solid ${cat.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,flexShrink:0}},cat.ico),
      h("div",{style:{flex:1,minWidth:200}},
        h("div",{style:{fontSize:22,fontWeight:800,color:C.text}},cat.name),
        h("div",{style:{color:C.muted,marginBottom:8}},`${cat.breed} · ${calcAge(cat.dob)}`),
        h("div",{style:{display:"flex",flexWrap:"wrap",gap:7}},
          h(Badge,{col:cat.sex==="F"?C.purple:C.blue},cat.sex==="F"?"femela":"mascul"),
          h(Badge,{col:C.mint},`${cat.weight} kg`),
          h(Badge,{col:cat.steri?C.mint:C.amber},cat.steri?"sterilizata":"nesterilizata"),
          cat.chip&&h(Badge,{col:C.muted},`🔖 ${cat.chip}`))),
      h("div",{style:{textAlign:"right"}},
        h("div",{style:{fontSize:11,color:C.muted}},"Veterinar"),
        h("div",{style:{fontSize:13,color:C.text,fontWeight:600}},cat.vet))),
    h("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}},
      tabs.map(t=>h("button",{key:t.id,onClick:()=>setTab(t.id),style:{background:tab===t.id?C.mint:C.card,color:tab===t.id?C.dark:C.muted,border:`1px solid ${tab===t.id?C.mint:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:tab===t.id?700:400,cursor:"pointer"}},t.l))),
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:18}},
      tab==="general"&&h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr"}},
        [["Nume",cat.name],["Rasa",cat.breed],["Data nasterii",fmtDate(cat.dob)],["Varsta",calcAge(cat.dob)],["Sex",cat.sex==="F"?"femela":"mascul"],["Greutate",`${cat.weight} kg`],["Culoare",cat.color],["Microcip",cat.chip||"—"],["Sterilizata",cat.steri?"Da":"Nu"],["Veterinar",cat.vet]]
          .map(([k,v],i)=>h("div",{key:i,style:{padding:"11px 0",borderBottom:`1px solid ${C.border}`}},
            h("div",{style:{fontSize:10,color:C.muted,marginBottom:2}},k),
            h("div",{style:{fontSize:13,color:C.text,fontWeight:600}},v)))),
      tab==="vax"&&h("div",null,
        cat.vax.length===0?h("div",{style:{color:C.muted,fontSize:13}},"Niciun vaccin inregistrat."):
        cat.vax.map(v=>h("div",{key:v.id,style:{background:C.cardL,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},h("span",{style:{fontWeight:700,color:C.text}},`💉 ${v.name}`),h(Badge,{col:C.mint},`urmator: ${fmtDate(v.next)}`)),
          h("div",{style:{fontSize:11,color:C.muted}},`${fmtDate(v.date)} · ${v.vet} · Lot: ${v.lot||"—"}`)))),
      tab==="dew"&&h("div",null,
        h("div",{style:{fontSize:13,fontWeight:700,color:C.text,marginBottom:10}},"Deparazitari interne"),
        cat.dewI.map(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);return h("div",{key:d.id,style:{background:C.cardL,borderRadius:12,padding:12,marginBottom:8,border:`1px solid ${C.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},h("span",{style:{fontWeight:700,color:C.text}},d.prod),h(Badge,{col:C.blue},daysUntil(nd.toISOString().slice(0,10)))),
          h("div",{style:{fontSize:11,color:C.muted}},`${d.qty} · ${fmtDate(d.date)} · la ${d.mo} luni`));}),
        h("div",{style:{fontSize:13,fontWeight:700,color:C.text,margin:"14px 0 10px"}},"Deparazitari externe"),
        cat.dewE.map(d=>{const nd=new Date(d.date);nd.setMonth(nd.getMonth()+d.mo);return h("div",{key:d.id,style:{background:C.cardL,borderRadius:12,padding:12,marginBottom:8,border:`1px solid ${C.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4}},h("span",{style:{fontWeight:700,color:C.text}},d.prod),h(Badge,{col:C.amber},daysUntil(nd.toISOString().slice(0,10)))),
          h("div",{style:{fontSize:11,color:C.muted}},`${d.qty} · ${fmtDate(d.date)} · la ${d.mo} luni`));})),
      tab==="treat"&&h("div",null,
        cat.treat.length===0?h("div",{style:{color:C.muted,fontSize:13}},"Niciun tratament."):
        cat.treat.map(t=>h("div",{key:t.id,style:{background:C.cardL,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}},
          h("div",{style:{fontSize:14,fontWeight:700,color:C.text,marginBottom:8}},`💊 ${t.drug}`),
          h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:11}},
            h("div",null,h("span",{style:{color:C.muted}},"Doza: "),t.dose),
            h("div",null,h("span",{style:{color:C.muted}},"Frecventa: "),t.freq),
            h("div",null,h("span",{style:{color:C.muted}},"Inceput: "),fmtDate(t.start)),
            h("div",null,h("span",{style:{color:C.muted}},"Final: "),fmtDate(t.end)))))),
      tab==="cons"&&h("div",null,
        cat.cons.map(c=>h("div",{key:c.id,style:{background:C.cardL,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}},
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:7}},h("span",{style:{fontWeight:700,color:C.text}},`🩺 ${c.reason}`),h(Badge,{col:C.mint},`${c.cost} RON`)),
          h("div",{style:{fontSize:12,color:C.text,marginBottom:3}},c.diag),
          h("div",{style:{fontSize:11,color:C.muted}},c.recs)))),
      tab==="surg"&&h("div",null,
        cat.surg.length===0?h("div",{style:{color:C.muted,fontSize:13}},"Nicio interventie."):
        cat.surg.map(s=>h("div",{key:s.id,style:{background:C.cardL,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}},
          h("div",{style:{fontWeight:700,color:C.text,marginBottom:8}},`🏥 ${s.name}`),
          h("div",{style:{fontSize:11,color:C.muted}},`${fmtDate(s.date)} · ${s.clinic} · ${s.dr}`)))),
      tab==="anal"&&h("div",null,
        cat.anal.length===0?h("div",{style:{color:C.muted,fontSize:13}},"Nicio analiza."):
        cat.anal.map(a=>h("div",{key:a.id,style:{background:C.cardL,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}},
          h("div",{style:{fontWeight:700,color:C.text,marginBottom:6}},`🔬 ${a.type}`),
          h("div",{style:{fontSize:11}},h("span",{style:{color:C.muted}},fmtDate(a.date)+" · "),h("span",{style:{color:C.mint}},a.result))))),
      tab==="wt"&&h("div",null,
        h("div",{style:{fontSize:12,color:C.muted,marginBottom:8}},`Evolutie greutate — ${cat.name}`),
        h(MiniChart,{data:cat.wts}),
        h("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}},
          cat.wts.map((w,i)=>h("div",{key:i,style:{background:C.cardL,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px",textAlign:"center"}},
            h("div",{style:{fontSize:10,color:C.muted}},fmtDate(w.date)),
            h("div",{style:{fontSize:15,fontWeight:700,color:C.mint}},`${w.v} kg`)))))
    )
  );
}

// ---- CATS LIST ----
function CatsList({cats,onSel,onAdd,onShare}){
  return h("div",null,
    h("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:16}},
      h(Btn,{primary:true,onClick:onAdd},"+ Adauga pisica")),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}},
      cats.map(cat=>{
        const na=nextAct(cat);
        return h("div",{key:cat.id,style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:18,cursor:"pointer",transition:"border-color .2s",position:"relative"},
          onMouseEnter:e=>e.currentTarget.style.borderColor=C.mint,
          onMouseLeave:e=>e.currentTarget.style.borderColor=C.border},
          h("button",{onClick:e=>{e.stopPropagation();onShare(cat);},style:{position:"absolute",top:10,right:10,background:`${C.mint}18`,border:`1px solid ${C.mint}33`,borderRadius:8,padding:"4px 8px",color:C.mint,fontSize:10,fontWeight:700,cursor:"pointer"}},"PDF"),
          h("div",{onClick:()=>onSel(cat)},
            h("div",{style:{width:64,height:64,borderRadius:"50%",background:`${cat.bg}33`,border:`3px solid ${cat.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px"}},cat.ico),
            h("div",{style:{textAlign:"center"}},
              h("div",{style:{fontSize:16,fontWeight:800,color:C.text}},cat.name),
              h("div",{style:{fontSize:12,color:C.muted,margin:"3px 0 8px"}},cat.breed),
              h("div",{style:{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:10}},
                h(Badge,{col:C.blue},calcAge(cat.dob)),
                h(Badge,{col:cat.sex==="F"?C.purple:C.blue},cat.sex==="F"?"femela":"mascul"),
                h(Badge,{col:C.mint},`${cat.weight} kg`)),
              na&&h("div",{style:{background:`${na.col}18`,border:`1px solid ${na.col}44`,borderRadius:10,padding:"7px 8px",fontSize:11}},
                h("span",{style:{color:C.muted}},"Urmeaza: "),
                h("span",{style:{color:na.col,fontWeight:600}},na.label),
                h("div",{style:{color:C.muted,fontSize:10,marginTop:2}},daysUntil(na.date))))));
      })));
}

// ---- ADD CAT MODAL ----
function AddCat({onClose,onSave}){
  const [f,setF]=useState({name:"",breed:"",sex:"F",dob:"",weight:"",color:"",chip:"",steri:"false",vet:"",notes:"",ico:"🐱",bg:"#1D9E75"});
  const emos=["🐱","🐈","🦁","🐯","😸","😺","🐾","🦝"];
  const bgs=["#1D9E75","#BA7517","#185FA5","#993556","#3B6D11","#A32D2D"];
  function save(){
    if(!f.name)return;
    onSave({...f,id:Date.now(),steri:f.steri==="true",vax:[],dewI:[],dewE:[],treat:[],cons:[],surg:[],anal:[],wts:f.weight?[{date:new Date().toISOString().slice(0,10),v:parseFloat(f.weight)}]:[]});
    onClose();
  }
  return h("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.7)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16},onClick:onClose},
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:24,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto"},onClick:e=>e.stopPropagation()},
      h("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
        h("span",{style:{fontSize:16,fontWeight:800,color:C.text}},"🐱 Adauga pisica noua"),
        h("button",{onClick:onClose,style:{background:"none",border:"none",color:C.muted,fontSize:22,cursor:"pointer"}},"×")),
      h("div",{style:{marginBottom:14}},
        h("div",{style:{fontSize:10,color:C.muted,marginBottom:6,fontWeight:700}},"Emoji"),
        h("div",{style:{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}},
          emos.map(e=>h("button",{key:e,onClick:()=>setF(p=>({...p,ico:e})),style:{fontSize:20,background:f.ico===e?`${C.mint}33`:"none",border:`1px solid ${f.ico===e?C.mint:C.border}`,borderRadius:9,padding:"3px 7px",cursor:"pointer"}},e))),
        h("div",{style:{display:"flex",gap:7}},
          bgs.map(c=>h("button",{key:c,onClick:()=>setF(p=>({...p,bg:c})),style:{width:24,height:24,borderRadius:"50%",background:c,cursor:"pointer",border:`2px solid ${f.bg===c?"#fff":"transparent"}`}})))),
      h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}},
        h(Inp,{label:"Nume *",value:f.name,onChange:v=>setF(p=>({...p,name:v}))}),
        h(Inp,{label:"Rasa",value:f.breed,onChange:v=>setF(p=>({...p,breed:v}))}),
        h(Sel,{label:"Sex",value:f.sex,onChange:v=>setF(p=>({...p,sex:v})),options:[{v:"F",l:"Femela"},{v:"M",l:"Mascul"}]}),
        h(Inp,{label:"Data nasterii",value:f.dob,onChange:v=>setF(p=>({...p,dob:v})),type:"date"}),
        h(Inp,{label:"Greutate (kg)",value:f.weight,onChange:v=>setF(p=>({...p,weight:v})),type:"number"}),
        h(Inp,{label:"Culoare",value:f.color,onChange:v=>setF(p=>({...p,color:v}))}),
        h(Inp,{label:"Microcip",value:f.chip,onChange:v=>setF(p=>({...p,chip:v}))}),
        h(Sel,{label:"Sterilizata",value:f.steri,onChange:v=>setF(p=>({...p,steri:v})),options:[{v:"false",l:"Nu"},{v:"true",l:"Da"}]})),
      h(Inp,{label:"Veterinar",value:f.vet,onChange:v=>setF(p=>({...p,vet:v}))}),
      h("div",{style:{marginBottom:14}},
        h("div",{style:{fontSize:10,color:C.muted,marginBottom:4,fontWeight:700}},"Observatii"),
        h("textarea",{value:f.notes,onChange:e=>setF(p=>({...p,notes:e.target.value})),rows:2,style:{width:"100%",background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:13,outline:"none",resize:"vertical",boxSizing:"border-box"}})),
      h("button",{onClick:save,style:{background:C.mint,color:C.dark,border:"none",borderRadius:12,padding:"11px 20px",fontSize:14,fontWeight:700,cursor:"pointer",width:"100%",marginTop:8}},"Salveaza pisica")
    )
  );
}

// ---- DASHBOARD ----
function Dashboard({cats,meds}){
  const allNext=cats.flatMap(cat=>{const n=nextAct(cat);return n?[{...n,cn:cat.name,ci:cat.ico}]:[];}).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const expM=meds.filter(m=>new Date(m.exp)<new Date());
  const lowM=meds.filter(m=>m.qty<=2&&new Date(m.exp)>=new Date());
  return h("div",null,
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:20}},
      [{l:"Pisici",v:cats.length,i:"🐱",c:C.mint},
       {l:"Actiuni",v:allNext.length,i:"📅",c:C.blue},
       {l:"Vax expira",v:cats.flatMap(c=>c.vax).filter(v=>v.next&&!daysUntil(v.next).includes("urma")&&parseInt(daysUntil(v.next))<30).length,i:"💉",c:C.amber},
       {l:"Alerte stoc",v:expM.length+lowM.length,i:"⚠️",c:C.red}]
      .map((s,i)=>h("div",{key:i,style:{background:C.card,border:`1px solid ${s.c}33`,borderRadius:14,padding:"14px 12px"}},
        h("div",{style:{fontSize:22,marginBottom:6}},s.i),
        h("div",{style:{fontSize:26,fontWeight:800,color:s.c}},s.v),
        h("div",{style:{fontSize:11,color:C.muted,marginTop:2}},s.l)))),
    h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}},
      h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16}},
        h("div",{style:{fontSize:11,fontWeight:700,color:C.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:1}},"Urmatoarele actiuni"),
        allNext.length===0?h("div",{style:{color:C.muted,fontSize:13}},"Nicio actiune 🎉"):
        allNext.slice(0,4).map((n,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}},
          h("span",{style:{fontSize:18}},n.ci),
          h("div",{style:{flex:1}},h("div",{style:{fontSize:12,color:C.text,fontWeight:600}},n.label),h("div",{style:{fontSize:10,color:C.muted}},n.cn)),
          h(Badge,{col:n.col},daysUntil(n.date))))),
      h("div",{style:{display:"flex",flexDirection:"column",gap:10}},
        h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16,flex:1}},
          h("div",{style:{fontSize:11,fontWeight:700,color:C.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:1}},"Notificari recente"),
          NOTIFS_INIT.slice(0,3).map((n,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}},
            h("span",{style:{width:28,height:28,borderRadius:8,background:`${n.col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}},n.ico),
            h("div",{style:{flex:1}},h("div",{style:{fontSize:11,color:C.text}},n.txt),h("div",{style:{fontSize:10,color:C.muted}},n.time))))),
        h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:16}},
          h("div",{style:{fontSize:11,fontWeight:700,color:C.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:1}},"Stoc medicamente"),
          meds.map((m,i)=>{const exp=new Date(m.exp)<new Date(),low=m.qty<=2;
            return h("div",{key:i,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0"}},
              h("span",{style:{fontSize:12,color:C.text}},m.name),
              h("div",{style:{display:"flex",gap:5}},
                h(Badge,{col:low||exp?C.red:C.mint},`${m.qty} ${m.unit}`),
                exp&&h(Badge,{col:C.red},"expirat")));})
        )
      )
    )
  );
}

// ---- HISTORY PAGE ----
function HistPage({cats,customEvents}){
  const [filter,setFilter]=useState("all");
  const [fc,setFc]=useState("all");
  const all=[];
  const fca=fc==="all"?cats:cats.filter(c=>c.id===parseInt(fc));
  fca.forEach(cat=>{
    cat.vax.forEach(v=>all.push({date:v.date,type:"vax",label:`Vaccin ${v.name}`,cat:cat.name,ico:"💉",col:C.mint}));
    cat.dewI.forEach(d=>all.push({date:d.date,type:"dew",label:`Dep.int. ${d.prod}`,cat:cat.name,ico:"🪱",col:C.blue}));
    cat.dewE.forEach(d=>all.push({date:d.date,type:"dew",label:`Dep.ext. ${d.prod}`,cat:cat.name,ico:"🐛",col:C.amber}));
    cat.treat.forEach(t=>all.push({date:t.start,type:"treat",label:`Tratament ${t.drug}`,cat:cat.name,ico:"💊",col:C.purple}));
    cat.cons.forEach(c=>all.push({date:"2025-04-20",type:"cons",label:`Consultatie: ${c.reason}`,cat:cat.name,ico:"🩺",col:C.blue}));
    cat.surg.forEach(s=>all.push({date:s.date,type:"surg",label:`Interventie: ${s.name}`,cat:cat.name,ico:"🏥",col:C.red}));
    cat.anal.forEach(a=>all.push({date:a.date,type:"anal",label:`Analiza: ${a.type}`,cat:cat.name,ico:"🔬",col:C.mint}));
  });
  (customEvents||[]).filter(e=>fc==="all"||fca.map(c=>c.id).includes(e.catId)).forEach(e=>{
    const et=EVT_TYPES.find(t=>t.id===e.type)||EVT_TYPES[0],cn=cats.find(c=>c.id===e.catId);
    all.push({date:e.date,type:e.type,label:e.title,cat:cn?.name||"",ico:et.ico,col:et.col});
  });
  const shown=all.filter(e=>filter==="all"||e.type===filter).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const filters=[{id:"all",l:"Toate"},{id:"vax",l:"Vaccinuri"},{id:"treat",l:"Tratamente"},{id:"cons",l:"Consultatii"},{id:"anal",l:"Analize"}];
  return h("div",null,
    h("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,alignItems:"center",justifyContent:"space-between"}},
      h("div",{style:{display:"flex",gap:5,flexWrap:"wrap"}},
        filters.map(f=>h("button",{key:f.id,onClick:()=>setFilter(f.id),style:{background:filter===f.id?C.mint:C.card,color:filter===f.id?C.dark:C.muted,border:`1px solid ${filter===f.id?C.mint:C.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,fontWeight:filter===f.id?700:400,cursor:"pointer"}},f.l))),
      h("select",{value:fc,onChange:e=>setFc(e.target.value),style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"5px 10px",color:C.text,fontSize:11,cursor:"pointer"}},
        h("option",{value:"all"},"Toate pisicile"),
        cats.map(c=>h("option",{key:c.id,value:c.id},`${c.ico} ${c.name}`)))),
    h("div",{style:{paddingLeft:22,position:"relative"}},
      h("div",{style:{position:"absolute",left:8,top:0,bottom:0,width:2,background:`${C.mint}44`}}),
      shown.map((ev,i)=>h("div",{key:i,style:{position:"relative",marginBottom:10}},
        h("div",{style:{position:"absolute",left:-22,top:12,width:12,height:12,borderRadius:"50%",background:ev.col,border:`2px solid ${C.dark}`}}),
        h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}},
          h("span",{style:{fontSize:17}},ev.ico),
          h("div",{style:{flex:1}},h("div",{style:{fontSize:12,fontWeight:700,color:C.text}},ev.label),h("div",{style:{fontSize:10,color:C.muted}},ev.cat)),
          h("div",{style:{fontSize:11,color:C.muted}},fmtDate(ev.date))))),
      shown.length===0&&h("div",{style:{color:C.muted,fontSize:13,paddingLeft:8}},"Niciun eveniment.")));
}

// ---- NOTIFICATIONS PAGE ----
function NotifPage(){
  const [cfg,setCfg]=useState(loadState("notif_cfg",{d1:true,d3:true,d7:true,email:false,push:true}));
  useEffect(()=>saveState("notif_cfg",cfg),[cfg]);
  return h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}},
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:18}},
      h("div",{style:{fontSize:13,fontWeight:700,color:C.text,marginBottom:14}},"⚙️ Configurare remindere"),
      [["d1","Cu 1 zi inainte"],["d3","Cu 3 zile inainte"],["d7","Cu 7 zile inainte"],["email","Notificari email"],["push","Push notifications"]].map(([k,l])=>
        h("div",{key:k,style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}},
          h("span",{style:{fontSize:12,color:C.text}},l),
          h("div",{onClick:()=>setCfg(p=>({...p,[k]:!p[k]})),style:{width:40,height:22,borderRadius:11,background:cfg[k]?C.mint:C.cardL,border:`1px solid ${cfg[k]?C.mint:C.border}`,position:"relative",cursor:"pointer"}},
            h("div",{style:{position:"absolute",top:3,left:cfg[k]?18:3,width:14,height:14,borderRadius:"50%",background:cfg[k]?C.dark:"#fff",transition:"left .2s"}}))))),
    h("div",{style:{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:18}},
      h("div",{style:{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}},"Notificari"),
      NOTIFS_INIT.map((n,i)=>h("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<NOTIFS_INIT.length-1?`1px solid ${C.border}`:"none"}},
        h("span",{style:{width:30,height:30,borderRadius:8,background:`${n.col}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}},n.ico),
        h("div",{style:{flex:1}},h("div",{style:{fontSize:11,color:C.text}},n.txt),h("div",{style:{fontSize:10,color:C.muted}},n.time)),
        h(Badge,{col:n.col},n.type)))));
}

// ---- MEDS PAGE ----
function MedsPage({meds,setMeds}){
  const [form,setForm]=useState({name:"",qty:"",unit:"comprimate",exp:""});
  const [adding,setAdding]=useState(false);
  function add(){
    if(!form.name||!form.qty)return;
    const newMeds=[...meds,{id:Date.now(),...form,qty:parseInt(form.qty)}];
    setMeds(newMeds);
    saveState("meds",newMeds);
    setForm({name:"",qty:"",unit:"comprimate",exp:""});
    setAdding(false);
  }
  return h("div",null,
    h("div",{style:{display:"flex",justifyContent:"flex-end",marginBottom:14}},
      h(Btn,{primary:true,onClick:()=>setAdding(a=>!a)},"+ Adauga medicament")),
    adding&&h("div",{style:{background:C.card,border:`1px solid ${C.mint}44`,borderRadius:14,padding:16,marginBottom:16}},
      h("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:10}},
        h("input",{placeholder:"Denumire",value:form.name,onChange:e=>setForm(p=>({...p,name:e.target.value})),style:{background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:12,outline:"none"}}),
        h("input",{placeholder:"Cant.",type:"number",value:form.qty,onChange:e=>setForm(p=>({...p,qty:e.target.value})),style:{background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:12,outline:"none"}}),
        h("select",{value:form.unit,onChange:e=>setForm(p=>({...p,unit:e.target.value})),style:{background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:12,outline:"none"}},
          ["comprimate","pipete","flacoane","cutii"].map(u=>h("option",{key:u,value:u},u))),
        h("input",{type:"date",value:form.exp,onChange:e=>setForm(p=>({...p,exp:e.target.value})),style:{background:C.cardL,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.text,fontSize:12,outline:"none"}})),
      h(Btn,{primary:true,onClick:add},"Salveaza")),
    h("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}},
      meds.map(m=>{
        const exp=new Date(m.exp)<new Date(),low=m.qty<=2,dl=Math.ceil((new Date(m.exp)-new Date())/86400000);
        return h("div",{key:m.id,style:{background:C.card,border:`1px solid ${exp?C.red:low?C.amber:C.border}`,borderRadius:16,padding:18}},
          h("div",{style:{fontSize:15,fontWeight:800,color:C.text,marginBottom:10}},`💊 ${m.name}`),
          h("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:6}},
            h("span",{style:{fontSize:11,color:C.muted}},"Cantitate"),
            h(Badge,{col:low||exp?C.red:C.mint},`${m.qty} ${m.unit}`)),
          h("div",{style:{display:"flex",justifyContent:"space-between"}},
            h("span",{style:{fontSize:11,color:C.muted}},"Expira"),
            h(Badge,{col:exp?C.red:dl<30?C.amber:C.mint},exp?"expirat":dl<30?`${dl} zile`:fmtDate(m.exp))),
          (exp||low)&&h("div",{style:{marginTop:10,padding:"6px 8px",background:exp?C.redBg:C.amberBg,borderRadius:8,fontSize:10,color:exp?C.red:C.amber,fontWeight:700}},
            exp?"⚠️ Medicament expirat!":"⚠️ Stoc redus"));
      })));
}

// ---- MAIN APP ----
function App(){
  const [cats,setCats]=useState(()=>loadState("cats",CATS_INIT));
  const [meds,setMeds]=useState(()=>loadState("meds",MEDS_INIT));
  const [customEvents,setCustomEvents]=useState(()=>loadState("events",[]));
  const [page,setPage]=useState("dash");
  const [selCat,setSelCat]=useState(null);
  const [addCat,setAddCat]=useState(false);
  const [shareCat,setShareCat]=useState(null);
  const [notifN,setNotifN]=useState(4);
  const [mobileMenu,setMobileMenu]=useState(false);

  useEffect(()=>saveState("cats",cats),[cats]);
  useEffect(()=>saveState("meds",meds),[meds]);
  useEffect(()=>saveState("events",customEvents),[customEvents]);

  const nav=[
    {id:"dash",l:"Dashboard",i:"🏠"},
    {id:"cats",l:"Pisicile mele",i:"🐱"},
    {id:"cal",l:"Calendar",i:"📅"},
    {id:"hist",l:"Istoric",i:"📋"},
    {id:"notif",l:"Notificari",i:"🔔",badge:notifN},
    {id:"meds",l:"Medicamente",i:"💊"}
  ];

  function go(id){setPage(id);setSelCat(null);if(id==="notif")setNotifN(0);setMobileMenu(false);}
  const title=selCat?`Fisa lui ${selCat.name}`:nav.find(n=>n.id===page)?.l||"CatCare";

  // Mobile bottom nav
  const bottomNav=h("div",{style:{position:"fixed",bottom:0,left:0,right:0,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:50,paddingBottom:"env(safe-area-inset-bottom)"}},
    nav.map(n=>h("button",{key:n.id,onClick:()=>go(n.id),style:{flex:1,background:"none",border:"none",padding:"10px 4px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}},
      h("span",{style:{fontSize:18,position:"relative"}},n.i,n.badge>0&&h("span",{style:{position:"absolute",top:-4,right:-6,background:C.red,color:"#fff",fontSize:8,width:14,height:14,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}},n.badge)),
      h("span",{style:{fontSize:9,color:page===n.id?C.mint:C.muted,fontWeight:page===n.id?700:400}},n.l)))
  );

  return h("div",{style:{display:"flex",minHeight:"100vh",background:C.dark,position:"relative",overflow:"hidden",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}},
    // Desktop sidebar
    h("div",{style:{width:200,background:C.card,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"16px 0",flexShrink:0,"@media(max-width:640px)":{display:"none"}}},
      h("div",{style:{padding:"0 16px 16px",borderBottom:`1px solid ${C.border}`,marginBottom:10,display:"flex",alignItems:"center",gap:10}},
        h("div",{style:{width:34,height:34,borderRadius:10,background:C.mintBg,border:`1px solid ${C.mint}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}},"🐾"),
        h("div",null,h("div",{style:{fontSize:15,fontWeight:800,color:C.text}},"CatCare"),h("div",{style:{fontSize:9,color:C.muted}},"Carnet digital"))),
      h("div",{style:{padding:"0 8px",flex:1}},
        nav.map(n=>h("button",{key:n.id,onClick:()=>go(n.id),style:{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:10,cursor:"pointer",fontSize:12,background:page===n.id?C.mintBg:"none",color:page===n.id?C.mint:C.muted,border:`1px solid ${page===n.id?C.mint+"44":"transparent"}`,fontWeight:page===n.id?700:400,width:"100%",textAlign:"left",marginBottom:3}},
          h("span",{style:{fontSize:14}},n.i),h("span",{style:{flex:1}},n.l),
          n.badge>0&&h("span",{style:{background:C.red,color:"#fff",fontSize:9,padding:"1px 5px",borderRadius:10,fontWeight:700}},n.badge)))),
      h("div",{style:{padding:"10px 14px",borderTop:`1px solid ${C.border}`}},
        h("div",{style:{fontSize:9,color:C.muted,marginBottom:7,fontWeight:700,textTransform:"uppercase",letterSpacing:.8}},"Pisici"),
        cats.map(cat=>h("button",{key:cat.id,onClick:()=>{setPage("cats");setSelCat(cat);},style:{display:"flex",alignItems:"center",gap:7,padding:"5px 7px",borderRadius:18,cursor:"pointer",background:"none",border:"none",width:"100%",textAlign:"left",color:selCat?.id===cat.id?C.mint:C.muted,fontSize:11}},
          h("div",{style:{width:20,height:20,borderRadius:"50%",background:`${cat.bg}33`,border:`1.5px solid ${cat.bg}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}},cat.ico),cat.name)),
        h("button",{onClick:()=>{setPage("cats");setAddCat(true);},style:{display:"flex",alignItems:"center",gap:7,padding:"5px 7px",borderRadius:18,cursor:"pointer",background:"none",border:"none",width:"100%",textAlign:"left",color:C.mint,fontSize:11,marginTop:3}},
          h("span",{style:{width:20,height:20,borderRadius:"50%",border:`1.5px dashed ${C.mint}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}},"+"),"Adauga"))),
    // Main content
    h("div",{style:{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",paddingBottom:70}},
      h("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:10}},
        h("div",null,
          h("div",{style:{fontSize:17,fontWeight:800,color:C.text}},title),
          h("div",{style:{fontSize:11,color:C.muted}},new Date().toLocaleDateString("ro-RO",{weekday:"long",year:"numeric",month:"long",day:"numeric"}))),
        selCat&&h("button",{onClick:()=>setShareCat(selCat),style:{background:`${C.mint}18`,border:`1px solid ${C.mint}44`,borderRadius:10,padding:"7px 12px",color:C.mint,fontSize:11,fontWeight:700,cursor:"pointer"}},"📄 PDF")),
      h("div",{style:{padding:16,flex:1}},
        page==="dash"&&h(Dashboard,{cats,meds}),
        page==="cats"&&!selCat&&h(CatsList,{cats,onSel:c=>setSelCat(c),onAdd:()=>setAddCat(true),onShare:cat=>setShareCat(cat)}),
        page==="cats"&&selCat&&h(CatProfile,{cat:selCat,onBack:()=>setSelCat(null),customEvents,onShare:()=>setShareCat(selCat)}),
        page==="cal"&&h(CalendarPage,{cats,customEvents,setCustomEvents}),
        page==="hist"&&h(HistPage,{cats,customEvents}),
        page==="notif"&&h(NotifPage,null),
        page==="meds"&&h(MedsPage,{meds,setMeds}))),
    // Mobile bottom nav
    bottomNav,
    // Modals
    addCat&&h(AddCat,{onClose:()=>setAddCat(false),onSave:cat=>{const nc=[...cats,cat];setCats(nc);saveState("cats",nc);setAddCat(false);}}),
    shareCat&&h(ShareModal,{cat:shareCat,customEvents,onClose:()=>setShareCat(null)})
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(h(App,null));