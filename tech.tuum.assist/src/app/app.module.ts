import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';

import { MyApp } from './app.component';

import { AboutPage } from './pages/about/about';
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

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    CreatePage,
    HomePage,
    SplashPage,
    OnBoardingPage,
    DetailsPage,
    RequestsPage
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    IonicModule.forRoot(),
    
  ],
  bootstrap: [MyApp],
  entryComponents: [
    MyApp,
    AboutPage,
    CreatePage,
    HomePage,
    SplashPage,
    OnBoardingPage,
    DetailsPage,
    RequestsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Platform,
    Native,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: ErrorHandler, useClass: ErrorHandler}
  ]
})
export class AppModule {}
