import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { DashboardPage } from './pages/dashboard/dashboard';
import { HomePage } from './pages/home/home';
import {SessionService} from './providers/session/session';
import {Dashboard} from './providers/dashboard/dashboard';
import {LogService} from 'angular2-log/log';

@Component({
  templateUrl: 'build/app.html',

})
class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private logService: LogService) {
    this.initializeApp();
    this.logService.level = 'debug';
    // this.logService.info('An info');
    // this.logService.warning('Take care ');
    // this.logService.error('Too late !');
    // this.logService.debug('Your debug stuff');
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Dashboard', component: DashboardPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // StatusBar.styleDefault();
      StatusBar.styleBlackOpaque();
    });
  }

  logout() {
    this.logService.debug('logout called');
    this.nav.setRoot(DashboardPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [SessionService, LogService], {title: 'Welcome to HomeBee'});
