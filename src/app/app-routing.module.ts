import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

const routes: Routes = [
  { path: '', redirectTo: '/loadingscreen', pathMatch: 'full' },
  {
    path: 'loadingscreen',
    loadChildren: () => import('./features/loadingscreen/loadingscreen.module').then(m => m.LoadingScreenModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./features/qrcode/qrcode.module').then(m => m.QRModule)
  },
  {
    path: 'details/:id',
    loadChildren: () =>
      import('./features/details/details.module').then(m => m.DetailsModule)
  }
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
