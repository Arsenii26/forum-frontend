import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appPlaceholder]'
})
export class PlaceholderDirective {
  // ViewContainerRef gives access to place where container used
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
