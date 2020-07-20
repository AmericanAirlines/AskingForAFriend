/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import crypto from 'crypto';

export function createHash(body: any, timestamp: number, signingSecret: string): string {
  const bodyString = JSON.stringify(body);
  const signatureString = `v0:${timestamp}:${bodyString}`;
  const hash = crypto.createHmac('sha256', signingSecret).update(signatureString, 'utf8').digest('hex');
  return `v0=${hash}`;
}
