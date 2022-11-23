import { SensorEventListenerAndroid } from "./SensorEventListener.android";
import { MotionSensorBase } from "./motionSensors-common";

export type Sensor = {
  name: string;
};

export type CallbackMotion = (data: number[]) => void;

declare class MotionSensor extends MotionSensorBase {
  requestPermission(): Promise<any>;
  initSensors(): void;
  getAllSensorList(): Sensor[];
  onStep(callback: CallbackMotion, callbackStepStatus: CallbackMotion): void;
  onOrientation(callback: CallbackMotion): void;
  onGyroscope(callback: CallbackMotion): void;
  onAccelerometer(callback: CallbackMotion): void;
}