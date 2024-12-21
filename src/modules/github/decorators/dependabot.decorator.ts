import 'reflect-metadata';
import { DependabotAlertState } from '../dependabot.constants';

const DEPENDABOT_ALERT_HANDLER_METADATA = 'dependabot_alert_handler';

// Decorator factory for Dependabot alert state changes
export function OnDependabotAlert(state: DependabotAlertState) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const existingHandlers =
      Reflect.getMetadata(DEPENDABOT_ALERT_HANDLER_METADATA, target.constructor) || {};

    existingHandlers[state] = propertyKey;

    Reflect.defineMetadata(
      DEPENDABOT_ALERT_HANDLER_METADATA,
      existingHandlers,
      target.constructor,
    );

    return descriptor;
  };
}

export { DEPENDABOT_ALERT_HANDLER_METADATA };
