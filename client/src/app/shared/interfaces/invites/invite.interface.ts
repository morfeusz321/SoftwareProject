export interface InsocialSurvey {
  id: string;
  label: string;
}

export interface InsocialEmailTemplate {
  id: string;
  name: string;
}

export interface InsocialEmailInvitesConfiguration {
  templates: InsocialEmailTemplate[];
  senderAddresses: string[];
  senderNames: string[];
  subjects: string[];
}

export interface InviteConfiguration {
  surveyId: string;
  template: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  invites: any[];
}
