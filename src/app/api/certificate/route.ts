import { NextResponse } from 'next/server';
import { createVerificationToken, makeCertificateId, type CertificateData } from '@/lib/certificates';

const finiteNumber=(value:unknown,fallback=0)=>{
  const n=typeof value==='number'?value:Number(value);
  return Number.isFinite(n)?n:fallback;
};

const safeInt=(value:unknown,fallback=0)=>Math.max(0,Math.floor(finiteNumber(value,fallback)));
const sanitizeName=(value:unknown)=>String(value ?? '').replace(/[^a-zA-Z\s]/g,'').replace(/\s+/g,' ').trim().slice(0,80);

const safeTime=(value:unknown)=>{
  if(typeof value==='string' && value.includes(':')){
    const [minutes,seconds]=value.split(':').map(Number);
    if(Number.isFinite(minutes)&&Number.isFinite(seconds)){
      const total=Math.max(0,Math.floor(minutes*60+seconds));
      return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
    }
  }
  const total=safeInt(value,0);
  return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const certificate: CertificateData = {
      certificateId: makeCertificateId(),
      name: sanitizeName(body.name) || 'Typing Champion',
      netWpm: finiteNumber(body.netWpm),
      grossWpm: finiteNumber(body.grossWpm),
      accuracy: Math.max(0, Math.min(100, finiteNumber(body.accuracy))),
      cpm: finiteNumber(body.cpm),
      wordsTyped: safeInt(body.wordsTyped),
      correctWords: safeInt(body.correctWords),
      incorrectWords: safeInt(body.incorrectWords),
      mistakes: safeInt(body.mistakes),
      backspaces: safeInt(body.backspaces ?? body.backspacesUsed),
      elapsedTime: safeTime(body.elapsedTime),
      duration: `${Math.max(1, safeInt(body.testDuration, 1))}m`,
      difficulty: body.difficulty === 'medium' || body.difficulty === 'hard' ? body.difficulty : 'easy',
      grade: typeof body.grade === 'string' && body.grade.trim() ? body.grade.trim().slice(0, 4) : 'D',
      issuedOn: new Date().toISOString(),
    };
    const token = createVerificationToken(certificate);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    return NextResponse.json({ certificate, verifyUrl: `${baseUrl}/verify/${token}` });
  } catch {
    return NextResponse.json({ error: 'Unable to create certificate.' }, { status: 400 });
  }
}
