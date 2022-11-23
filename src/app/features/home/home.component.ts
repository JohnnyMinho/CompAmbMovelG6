import { Component } from '@angular/core'
import { FlickService } from '~/app/core/services/flick.service'
import {Application, LaunchEventData} from '@nativescript/core'
import { OnInit } from '@angular/core'
// Add this 👇
import { SalaService} from '../../core/services/sala.service'
import { ItemEventData } from '@nativescript/core'
import { RouterExtensions } from '@nativescript/angular'
import { BarcodeScanner } from "nativescript-barcodescanner";

@Component({
  moduleId: module.id,
  selector: 'ns-home',
  templateUrl: 'home.component.html'
})

export class HomeComponent{
  flicks = this.flickService.getFlicks()
  private barcodeScanner: BarcodeScanner;
  private salas;

  constructor(
    private flickService: FlickService,
    private salaService: SalaService,
    private routerExtensions: RouterExtensions
  ) {}
 
  onFlickTap(args: ItemEventData): void {
    this.routerExtensions.navigate(['details', this.flicks[args.index].id])
  }

  onQrTap(args: ItemEventData): void{
    this.routerExtensions.navigate(['scan'])
    //alert("Teste")
  }

  onMapTap():void{
    this.salas = this.salaService.showSalas()
    alert(this.salas)
  }

}