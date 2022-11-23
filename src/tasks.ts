import { Task } from '@awarns/core/tasks';
import {
  startDetectingCoarseHumanActivityChangesTask,
  stopDetectingCoarseHumanActivityChangesTask,
} from '@awarns/human-activity';
import { acquirePhoneGeolocationTask } from '@awarns/geolocation';
import { checkAreaOfInterestProximityTask } from '@awarns/geofencing';
import { sendNotificationTask } from '@awarns/notifications';
import { writeRecordsTask } from '@awarns/persistence';

export const appTasks: Array<Task> = [
  // START: human activity recognition tasks
  startDetectingCoarseHumanActivityChangesTask(),
  stopDetectingCoarseHumanActivityChangesTask(),
  // END: human activity recognition tasks (see human-activity plugin docs to learn about these tasks and more)
  
  // START: location acquisition tasks
  acquirePhoneGeolocationTask(),
  // END: location acquisition tasks (see geolocation plugin docs to learn about this task and more)
  
  // START: area of interest proximity detection tasks
  checkAreaOfInterestProximityTask(),
  // END: area of interest proximity detection tasks (see geofencing plugin docs to learn about this task and more)
  
  // START: user notification tasks
  sendNotificationTask(),
  // END: user notification tasks (see notifications plugin docs to learn about this task and more)
  
  // START: information persistence tasks
  writeRecordsTask(),
  // END: information persistence tasks (see persistence plugin docs to learn about this task and more)
];