import {
  SlackAction,
  SlackActionMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackViewAction,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';
import { MockMiddlewarePayload } from '../types/MockMiddlewareTypes';

export const makeMockActionMiddlewarePayload = <
  T extends MockMiddlewarePayload<SlackActionMiddlewareArgs<SlackAction>>
>(
  args: T,
) => args;

export const makeMockEventMiddlewarePayload = <T extends MockMiddlewarePayload<SlackEventMiddlewareArgs<string>>>(
  args: T,
) => args;

export const makeMockViewMiddlewarePayload = <
  T extends MockMiddlewarePayload<SlackViewMiddlewareArgs<SlackViewAction>>
>(
  args: T,
) => args;
