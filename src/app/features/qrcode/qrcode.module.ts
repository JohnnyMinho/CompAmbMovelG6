import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'
import { QrRoutingModule } from './qrcode-routing.module'
import { QRComponent } from './qrcode.component'

@NgModule({
  imports: [NativeScriptCommonModule, QrRoutingModule],
  declarations: [QRComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class QRModule {}