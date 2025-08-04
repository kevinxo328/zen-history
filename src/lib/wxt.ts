import {AlarmsName} from "@/types/background";
import {getNextMidnightTimestamp} from "./utils";

export const toggleAutoCleanAlarm = async (enabled: boolean) => {
  if (enabled) {
    browser.alarms.create(AlarmsName.AUTO_CLEAN, {
      when: getNextMidnightTimestamp(new Date()),
      periodInMinutes: 24 * 60, // Repeat every 24 hours
      // delayInMinutes: 0.5, // Testing purposes, uncomment to test
    });
  } else {
    browser.alarms.clear(AlarmsName.AUTO_CLEAN);
  }
};
