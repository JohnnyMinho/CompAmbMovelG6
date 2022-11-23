import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { LoadingScreenComponent } from './loadingscreen.component'

export const routes: Routes = [
  {
    path: '',
    component: LoadingScreenComponent
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)]
})
export class LoadingScreenRoutingModule {}