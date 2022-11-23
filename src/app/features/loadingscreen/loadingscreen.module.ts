import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'
import { LoadingScreenRoutingModule } from './loadingscreen-routing.module'
import { LoadingScreenComponent } from './loadingscreen.component'

@NgModule({
  imports: [NativeScriptCommonModule, LoadingScreenRoutingModule],
  declarations: [LoadingScreenComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LoadingScreenModule {}