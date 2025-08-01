import {TimeRange} from "./clean-settings";

export class CleanMessage {
  static action = "CLEAN";
  action: string = CleanMessage.action;
  timeRange: TimeRange;

  constructor(timeRange: TimeRange) {
    this.timeRange = timeRange;
  }
}

export enum AlarmsName {
  AUTO_CLEAN = "autoClean",
}
