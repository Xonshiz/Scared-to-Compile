import { Component, Input, OnInit } from '@angular/core';
import { Toolbar } from '../../../models/toolbar';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {
  currentTool: Toolbar | undefined;
  
  @Input() set toolInfo(value: Toolbar){
    this.currentTool = value;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
