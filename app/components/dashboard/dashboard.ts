import { Component } from '@angular/core';

/*
  Generated class for the Dashboard component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'dashboard',
  templateUrl: 'build/components/dashboard/dashboard.html'
})
export class Dashboard {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }
}
