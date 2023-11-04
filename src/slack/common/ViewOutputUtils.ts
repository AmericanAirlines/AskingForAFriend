import { ViewOutput, ViewStateValue } from '@slack/bolt';

export class ViewOutputUtils {
  readonly view: ViewOutput;

  constructor(output: ViewOutput) {
    this.view = output;
  }

  /**
   * Returns the first input value with the given actionId
   * @param actionId The action_id for the input element, set in the view blocks
   */
  getInputValue(actionId: string): ViewStateValue | undefined {
    for (const blockValue of Object.values(this.view.state.values)) {
      if (blockValue[actionId]) {
        return blockValue[actionId];
      }
    }

    return undefined;
  }
}
