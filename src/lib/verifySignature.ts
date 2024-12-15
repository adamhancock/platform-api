
import crypto from 'crypto';
import { createHmac } from 'crypto';
/**
 * Verifies the SHA-256 signature of a JIRA webhook request.
 *
 * @param rawBody - The raw request body as a string (not parsed).
 * @param jiraSignature - The signature string from the request headers.
 * @param secret - Your known shared secret string.
 * @returns true if verification succeeds, false otherwise
 */
export function verifySignature(
  rawBody: string,
  jiraSignature: string,
  secret: string
): boolean {
  // If the signature comes with a prefix, remove it
  // For example, if jiraSignature = "sha256=2f4ec1724e8f39f3..."
  // then `actualSignature` should be just "2f4ec1724e8f39f3..."
  const prefix = 'sha256=';
  const actualSignature = jiraSignature.startsWith(prefix)
    ? jiraSignature.substring(prefix.length)
    : jiraSignature;

  const computedSignature = createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('hex');

  return timingSafeCompare(computedSignature, actualSignature.toLowerCase());
}

/**
 * A timing-safe string comparison to mitigate timing attacks.
 * This ensures that even if the first character doesn’t match,
 * it still performs the full comparison.
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
