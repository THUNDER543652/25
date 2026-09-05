'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArrowLeft, CheckCircle2, Download, Loader2, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

type ResultData = {
  netWpm:number; grossWpm:number; cpm:number; accuracy:number; mistakes:number; elapsedTime:number;
  testDuration:number; wordsTyped:number; correctWords:number; incorrectWords:number; backspacesUsed:number;
  grade:string; difficulty:'easy'|'medium'|'hard';
};
type CertificateData = {
  name:string;
  certificateId:string;
  issuedOn:string;
  verifyUrl:string;
  netWpm:number;
  grossWpm:number;
  cpm:number;
  accuracy:number;
  mistakes:number;
  wordsTyped:number;
  correctWords:number;
  incorrectWords:number;
  backspaces:number;
  elapsedTime:string;
  duration:string;
  difficulty:'easy'|'medium'|'hard';
  grade:string;
};

const fallback:ResultData={netWpm:72,grossWpm:76,cpm:384,accuracy:96,mistakes:4,elapsedTime:60,testDuration:1,wordsTyped:76,correctWords:73,incorrectWords:3,backspacesUsed:8,grade:'A',difficulty:'easy'};

// Certificate names intentionally accept letters and spaces only.
const sanitizeCertificateName=(value:string)=>value.replace(/[^a-zA-Z\s]/g,'').replace(/\s+/g,' ').slice(0,80);

const finiteNumber=(value:unknown,fallbackValue=0)=>{
  const n=typeof value==='number'?value:Number(value);
  return Number.isFinite(n)?n:fallbackValue;
};

const formatTime=(value:unknown)=>{
  const numeric=finiteNumber(value,0);
  if(typeof value==='string' && value.includes(':')){
    const [minutes,seconds]=value.split(':').map(Number);
    if(Number.isFinite(minutes)&&Number.isFinite(seconds)){
      const total=Math.max(0,Math.floor(minutes*60+seconds));
      return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
    }
  }
  const total=Math.max(0,Math.floor(numeric));
  return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
};

const normalizeResult=(value:Record<string,unknown>):ResultData=>({
  netWpm:finiteNumber(value.netWpm,fallback.netWpm),
  grossWpm:finiteNumber(value.grossWpm,fallback.grossWpm),
  cpm:finiteNumber(value.cpm,fallback.cpm),
  accuracy:Math.max(0,Math.min(100,finiteNumber(value.accuracy,fallback.accuracy))),
  mistakes:Math.max(0,Math.floor(finiteNumber(value.mistakes,fallback.mistakes))),
  elapsedTime:typeof value.elapsedTime==='string' ? (formatTime(value.elapsedTime)==='0:00' && value.elapsedTime!=='0:00' ? fallback.elapsedTime : Math.max(0,Math.floor(finiteNumber(value.elapsedTime,0)))) : Math.max(0,Math.floor(finiteNumber(value.elapsedTime,fallback.elapsedTime))),
  testDuration:Math.max(1,Math.floor(finiteNumber(value.testDuration,fallback.testDuration))),
  wordsTyped:Math.max(0,Math.floor(finiteNumber(value.wordsTyped,fallback.wordsTyped))),
  correctWords:Math.max(0,Math.floor(finiteNumber(value.correctWords,fallback.correctWords))),
  incorrectWords:Math.max(0,Math.floor(finiteNumber(value.incorrectWords,fallback.incorrectWords))),
  backspacesUsed:Math.max(0,Math.floor(finiteNumber(value.backspacesUsed,fallback.backspacesUsed))),
  grade:typeof value.grade==='string' && value.grade.trim() ? value.grade.trim().slice(0,4) : fallback.grade,
  difficulty:value.difficulty==='medium'||value.difficulty==='hard'||value.difficulty==='easy' ? value.difficulty : fallback.difficulty,
});

function Metric({value,label,color,icon}:{value:string|number;label:string;color:string;icon:string}) {
  return <div className="tw-cert-metric">
    <img className="tw-cert-metric-icon" src={`/certificate-icons/${icon}.png`} alt="" aria-hidden="true"/>
    <strong style={{color}}>{value}</strong><span>{label}</span>
  </div>;
}

const Certificate=forwardRef<HTMLDivElement,{data:CertificateData;qrDataUrl:string}>(function Certificate({data,qrDataUrl},ref){
  const details=[
    ['WORDS TYPED',data.wordsTyped,'words-typed'],
    ['CORRECT WORDS',data.correctWords,'correct-words'],
    ['INCORRECT WORDS',data.incorrectWords,'incorrect-words'],
    ['MISTAKES',data.mistakes,'mistakes'],
    ['BACKSPACES',data.backspaces,'backspaces'],
    ['ELAPSED TIME',formatTime(data.elapsedTime),'elapsed-time'],
    ['DURATION',data.duration,'duration'],
    ['DIFFICULTY',data.difficulty.toUpperCase(),'difficulty'],
  ] as const;
  return <div ref={ref} className="tw-certificate">
    <div className="tw-cert-corner tw-cert-corner-a"/><div className="tw-cert-corner tw-cert-corner-b"/>
    <div className="tw-cert-ribbon"><div className="tw-cert-ribbon-star">★</div><div>VERIFIED</div><div>CERTIFICATE</div><div className="tw-cert-ribbon-stars">★ ★ ★</div></div>
    <div className="tw-cert-brand"><img src="/assests/images/testappara-logo.png" alt="TestAppara" className="tw-cert-logo"/></div>
    <h1>TYPING SPEED CERTIFICATE</h1><div className="tw-cert-subtitle">THIS CERTIFIES THE COMPLETION OF A TYPING SPEED TEST</div><div className="tw-cert-stars">★ ★ ★</div>
    <div className="tw-cert-metrics">
      <Metric value={data.netWpm} label="Net WPM" color="#00d9ff" icon="net-wpm"/><Metric value={data.grossWpm} label="Gross WPM" color="#a66cff" icon="gross-wpm"/>
      <div className="tw-cert-grade"><span>GRADE</span><strong>{data.grade}</strong><div>❧ ★ ❧</div></div>
      <Metric value={`${data.accuracy}%`} label="Accuracy" color="#25d45b" icon="accuracy"/><Metric value={data.cpm} label="CPM" color="#ffad00" icon="cpm"/>
    </div>
    <div className="tw-cert-details">{details.map(([label,value,icon])=><div className="tw-cert-detail" key={String(label)}><img className="tw-cert-detail-icon" src={`/certificate-icons/${icon}.png`} alt="" aria-hidden="true"/><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="tw-cert-bottom">
      <div className="tw-cert-signature"><div className="tw-cert-script">Test Appara</div><div className="tw-cert-rule"/><div>Test Appara</div><small>Official Evaluator</small></div>
      <div className="tw-cert-seal"><span>★ ★ ★</span><b>CERTIFICATE</b><b>OF</b><b>ACHIEVEMENT</b><span>★ ★ ★</span></div>
      <div className="tw-cert-qr"><img src={qrDataUrl} alt="Unique certificate verification QR code"/><div><strong>SCAN TO VERIFY</strong><span>Certificate ID</span><b>{data.certificateId}</b><span>Verify online at</span><b>TestAppara</b></div></div>
    </div>
    <div className="tw-cert-footer">
      <div><img src="/certificate-icons/issued.png" alt="" aria-hidden="true"/><label>ISSUED ON<strong>{new Date(data.issuedOn).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</strong></label></div>
      <div><img src="/certificate-icons/valid.png" alt="" aria-hidden="true"/><label>THIS CERTIFICATE IS VALID AND<strong>VERIFIABLE ONLINE</strong></label></div>
      <div><img src="/certificate-icons/website.png" alt="" aria-hidden="true"/><label>testappara.tools.com</label></div>
    </div>
  </div>;
});

export default function CertificateGenerator(){
  const previewRef=useRef<HTMLDivElement>(null);
  const [result,setResult]=useState(fallback),[name,setName]=useState(''),[certificate,setCertificate]=useState<CertificateData|null>(null);
  const [qr,setQr]=useState(''),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false);

  useEffect(()=>{
    try{
      const s=sessionStorage.getItem('testappara:typing-result');
      if(s){
        const parsed=JSON.parse(s) as Record<string,unknown>;
        setResult(normalizeResult(parsed));
      }
    }catch{}
    setLoaded(true);
  },[]);
  async function generateCertificate(){
    setBusy(true);
    try{
      const safeResult=normalizeResult(result);
      setResult(safeResult);
      const r=await fetch('/api/certificate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...safeResult,name:sanitizeCertificateName(name).trim()||'Typing Champion',elapsedTime:formatTime(safeResult.elapsedTime),duration:`${safeResult.testDuration}m`,backspaces:safeResult.backspacesUsed})});
      if(!r.ok)throw new Error();
      const payload=await r.json();
      setCertificate(payload.certificate);
      setQr(await QRCode.toDataURL(payload.verifyUrl,{width:500,margin:1,errorCorrectionLevel:'H',color:{dark:'#02070d',light:'#ffffff'}}));
    }catch{alert('Unable to generate the certificate right now. Please try again.')}finally{setBusy(false)}
  }
  async function downloadPdf(){
    if(!previewRef.current||!certificate)return;
    setBusy(true);
    try{
      const canvas=await html2canvas(previewRef.current,{scale:2,backgroundColor:'#02070d',useCORS:true,logging:false});
      const pdf=new jsPDF({orientation:'landscape',unit:'pt',format:[1080,802.2857],compress:true});
      pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,1080,802.2857,undefined,'FAST');
      pdf.save(`${certificate.certificateId}.pdf`);
    }finally{setBusy(false)}
  }
  if(!loaded)return null;
  return <main className="min-h-screen overflow-x-hidden bg-background">
    <div className="border-b border-border bg-background/90 backdrop-blur-xl"><div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
      <Link href="/typing-speed-test" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition hover:text-primary"><ArrowLeft className="h-4 w-4"/> Back to Typing Test</Link>
      <div className="text-sm font-bold text-foreground">Test<span className="text-primary">Appara</span> <span className="ml-2 text-foreground/35">Certificate Studio</span></div>
    </div></div>
    <section className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 lg:px-8"><div className="max-w-3xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-primary"><Sparkles className="h-3.5 w-3.5"/> Premium Certificate Generator</div>
      <h1 className="text-hero-sm font-bold text-foreground">Turn your typing result into a <span className="text-primary glow-text-cyan">verified certificate.</span></h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Your test result is already loaded. Add the recipient name, generate the certificate, and download the high-resolution PDF.</p>
    </div></section>
    <section className="mx-auto grid max-w-[1440px] gap-6 px-5 pb-20 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8">
      <aside className="h-max rounded-2xl border border-border bg-foreground/[0.035] p-5 shadow-xl backdrop-blur-xl">
        <div className="mb-5 text-sm font-bold text-foreground">Certificate details</div>
        <label className="mb-4 block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recipient name</span><input value={name} onChange={e=>setName(sanitizeCertificateName(e.target.value))} placeholder="Enter certificate name" maxLength={80} autoComplete="name" inputMode="text" pattern="[A-Za-z ]+" title="Letters and spaces only" className="w-full rounded-xl border border-border bg-black/20 px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10"/><span className="mt-1.5 block text-[10px] text-muted-foreground/60">Letters and spaces only.</span></label>
        <div className="space-y-2 rounded-2xl border border-border bg-black/15 p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Test result</div>
          {([['Net WPM',result.netWpm],['Gross WPM',result.grossWpm],['Accuracy',`${result.accuracy}%`],['CPM',result.cpm],['Grade',result.grade],['Difficulty',result.difficulty.toUpperCase()]] as const).map(([k,v])=><div key={k} className="flex justify-between text-sm"><span className="text-foreground/45">{k}</span><b className={k==='Grade'?'text-primary':''}>{v}</b></div>)}
        </div>
        <button onClick={generateCertificate} disabled={busy} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-extrabold text-black transition hover:brightness-110 disabled:opacity-60">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<ShieldCheck className="h-4 w-4"/>}{busy?'Generating…':'Generate certificate'}</button>
        {certificate&&<><button onClick={downloadPdf} disabled={busy} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition hover:bg-primary/10"><Download className="h-4 w-4"/> Download PDF</button>
        <button onClick={()=>{setCertificate(null);setQr('');setName('')}} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-foreground/50 transition hover:text-foreground"><RefreshCw className="h-3.5 w-3.5"/> Generate another</button>
        <div className="mt-4 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-xs text-emerald-300"><div className="flex items-center gap-2 font-bold"><CheckCircle2 className="h-4 w-4"/> Unique QR generated</div><div className="mt-1 break-all text-emerald-200/60">{certificate.certificateId}</div></div></>}
      </aside>
      <div className="min-w-0 overflow-auto rounded-2xl border border-border bg-foreground/[0.02] p-3 md:p-5"><div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-foreground/35"><span>Live certificate preview</span>{certificate&&<span className="text-emerald-400">● Verified QR ready</span>}</div>
        {certificate?<div className="tw-certificate-viewport"><Certificate ref={previewRef} data={certificate} qrDataUrl={qr}/></div>:<div className="flex min-h-[640px] items-center justify-center rounded-xl border border-dashed border-border bg-black/10 text-center"><div><div className="text-6xl font-black text-primary/80">TW</div><h2 className="mt-3 text-lg font-bold text-foreground">Your certificate appears here</h2><p className="mt-2 max-w-md text-sm text-foreground/35">Generate the certificate to create its unique ID, QR verification link, and PDF.</p></div></div>}
      </div>
    </section>
  </main>;
}
