import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { MyApp } from './app.component';

import { HomePage } from './pages/home/home.page';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Native } from './services/Native';
import { HttpClientModule } from '@angular/common/http';
import { SplashPage } from './pages/splash/splash.page';
import { OnBoardingPage } from './pages/onboarding/onboarding.page';
import { ComponentsModule } from './components/components.module';
import { DetailsPage } from './pages/details/details.page';
import { RequestsPage } from './pages/requests/requests.page';
import { CreatePage } from './pages/create/create.page';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { DidSearchPage } from './pages/didsearch/didsearch.page';

@NgModule({
  declarations: [
    MyApp,
    CreatePage,
    HomePage,
    SplashPage,
    OnBoardingPage,
    DetailsPage,
    RequestsPage,
    DidSearchPage
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    FormsModule,
    IonicStorageModule.forRoot({
      name: '__assistdb',
      driverOrder: ['localstorage', 'indexeddb', 'sqlite', 'websql']
  }),
    IonicModule.forRoot(),
    
  ],
  bootstrap: [MyApp],
  entryComponents: [
    MyApp,
    CreatePage,
    HomePage,
    SplashPage,
    OnBoardingPage,
    DetailsPage,
    RequestsPage,
    DidSearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Platform,
    Native,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: ErrorHandler, useClass: ErrorHandler}
  ]
})
export class AppModule {}
