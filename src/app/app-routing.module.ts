import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePage } from './pages/home/home.page';
import { SplashPage } from './pages/splash/splash.page';
import { OnBoardingPage } from './pages/onboarding/onboarding.page';
import { RequestsPage } from './pages/requests/requests.page';
import { DetailsPage } from './pages/details/details.page';
import { CreatePage } from './pages/create/create.page';
import { DidSearchPage } from './pages/didsearch/didsearch.page';

const routes: Routes = [
  { path: '', component: SplashPage, pathMatch: 'full' },
  { path: 'onboarding', component: OnBoardingPage },
  { path: 'create', component: CreatePage },
  { path: 'home', component: HomePage },
  { path: 'requests', component: RequestsPage },
  { path: 'details', component: DetailsPage },
  { path: 'didsearch', component: DidSearchPage },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
