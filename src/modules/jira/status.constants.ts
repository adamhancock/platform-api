export const JIRA_STATUS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
  BLOCKED: 'Blocked',
  IN_REVIEW: 'In Review',
  READY_TO_MERGE: 'Ready to Merge',
} as const;

export type JiraStatus = typeof JIRA_STATUS[keyof typeof JIRA_STATUS];
