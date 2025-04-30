import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'example-app-home',
  
  imports: [AnalogWelcomeComponent],
  template: `
     <example-app-analog-welcome/>
  `,
})
export default class HomeComponent {
}
