export const DEPENDABOT_ALERT_STATE = {
  CREATED: 'created',
  DISMISSED: 'dismissed',
  RESOLVED: 'resolved',
  REOPENED: 'reopened',
} as const;

export type DependabotAlertState = typeof DEPENDABOT_ALERT_STATE[keyof typeof DEPENDABOT_ALERT_STATE];
