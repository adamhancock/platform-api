import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifySignature } from '@/lib/verifySignature';
import { Request } from 'express';
import 'reflect-metadata';

const WEBHOOK_HANDLER_METADATA = 'webhook_handler';
const GITHUB_WEBHOOK_SIGNATURE_HEADER = 'x-hub-signature-256';

// Decorator factory for GitHub webhook events
export function OnGithubWebhook(event: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const existingHandlers =
      Reflect.getMetadata(WEBHOOK_HANDLER_METADATA, target.constructor) || {};

    existingHandlers[event] = propertyKey;

    Reflect.defineMetadata(
      WEBHOOK_HANDLER_METADATA,
      existingHandlers,
      target.constructor,
    );

    return descriptor;
  };
}

/**
 * Parameter decorator to verify GitHub webhook signatures.
 * Throws UnauthorizedException if signature verification fails.
 */
export const VerifyGithubWebhook = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { rawBody: Buffer }>();
    const signature = request.headers[GITHUB_WEBHOOK_SIGNATURE_HEADER] as string;
    const rawBody = request.rawBody;

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('GITHUB_WEBHOOK_SECRET environment variable is not set');
    }

    if (!signature) {
      throw new UnauthorizedException('Missing GitHub webhook signature');
    }

    if (!rawBody) {
      throw new Error('Raw body is not available. Ensure the raw body parser middleware is configured.');
    }

    const isValid = verifySignature(
      rawBody.toString('utf8'),
      signature,
      webhookSecret
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid GitHub webhook signature');
    }

    return request.body;
  }
);

export { WEBHOOK_HANDLER_METADATA };
