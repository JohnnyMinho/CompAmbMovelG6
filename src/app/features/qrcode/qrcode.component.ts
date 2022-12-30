import { Component , Injectable, ChangeDetectorRef, NgZone} from '@angular/core'
import { Observable, alert } from "@nativescript/core";
import { BehaviorSubject} from 'rxjs'; 
import { BarcodeScanner } from "nativescript-barcodescanner";
import { SalaModel } from '~/app/core/models/sala.model'
import { SalaService} from '~/app/core/services/sala.service'
import { ScanModel } from '~/app/core/models/scan.model'
import { Sensor, CallbackMotion } from '~/app/sensors/motionSensors';
import { OnInit } from '@angular/core';
import { MotionSensor } from '~/app/sensors/motionSensors.android';
//import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData } from "tns-core-modules/application";

//https://stackoverflow.com/questions/46047854/how-to-update-a-component-without-refreshing-full-page-angular -> Behavior Subject
//Usei o NgZone para o programa saber que este têm de manter a parte do programa que está lá inserido em sincronização com o processo da view

@Component({
    moduleId: module.id,
    selector: 'ns-qrcode',
    templateUrl: 'qrcode.component.html'
  })


export class QRComponent extends Observable implements OnInit{
    public message: string
    private barcodeScanner: BarcodeScanner
    private cd: ChangeDetectorRef
    sensors: Sensor[] = [];
    steps = 0;
    time:string = ""
    data_counter = 0;
    scanModel: ScanModel | undefined = undefined
    stepStatus = false;
    callback_temp: CallbackMotion
    door_scanned = false
    degreeSubject = new BehaviorSubject<Number>(0)
    degree:Number = 0
    degreeDirection = ""
    degreeDirectionSubject = new BehaviorSubject<string>("Null")
    newdata = false;
    gyroscopeSubject: BehaviorSubject<any> = new BehaviorSubject<any>({ x: 0, y: 0, z: 0 })
    accelerometerSubject:BehaviorSubject<any> = new BehaviorSubject<any>({ x: 0, y: 0, z: 0 })
    gyroscope = { x: 0, y: 0, z: 0 };
    accelerometer = { x: 0, y: 0, z: 0 };
    motionSensor = new MotionSensor();
    hasSensors = {
      stepCounter: true,
      orientation: true,
      gyroscope: true,
      accelerometer: true,
    };
  
    constructor(private ngZone: NgZone) {
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
      this.ngZone.run(() =>{
      this.motionSensor.onStep(
        (data) => {
          
          this.steps = data[0];
          this.degreeSubject.next(this.degree)
          console.log("STEPS: " + this.steps);  
        },
        (status) =>{
         // console.log("STATUS:" + status)
        }
      )

        this.motionSensor.onOrientation((data) => {
          /*this.data_counter+=1*/
          this.degreeDirectionSubject.next(this.motionSensor.getDirection(data[0]))
          this.degreeSubject.next(data[0])
        });
      

        this.motionSensor.onGyroscope((data) => {
          this.gyroscopeSubject.next({ x: data[0], y: data[1], z: data[2] })
        });
      

      this.motionSensor.onAccelerometer((data) => {
        this.accelerometerSubject.next({ x: data[0], y: data[1], z: data[2] })
      });
      
      // Basicamente como o Behaviour Subject consegue servir de observante e observador conseguimos o usar como um método para subscrever ao método de recolha de dados

      this.hasSensors.stepCounter = this.motionSensor.hasSensorStepCounter;
      this.hasSensors.orientation = this.motionSensor.hasSensorOrientation;
      this.hasSensors.gyroscope = this.motionSensor.hasSensorGyroscope;
      this.hasSensors.accelerometer = this.motionSensor.hasSensorAccelerometer;
    })
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
          function (result){
            console.log("--- scanned: " + result.text)
            setTimeout(function () {
              //-var result_to_process = result.format.split("room=",(1))
              alert({
                title: "Resultado do Scan",
                message: "Formato: " + result.format + ",\nValor: " + result.text,
                okButtonText: "OK"
              });
            }, 500);
          },
          function (errorMessage) {
            console.log("Não houve scan. " + errorMessage)}
      )
    }

    
    public stopScan(){

    }

    public startButton(){
      //Função de teste
      this.door_scanned = true
    }

    public stopButton(){
      //Função de teste
      this.door_scanned = false
    }
    public setDataCollectionStatus(status){
      this.door_scanned = status
      console.log(this.door_scanned)
    }

    ngOnInit() {
      
      this.gyroscopeSubject.subscribe((gyroscope) => {
        this.gyroscope = gyroscope
        console.log("posição telemóvel: " , this.gyroscope)
      });

      this.accelerometerSubject.subscribe((accelerometer) => {
        this.accelerometer = accelerometer
        console.log("aceleração: " , this.accelerometer)
      });

      this.degreeDirectionSubject.subscribe((degreeDirection) => {
        this.degreeDirection = degreeDirection
        console.log("direção: " , this.degreeDirection)
      });

      this.degreeSubject.subscribe((degree) => {
        this.degree = degree
        console.log("degree: " , this.degree)
      });
      setInterval(() => {
        this.time = new Date().toLocaleTimeString();
      }, 0);
    } 
    }


  export function doRequestCameraPermission() {
    this.barcodeScanner.requestCameraPermission()
      .then(() => console.log("Acesso à camera permitido"))
      .catch(() => console.log("Acesso à camera não permitido"))
  }
