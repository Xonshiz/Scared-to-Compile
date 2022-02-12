import { Component, ElementRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Status } from 'src/app/helpers/common-enums';
import { Toolbar } from 'src/app/models/toolbar';
import { EventEmitter } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { ContextMenuRequest } from 'src/app/models/context-menu-request';
import { ContextMenuActions } from 'src/app/models/context-menu-actions';
import { ContextMenuOptionsEnum } from 'src/app/helpers/context-menu-enums';


@Component({
    selector: 'app-sticky-note',
    templateUrl: './sticky-note.component.html',
    styleUrls: ['./sticky-note.component.scss']
})
export class StickyNoteComponent implements OnInit {


    showContextMenu: boolean = false;
    menuTopLeftPosition = { x: '0', y: '0' }
    currentTool: Toolbar | undefined;
    model: string = '';
    currentContextMenuOptions: ContextMenuActions = {
        availableActions: [ContextMenuOptionsEnum.DELETE]
    };

    @Input() set toolInfo(value: Toolbar) {
        this.currentTool = value;
    }

    @Input() width: number = 0;
    @Input() height: number = 0;
    @Input() left: number = 0;
    @Input() top: number = 0;

    @Output() contextMenuClicked: EventEmitter<ContextMenuRequest> = new EventEmitter();
    @Output() deleteSelf: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild("box") public box: ElementRef | undefined;

    private boxPosition: { left: number, top: number } = { left: 0, top: 0 };
    private containerPos: { left: number, top: number, right: number, bottom: number } = { left: 0, top: 0, right: 0, bottom: 0 };
    public mouse: { x: number, y: number } = { x: 0, y: 0 };
    public status: Status = Status.OFF;
    private mouseClick: { x: number, y: number, left: number, top: number } = { x: 0, y: 0, left: 0, top: 0 };

    @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger | undefined;

    constructor(private collaborationService: CollaborationService) {
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.loadBox();
        this.loadContainer();
    }

    setValue($event: any) {
        if (this.currentTool) {
            this.currentTool.data = $event.textContent;
            this.collaborationService.sendComponent(this.currentTool);
        }
    }

    private loadBox() {
        const { left, top } = this.box?.nativeElement.getBoundingClientRect() ?? { left: 0, top: 0 };
        this.boxPosition = { left, top };
    }

    private loadContainer() {
        const left = this.boxPosition.left - this.left;
        const top = this.boxPosition.top - this.top;
        const right = window.innerWidth;
        const bottom = window.innerHeight;
        this.containerPos = { left, top, right, bottom };
    }

    setStatus(event: MouseEvent, status: number) {
        if (status === 1) event.stopPropagation();
        else if (status === 2) this.mouseClick = { x: event.clientX, y: event.clientY, left: this.left, top: this.top };
        else this.loadBox();
        this.status = status;
    }

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.mouse = { x: event.clientX, y: event.clientY };

        if (this.status === Status.RESIZE) this.resize();
        else if (this.status === Status.MOVE) this.move();
    }

    private resize() {
        //if (this.resizeCondMeet()) {
        this.width = Number(this.mouse.x > this.boxPosition.left) ? this.mouse.x - this.boxPosition.left : 0;
        this.height = Number(this.mouse.y > this.boxPosition.top) ? this.mouse.y - this.boxPosition.top : 0;
        if (this.currentTool) {
            this.currentTool.width = this.width;
            this.currentTool.height = this.height;
            this.collaborationService.sendComponent(this.currentTool);
        }
        //}
    }

    private resizeCondMeet() {
        return (this.mouse.x < this.containerPos.right && this.mouse.y < this.containerPos.bottom);
    }

    private move() {
        this.left = this.mouseClick.left + (this.mouse.x - this.mouseClick.x);
        this.top = this.mouseClick.top + (this.mouse.y - this.mouseClick.y);
        if (this.currentTool) {
            this.currentTool.left = this.left;
            this.currentTool.top = this.top;
            this.collaborationService.sendComponent(this.currentTool);
        }
    }

    stickyNoteContextClick(event: any) {
        if(this.currentTool && event){
            this.contextMenuClicked.emit(<ContextMenuRequest>{
                mouseX: event?.x,
                mouseY: event?.x,
                selectedToolContext: this.currentTool,
                srcElement: event.srcElement,
                contextEvent: event,
                contextMenuActions: this.currentContextMenuOptions
            });
        }
    }
}
