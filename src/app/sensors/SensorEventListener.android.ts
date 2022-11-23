@NativeClass()
@Interfaces([android.hardware.SensorEventListener])
class SensorEventListenerAndroid
  extends java.lang.Object
  implements android.hardware.SensorEventListener
{
  callback: (event: number[]) => void;
  callbackOnAccuracyChanged: (
    sensor: android.hardware.Sensor,
    accuracy: number
  ) => void;

  constructor(callback: (data) => void) {
    super();
    this.callback = callback;
    return global.__native(this);
  }

  onAccuracyChanged(sensor: android.hardware.Sensor, accuracy: number): void {
    if (this.callbackOnAccuracyChanged) {
      this.callbackOnAccuracyChanged(sensor, accuracy);
    }
  }

  onSensorChanged(event: android.hardware.SensorEvent): void {
    if (!event || (event.values.length === 0 && event.values[0])) return;
    this.callback(event.values as number[]);
  }
}

export { SensorEventListenerAndroid };