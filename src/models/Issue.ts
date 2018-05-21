export interface Issue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    status: {
      description: string;
      name: string;
    };
    assignee: {
      self: string;
      name: string;
      key: string;
      emailAddress: string;
      displayName: string;
      active: boolean;
    };
    issuetype: {
      self: string;
      id: number;
      description: string;
      name: string;
      subtask: boolean;
      avatarId: number;
    };
    created: Date;
  };
}
