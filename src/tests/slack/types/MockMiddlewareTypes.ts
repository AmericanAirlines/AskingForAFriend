import { AllMiddlewareArgs } from '@slack/bolt';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type MockMiddlewarePayload<T> = DeepPartial<T & AllMiddlewareArgs>;
