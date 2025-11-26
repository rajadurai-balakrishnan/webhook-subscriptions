export enum AuthType {
  BASIC_AUTH = 'BasicAuth',
  OAUTH = 'OAuth'
}

export enum EventType {
  GENERAL_REPORT = 'GeneralReport',
  SPECIAL_REPORT = 'SpecialReport',
  BOTH = 'Both'
}

export interface BasicAuthCredentials {
  username: string;
  password: string;
}

export interface OAuthCredentials {
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
}

export interface Subscription {
  id: string;
  clientName: string;
  webhookUrl: string;
  authType: AuthType;
  authCredentials: BasicAuthCredentials | OAuthCredentials;
  eventTypes: EventType[];
  privateKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionFormData {
  clientName: string;
  webhookUrl: string;
  authType: AuthType;
  authCredentials: BasicAuthCredentials | OAuthCredentials;
  eventTypes: EventType[];
}
