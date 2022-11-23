import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, alert } from "@nativescript/core";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { SalaModel } from '~/app/core/models/sala.model'
import { SalaService} from '~/app/core/services/sala.service'
import { Sensor } from '~/app/sensors/motionSensors';
import { MotionSensor } from '~/app/sensors/motionSensors.android';
//import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData } from "tns-core-modules/application";

@Component({
    moduleId: module.id,
    selector: 'ns-qrcode',
    templateUrl: 'qrcode.component.html'
  })

export class QRComponent extends Observable {
    public message: string
    private barcodeScanner: BarcodeScanner

    sensors: Sensor[] = [];
    steps = 0;
    stepStatus = false;
    degree = 0;
    degreeDirection = "";
    gyroscope = { x: 0, y: 0, z: 0 };
    accelerometer = { x: 0, y: 0, z: 0 };
    motionSensor = new MotionSensor();
    hasSensors = {
      stepCounter: true,
      orientation: true,
      gyroscope: true,
      accelerometer: true,
    };
  
    constructor() {
      super();
      this.barcodeScanner = new BarcodeScanner()

      this.motionSensor
      .requestPermission()
      .then(() => {
        this.motionSensor.initSensors();
        this.initListeners();
        this.sensors.push(...this.motionSensor.getAllSensorList());
      })
      .catch((e) => {
        console.log(e);
      });
    }

    public initListeners(){
     /** this.motionSensor.onStep(
        (data) => {
          this.steps = data[0];
          console.log("STEPS: " + this.steps);  
        }
      );*/ 
  
      this.motionSensor.onOrientation((data) => {
        const degree = data[0];
        this.degreeDirection = this.motionSensor.getDirection(degree);
        console.log("degree: " + this.degree);
        console.log("degreeDirection: " + this.degreeDirection);
        
      });
  
      this.motionSensor.onGyroscope((data) => {
        this.gyroscope = { x: data[0], y: data[1], z: data[2] };
        console.log("gyroscope x: " + this.gyroscope.x + "gyroscope y: "+this.gyroscope.y + "gyroscope z: "+this.gyroscope.z);
      });
  
      this.motionSensor.onAccelerometer((data) => {
        this.accelerometer = { x: data[0], y: data[1], z: data[2] };
        console.log("accelerometer x: " + this.accelerometer.x + "accelerometer y: "+this.accelerometer.y + "accelerometer z: "+this.accelerometer.z);
      });
  
      this.hasSensors.stepCounter = this.motionSensor.hasSensorStepCounter;
      this.hasSensors.orientation = this.motionSensor.hasSensorOrientation;
      this.hasSensors.gyroscope = this.motionSensor.hasSensorGyroscope;
      this.hasSensors.accelerometer = this.motionSensor.hasSensorAccelerometer;
    }
  
    public onScanResult(scanResult: any) {
      console.log(`onScanResult: ${scanResult.text} (${scanResult.format})`);
    }
  
    public doCheckAvailable() {
      this.barcodeScanner.available().then(avail => {
        alert({
          title: "Câmera Disponível?",
          message: avail ? "SIM" : "NÃO",
          okButtonText: "OK"
        });
      }, (err) => {
        alert(err)
      });
    }
  
    public doCheckHasCameraPermission() {
      this.barcodeScanner.hasCameraPermission().then(permitted => {
        alert({
          title: "TÊM PREMISSÃO PARA USAR A CAMERA?",
          message: permitted ? "SIM" : "NÃO",
          okButtonText: "OK"
        });
      }, (err) => {
        alert(err);
      });
    }
  
    public doRequestCameraPermission() {
      this.barcodeScanner.requestCameraPermission()
          .then(() => console.log("Acesso à camera permitido"))
          .catch(() => console.log("Acesso à camera não permitido"))
    }
  
    public doScanWithBackCamera() {
      this.scan(false, true);
    }
  
    private scan(front: boolean, flip: boolean, torch?: boolean, orientation?: string) {
      this.barcodeScanner.scan({
        presentInRootViewController: true, // not needed here, but added it just for show
        cancelLabel: "", // iOS only, default 'Close'
        cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
        message: "Se precisar de mais luz Volume+", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
        preferFrontCamera: front,     // Android only, default false
        showFlipCameraButton: false,   // default false
        showTorchButton: false,       // iOS only, default false
        torchOn: false,               // (default false)
        resultDisplayDuration: 500,   // Android only, default 1500 (ms)
        orientation: orientation,     // Android only, other options: portrait|landscape
        beepOnScan: true,             // (default true)
        fullScreen: true,             //default false)
        openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
        closeCallback: () => {
          console.log("Scanner fechado @ " + new Date().getTime());
        }
      }).then(
          function (result) {
            console.log("--- scanned: " + result.text)
            setTimeout(function () {
              var result_to_process = result.format.split("room=",(1))
              alert({
                title: "Resultado do Scan",
                message: "Formato: " + result.format + ",\nValor: " + result.text,
                okButtonText: "OK"
              });
            }, 500);
          },
          function (errorMessage) {
            console.log("Não houve scan. " + errorMessage)
          }
      );
    }
  }

  export function doRequestCameraPermission() {
    this.barcodeScanner.requestCameraPermission()
      .then(() => console.log("Acesso à camera permitido"))
      .catch(() => console.log("Acesso à camera não permitido"))
  }
