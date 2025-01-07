import crypto from 'crypto';

export default class CryptoHelper {
    public static rot13Cipher(str: string): string {
      return str.replace(/[a-zA-Z]/g, (c) => {
        const charCode = c.charCodeAt(0);
        const isUpperCase = charCode >= 65 && charCode <= 90;
        const shiftedCharCode = isUpperCase
          ? ((charCode - 65 + 13) % 26) + 65
          : ((charCode - 97 + 13) % 26) + 97;
        return String.fromCharCode(shiftedCharCode);
      });
    }
  
    public static generateSignedToken(data: string, expirationTime: number, label: string, secretKey: string | undefined): string {
      if (!secretKey) {
        throw new Error("Secret key is required to generate a signed token.");
      }
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(`${data}:${expirationTime}:${label}`);
      const signature = hmac.digest('hex');
      return `${data}.${expirationTime}.${label}.${signature}`;
    }
  
    public static verifySignedToken(token: string, secretKey: string | undefined): { data: string; expirationTime: number; label: string; } | null {
      if (!secretKey) {
        throw new Error("Secret key is required to verify a signed token.");
      }
      const [data, expirationTime, label, signature] = token.split('.');
      if (!data || !expirationTime || !label || !signature) {
        return null;
      }
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(`${data}:${expirationTime}:${label}`);
      const expectedSignature = hmac.digest('hex');
      if (signature !== expectedSignature) {
        return null;
      }
      return {
        data,
        expirationTime: parseInt(expirationTime, 10),
        label,
      };
    }
  }
  