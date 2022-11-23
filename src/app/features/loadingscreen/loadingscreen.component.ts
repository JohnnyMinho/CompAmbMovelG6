import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable, alert } from "@nativescript/core";
import { RouterExtensions } from '@nativescript/angular'
//import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData } from "tns-core-modules/application";

@Component({
    moduleId: module.id,
    selector: 'ns-loadingscreen',
    templateUrl: 'loadingscreen.component.html'
  })

  export class LoadingScreenComponent {

    constructor(
      private routerExtensions: RouterExtensions
    ) {}

    OnScreenTap(){
      this.routerExtensions.navigate(['home'])
    }
  }