import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextMenuRequest } from 'src/app/models/context-menu-request';
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
        this.left = this.currentTool.left ?? 100;
    }

    @Output() contextMenuClicked: EventEmitter<ContextMenuRequest> = new EventEmitter();
    @Output() deleteSelf: EventEmitter<void> = new EventEmitter<void>();

    width: number = 300;
    height: number = 200;
    left: number = 100;
    top: number = 100;
    numberCreated: number = 0;


    constructor() { }

    ngOnInit(): void {
    }

    contextMenuClickedEvent(event: ContextMenuRequest){
        event.currentInstanceNumber = this.numberCreated;
        this.contextMenuClicked.emit(event);
    }

}
