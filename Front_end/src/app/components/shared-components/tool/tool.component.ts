import { Component, Input, OnInit } from '@angular/core';
import { Toolbar } from '../../../models/toolbar';

@Component({
    selector: 'app-tool',
    templateUrl: './tool.component.html',
    styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {

    currentTool: Toolbar | undefined;

    @Input() set toolInfo(value: Toolbar) {
        this.currentTool = value;
        this.width = this.currentTool?.width ?? 300;
        this.height = this.currentTool?.height ?? 200;
        this.top = this.currentTool?.top ?? 100;
        this.left = this.currentTool?.left ?? 100;
    }

    width: number = 300;
    height: number = 200;
    left: number = 100;
    top: number = 100;


    constructor() { }

    ngOnInit(): void {
    }

}
