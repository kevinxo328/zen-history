import { BrowsingDataTypes, TimeRange } from './clean-settings';

export class CleanMessage {
  static action = 'CLEAN';
  action: string = CleanMessage.action;
  timeRange: TimeRange;
  browsingDataTypes?: BrowsingDataTypes;

  constructor(timeRange: TimeRange, browsingDataTypes?: BrowsingDataTypes) {
    this.timeRange = timeRange;
    this.browsingDataTypes = browsingDataTypes;
  }
}

export enum AlarmsName {
  AUTO_CLEAN = 'autoClean'
}
