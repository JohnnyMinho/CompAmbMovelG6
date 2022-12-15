import { SensorEventListenerAndroid } from "./SensorEventListener.android";
import * as permissions from "nativescript-permissions";
import { Utils } from "@nativescript/core";
import {
  CallbackMotion,
  Sensor,
} from "./motionSensors";
import { MotionSensorBase } from "./motionSensors-common";

export class MotionSensor extends MotionSensorBase {
  context = Utils.android.getApplicationContext();
  sensorManager: android.hardware.SensorManager = null;

  requestPermission() {
    return (
      permissions
        // @ts-ignore
        .requestPermissions(android.Manifest.permission.ACTIVITY_RECOGNITION)
    );
  }

  initSensors() {
    this.sensorManager = this.context.getSystemService(
      android.content.Context.SENSOR_SERVICE
    );
  }

  getAllSensorList() {
    const deviceSensors: Sensor[] = [];
    const sensorList = this.sensorManager.getSensorList(
      android.hardware.Sensor.TYPE_ALL
    );
    for (let i = 0; i < sensorList.size(); i++) {
      deviceSensors.push({ name: sensorList.get(i).getName() });
    }
    return deviceSensors;
  }

  onStep(callback: CallbackMotion, callbackStepStatus: CallbackMotion) {
    const stepCounterSensor = this.sensorManager.getDefaultSensor(
      19
    );
0
    if (stepCounterSensor) {
      this.hasSensorStepCounter = true;
      let initSteps = -1;
      this.sensorManager.registerListener(
        new SensorEventListenerAndroid((data) => {
          if (initSteps === -1) {
            initSteps = data[0];
          }
          data[0] = data[0] - initSteps;
          callback(data);
        }),
        stepCounterSensor,
        android.hardware.SensorManager.SENSOR_DELAY_FASTEST
      );
    }

    const stepStatusSensor = this.sensorManager.getDefaultSensor(
      18
    );

    if (stepStatusSensor) {
      this.sensorManager.registerListener(
        new SensorEventListenerAndroid((data) => {
          callbackStepStatus(data);
        }),
        stepStatusSensor,
        android.hardware.SensorManager.SENSOR_DELAY_FASTEST
      );
    }
  }

  onOrientation(callback: CallbackMotion) {
    const orientationSensor = this.sensorManager.getDefaultSensor(
      android.hardware.Sensor.TYPE_ORIENTATION
    );

    if (orientationSensor) {
      this.hasSensorOrientation = true;
      this.sensorManager.registerListener(
        new SensorEventListenerAndroid((data) => {
          callback([java.lang.Math.round(data[0])]);
        }),
        orientationSensor,
        android.hardware.SensorManager.SENSOR_DELAY_GAME
      );
    }
  }

  onGyroscope(callback: CallbackMotion) {
    const gyroscopeSensor = this.sensorManager.getDefaultSensor(
      android.hardware.Sensor.TYPE_GYROSCOPE
    );

    if (gyroscopeSensor) {
      this.hasSensorGyroscope = true;
      this.sensorManager.registerListener(
        new SensorEventListenerAndroid((data) => {
          const x = data[0];
          const y = data[1];
          const z = data[2];
          callback([x, y, z]);
        }),
        gyroscopeSensor,
        android.hardware.SensorManager.SENSOR_DELAY_GAME
      );
    }
  }

  onAccelerometer(callback: CallbackMotion) {
    const accelerometerSensor = this.sensorManager.getDefaultSensor(
      android.hardware.Sensor.TYPE_ACCELEROMETER
    );

    if (accelerometerSensor) {
      this.hasSensorAccelerometer = true;
      this.sensorManager.registerListener(
        new SensorEventListenerAndroid((data) => {
          const x = data[0];
          const y = data[1];
          const z = data[2];
          callback([x, y, z]);
        }),
        accelerometerSensor,
        android.hardware.SensorManager.SENSOR_DELAY_GAME
      );
    }
  }
}
