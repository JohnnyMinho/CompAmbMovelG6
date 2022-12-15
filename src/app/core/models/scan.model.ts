export interface ScanModel {
    id: number
    n_sala: number
    andar: number  
    Directions: number[]//Guardamos os graus
    Accelerometer: number[][]
    Gyroscope: number[][]
    Steps: number
  }