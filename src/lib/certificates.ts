import crypto from 'crypto';

export type CertificateData = {
  certificateId: string;
  name: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  cpm: number;
  wordsTyped: number;
  correctWords: number;
  incorrectWords: number;
  mistakes: number;
  backspaces: number;
  elapsedTime: string;
  duration: string;
  difficulty: string;
  grade: string;
  issuedOn: string;
};

function getSecret() {
  return process.env.CERTIFICATE_SECRET || 'replace-this-with-a-long-production-secret';
}

function sign(payload: string) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function makeCertificateId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const random = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `TW-${date}-${random}`;
}

export function createVerificationToken(data: CertificateData) {
  const payload = Buffer.from(JSON.stringify(data), 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyCertificateToken(token: string): CertificateData | null {
  try {
    const separator = token.lastIndexOf('.');
    if (separator < 1) return null;

    const payload = token.slice(0, separator);
    const signature = token.slice(separator + 1);
    const expected = sign(payload);

    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as CertificateData;
  } catch {
    return null;
  }
}
