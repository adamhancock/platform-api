import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifySignature } from '@/lib/verifySignature';
import { JIRA_WEBHOOK_SIGNATURE_HEADER } from '../constants';
import { Request } from 'express';
import 'reflect-metadata';

export const JIRA_WEBHOOK_HANDLER_METADATA = 'jira_webhook_handler';

/**
 * Decorator factory for Jira webhook events
 */
export function OnJiraWebhook(event: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const existingHandlers =
      Reflect.getMetadata(JIRA_WEBHOOK_HANDLER_METADATA, target.constructor) || {};

    existingHandlers[event] = propertyKey;

    Reflect.defineMetadata(
      JIRA_WEBHOOK_HANDLER_METADATA,
      existingHandlers,
      target.constructor,
    );

    return descriptor;
  };
}

/**
 * Parameter decorator to verify Jira webhook signatures.
 * Throws UnauthorizedException if signature verification fails.
 */
export const VerifyJiraWebhook = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { rawBody: Buffer }>();
    const signature = request.headers[JIRA_WEBHOOK_SIGNATURE_HEADER] as string;
    const rawBody = request.rawBody;

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.JIRA_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('JIRA_WEBHOOK_SECRET environment variable is not set');
    }

    if (!signature) {
      throw new UnauthorizedException('Missing Jira webhook signature');
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
      throw new UnauthorizedException('Invalid Jira webhook signature');
    }

    return request.body;
  }
);
