import {
  MessageShortcut,
  SlackAction,
  SlackActionMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
  SlackViewAction,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';
import { MockMiddlewarePayload } from '../types/MockMiddlewareTypes';

export const makeMockActionMiddlewarePayload = <
  T extends MockMiddlewarePayload<SlackActionMiddlewareArgs<SlackAction>>,
>(
  args: T,
): T => args;

export const makeMockMessageShortcutMiddlewarePayload = <
  T extends MockMiddlewarePayload<SlackShortcutMiddlewareArgs<MessageShortcut>>,
>(
  args: T,
): T => args;

export const makeMockEventMiddlewarePayload = <T extends MockMiddlewarePayload<SlackEventMiddlewareArgs<string>>>(
  args: T,
): T => args;

export const makeMockViewMiddlewarePayload = <
  T extends MockMiddlewarePayload<SlackViewMiddlewareArgs<SlackViewAction>>,
>(
  args: T,
): T => args;
