//Contêm os serviços associados às salas 

import { Observable, alert } from "@nativescript/core";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { SalaModel } from "../models/sala.model"
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
  })
export class SalaService {
    private salas: SalaModel[]
    private temp: SalaModel
    private counter: number

    addSala(sala:number, andar:number): void{
        this.temp = {
            id:this.counter,
            n_sala: sala,
            andar: andar
        }
        this.salas.push(this.temp)
    }
    
    showSalas(): SalaModel[] {
        return this.salas
    }
}