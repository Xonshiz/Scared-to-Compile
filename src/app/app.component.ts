import { Component, ViewChild } from '@angular/core';
import { ToolComponent } from './components/shared-components/tool/tool.component';
import { DynamicToolDirectiveDirective } from './dynamic-tool-directive.directive';
import { ToolbarItemTypes } from './helpers/common-enums';
import { Toolbar } from './models/toolbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(DynamicToolDirectiveDirective, { static: true }) dynamicChild!: DynamicToolDirectiveDirective;
  currentTools: any[] = [];
  constructor() { }
 
  ngOnInit(): void {
  }
 
  private renderDynamicComponent(selectedTool: Toolbar) {
    const componentRef = this.dynamicChild.viewContainerRef.createComponent(ToolComponent);
    this.currentTools.push(componentRef);
    componentRef.instance.toolInfo = selectedTool;
  }

  toolSelected(selectedTool: Toolbar){
    if(selectedTool?.shouldRender){
      if(selectedTool?.itemType === ToolbarItemTypes.IMAGE){
        //First open a file selector and if user selects a file, then render this component.
      } else {
        this.renderDynamicComponent(selectedTool);
      }
    }
    else {
      if(selectedTool?.itemType === ToolbarItemTypes.MOUSE){
        console.log("Change Mouse Icon to regular mouse.");
      } else if (selectedTool?.itemType === ToolbarItemTypes.PENIL){
        console.log("Change Mouse Icon to Pencil.");
      }
    }
  }
}
