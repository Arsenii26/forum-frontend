import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
// DON'T using in this project right now (but possibility to call custom error message)
export class ErrorComponent {

  @Input() errorMessage = 'Unknown error';

  onHandleError() {
  this.errorMessage = null;
  }
}
