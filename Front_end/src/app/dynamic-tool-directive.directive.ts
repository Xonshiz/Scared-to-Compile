import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicToolDirective]'
})
export class DynamicToolDirectiveDirective {

  constructor(public viewContainerRef: ViewContainerRef) { 
    //console.log("It works!");
  }

}
