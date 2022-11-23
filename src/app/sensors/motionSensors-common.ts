export abstract class MotionSensorBase {
    hasSensorStepCounter = false;
    hasSensorOrientation = false;
    hasSensorGyroscope = false;
    hasSensorAccelerometer = false;
  
    getDirection(angle): string {
      let direction = "";
  
      if (angle >= 350 || angle <= 10) direction = "N";
      if (angle < 350 && angle > 280) direction = "NW";
      if (angle <= 280 && angle > 260) direction = "W";
      if (angle <= 260 && angle > 190) direction = "SW";
      if (angle <= 190 && angle > 170) direction = "S";
      if (angle <= 170 && angle > 100) direction = "SE";
      if (angle <= 100 && angle > 80) direction = "E";
      if (angle <= 80 && angle > 10) direction = "NE";
  
      return direction;
    }
  }