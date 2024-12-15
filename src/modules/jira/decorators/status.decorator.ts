import 'reflect-metadata';

const JIRA_STATUS_HANDLER_METADATA = 'jira_status_handler';

// Decorator factory for Jira status changes
export function OnJiraStatus(status: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const existingHandlers =
      Reflect.getMetadata(JIRA_STATUS_HANDLER_METADATA, target.constructor) || {};

    existingHandlers[status] = propertyKey;

    Reflect.defineMetadata(
      JIRA_STATUS_HANDLER_METADATA,
      existingHandlers,
      target.constructor,
    );

    return descriptor;
  };
}

export { JIRA_STATUS_HANDLER_METADATA };
