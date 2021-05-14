import 'jest';
import { ViewOutput } from '@slack/bolt';
import { ViewOutputUtils } from '../../../slack/common/ViewOutputUtils';

describe('view output utils', () => {
  it('gets the correct value for a specified field', () => {
    const mockActionId = 'something';
    const mockValue = 'a selected value';
    const mockViewOutput = {
      state: {
        values: {
          blockId: {
            [mockActionId]: mockValue,
          },
          blockId2: {
            [mockActionId]: mockValue,
          },
        },
      },
    } as unknown as ViewOutput;
    const viewOutputUtils = new ViewOutputUtils(mockViewOutput);
    expect(viewOutputUtils.getInputValue(mockActionId)).toBe(mockValue);
  });
  it('returns undefined when the field cannot be found', () => {
    const mockViewOutput = {
      state: {
        values: {},
      },
    } as unknown as ViewOutput;
    const viewOutputUtils = new ViewOutputUtils(mockViewOutput);
    expect(viewOutputUtils.getInputValue('someUnknownActionId')).toBeUndefined();
  });
});
