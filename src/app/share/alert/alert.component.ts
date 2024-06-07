import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() type: string;
  cssClass: string[] = ['alert', 'alert-dismissible', 'fade'];

  constructor() {
    this.type = 'info';
  }

  ngOnInit(): void {
    let alertClass: string = 'alert-info';
    switch (this.type) {
      case 'success':
        alertClass = 'alert-success';
        break;
      case 'danger':
        alertClass = 'alert-danger';
        break;
      case 'warning':
        alertClass = 'alert-warning';
        break;
      default:
        alertClass = 'alert-info';
    }
    this.cssClass.push(alertClass);
  }

  removeAlert(): void {
    this.cssClass = ['alert-hide'];
  }
}
