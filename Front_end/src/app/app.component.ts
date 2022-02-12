import { Component, HostListener, ViewChild, ViewEncapsulation, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { ToolComponent } from './components/shared-components/tool/tool.component';
import { DynamicToolDirectiveDirective } from './dynamic-tool-directive.directive';
import { ToolbarItemTypes } from './helpers/common-enums';
import { ContextMenuOptionsEnum } from './helpers/context-menu-enums';
import { ContextMenuOptions } from './models/context-menu-options';
import { Toolbar } from './models/toolbar';
import { CollaborationService } from './services/collaboration.service';
import { CrudService } from './services/crud.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
    @ViewChild(DynamicToolDirectiveDirective, { static: true }) dynamicChild!: DynamicToolDirectiveDirective;
    currentTools: any[] = [];
    currentToolsComponent: Toolbar[] = [];
    cursorX = 0;
    cursorY = 0;
    cursorXprev = 0;
    cursorYprev = 0;

    offsetX = 0;
    offsetY = 0;
    scale = 1;
    id: string;
    users: { name: string, pointerAdded: boolean }[] = [];

    currentSelectedTool!: Toolbar;

    menuEvent: any;
    contextMenuSelector: string = "";
    rightClickMenuItems: ContextMenuOptions[] = [];

    private subs: Subscription[] = [];

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e: any) {
        const lastTouches = [null, null];

        var currentStroke = [];

        this.cursorX = e.pageX;
        this.cursorY = e.pageY;

        if (this.cursorXprev) {
            this.offsetX += (this.cursorX - this.cursorXprev) / this.scale;
            this.offsetY += (this.cursorY - this.cursorYprev) / this.scale;
        }
        //    redraw()
        //} else if (drawing) {
        //    addToStroke(toTrueX(cursorX), toTrueY(cursorY), penColour);
        //    drawLine(cursorXprev, cursorYprev, cursorX, cursorY, penColour);
        //}
        //const trueX = (this.cursorX / this.scale) - this.offsetX;
        //const trueY = (this.cursorY / this.scale) - this. offsetY;
        var message = {
            x: this.cursorX,
            y: this.cursorY,
            user: this.id
        };
        //console.log(`from app component: x axis: ${message.x} y axis: ${message.y}`);
        this.collaborationService.sendMessage(message);
        //onOwnCursorMove(trueX, trueY);

        this.cursorXprev = this.cursorX;
        this.cursorYprev = this.cursorY;
    }

    @HostListener('window:beforeunload', ['$event'])
    allSave() {
        this.save();
    }


    constructor(private collaborationService: CollaborationService,
        private crudService: CrudService,
        private route: ActivatedRoute) {
        this.collaborationService.startRecievingData();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        if (this.currentToolsComponent?.length) {
            this.crudService.saveAllStickyNotes(this.currentToolsComponent).subscribe(res => {
                console.log(res);
            });
        }
        // unsubscribe from all on destroy
        this.subs.forEach(sub => sub.unsubscribe());
    }

    save() {
        if (this.currentToolsComponent?.length) {
            this.crudService.saveAllStickyNotes(this.currentToolsComponent).subscribe(res => {
                console.log(res);
            });
        }
    }

    ngOnInit(): void {
        this.collaborationService.disconnectedSocket.subscribe(socketId => {
            let dot = document.getElementById(socketId);
            if (dot) {
                dot.remove();
            }
        });
        this.collaborationService.message.subscribe(data => {
            let dot = document.getElementById(data.socketId);
            let ispointerAdded = this.users.find(x => x.name == data.user)?.pointerAdded;
            if (!dot && data.socketId && !ispointerAdded) {
                if (data.user) {
                    dot = this.createDot(data.socketId, data.user);
                    this.users.push({ name: data.user, pointerAdded: true });
                }
            }
            // dot.style.left = `${data.x-7}px`
            // dot.style.top = `${data.y-7}px`
            if (dot) {
                //dot.style.left = `${(data.x - 5 + this.offsetX) * this.scale}px`;
                //dot.style.top = `${(data.y - 5 + this.offsetY) * this.scale}px`;
                dot.style.left = `${data.x}px`;
                dot.style.top = `${data.y}px`;
                //dot.style.backgroundColor = 'black';//data.colour;
            }
            //console.log(data);
        });

        this.collaborationService.otherComponent.subscribe(data => {
            var component = this.currentToolsComponent.find(x => x.id == data.id);
            if (!component) {
                this.toolSelected(data);
            } else {
                let updateCurrentTool = this.currentTools.find(x => x.instance.currentTool.id == data.id);
                let index = this.currentToolsComponent.findIndex(x => x.id == data.id);
                this.currentToolsComponent[index] = data;
                if (updateCurrentTool) {
                    updateCurrentTool.instance.toolInfo = data;
                }
            }
        });

        this.crudService.getAllStickyNotes().subscribe((res: Toolbar[]) => {
            res.forEach(component => {
                this.renderDynamicComponent(component);
            });
        });

        // this.route.snapshot.paramMap.get('id');
        let name = this.route.params.subscribe((data) => {
            if (data['id']) {
                this.id = data['id'];
                this.users.push({ name: this.id, pointerAdded: false });
            }
        });
    }

    createDot(socketId: any, userName: string) {
        const dot = document.createElement('div')
        dot.className = "dot";
        dot.id = socketId;
        dot.innerHTML = userName;
        dot.style.position = 'fixed';
        document.body.appendChild(dot);
        return dot;
    }

    private renderDynamicComponent(selectedTool: Toolbar) {
        const componentRef = this.dynamicChild.viewContainerRef.createComponent(ToolComponent);
        componentRef.instance.numberCreated = this.currentTools.length;
        this.currentTools.push(componentRef);
        componentRef.instance.toolInfo = selectedTool;
        this.currentToolsComponent.push(selectedTool);
        this.collaborationService.sendComponent(selectedTool);
        const selfDeleteSub = componentRef.instance.deleteSelf
            .pipe(tap(() => {
                componentRef.destroy();
            }))
            .subscribe();
        // add subscription to array for clean up
        this.subs.push(selfDeleteSub);
        const contextMenuSubs = componentRef.instance.contextMenuClicked.subscribe((contextMenuData) => {
            console.log(`Got this: ${contextMenuData}`);
            this.menuEvent = contextMenuData;
            this.contextMenuSelector = contextMenuData?.srcElement;
            this.rightClickMenuItems = <ContextMenuOptions[]>[
                {
                    menuText: 'Delete',
                    menuLink: ContextMenuOptionsEnum.DELETE,
                }
            ];
            this.createContextMenuComponent();
            this.subs.push(contextMenuSubs);
        });
    }

    createContextMenuComponent() {
        const componentRef = this.dynamicChild.viewContainerRef.createComponent(ContextMenuComponent);
        (<ContextMenuComponent>componentRef.instance).contextMenuEvent = this.menuEvent;
        (<ContextMenuComponent>componentRef.instance).contextMenuSelector = this.contextMenuSelector;
        (<ContextMenuComponent>componentRef.instance).contextMenuItems = this.rightClickMenuItems;
        const contextMenuSubs = componentRef.instance.contextMenuOptionSelected.subscribe((data) => {
            if (data) {
                var currentToolIndex = this.currentToolsComponent.findIndex(x => x.id === data.sourceEvent?.selectedToolContext?.id);
                if (currentToolIndex > -1) {
                    this.currentToolsComponent.splice(currentToolIndex, 1);
                    this.dynamicChild.viewContainerRef.get(currentToolIndex)?.destroy();
                }
            }
        });
        this.subs.push(contextMenuSubs);
    }

    toolSelected(selectedTool: Toolbar) {
        if (selectedTool?.id) {
            this.currentSelectedTool = selectedTool;
            if (selectedTool?.shouldRender) {
                if (selectedTool?.itemType === ToolbarItemTypes.IMAGE && !selectedTool.imageSource) {
                    //First open a file selector and if user selects a file, then render this component.
                    this.openFileDialog();
                } else {
                    this.renderDynamicComponent(selectedTool);
                }
            }
            else {
                if (selectedTool?.itemType === ToolbarItemTypes.MOUSE) {
                    console.log("Change Mouse Icon to regular mouse.");
                } else if (selectedTool?.itemType === ToolbarItemTypes.PENIL) {
                    console.log("Change Mouse Icon to Pencil.");
                }
            }
        }
    }

    openFileDialog() {
        var hiddenImageFileSelector = document?.querySelector('#hiddenImageFileSelector');
        if (hiddenImageFileSelector instanceof HTMLElement) {
            hiddenImageFileSelector?.click();
        }
    }

    fileSelected(e: any) {
        if (e?.target?.files && FileReader) {
            var fr = new FileReader();
            var currentInstance = this;
            fr.onload = function () {
                //Saving base64 string as the source of image.
                currentInstance.currentSelectedTool.imageSource = fr.result;
                currentInstance.renderDynamicComponent(currentInstance.currentSelectedTool);
            }
            fr.readAsDataURL(e?.target?.files[0]);
        }
    }
}
