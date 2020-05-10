import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
// the custom spinner for the imitation page loading
export class LoadingSpinnerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
