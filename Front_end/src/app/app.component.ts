import { Component, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToolComponent } from './components/shared-components/tool/tool.component';
import { DynamicToolDirectiveDirective } from './dynamic-tool-directive.directive';
import { ToolbarItemTypes } from './helpers/common-enums';
import { Toolbar } from './models/toolbar';
import { CollaborationService } from './services/collaboration.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
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

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e:any) {
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
            y: this.cursorY
        };
        console.log(`from app component: x axis: ${message.x} y axis: ${message.y}`);
        this.collaborationService.sendMessage(message);
        //onOwnCursorMove(trueX, trueY);

        this.cursorXprev = this.cursorX;
        this.cursorYprev = this.cursorY;
    }
    constructor(private collaborationService: CollaborationService) {
        this.collaborationService.startRecievingData();
    }

    ngOnInit(): void {
        this.collaborationService.message.subscribe(data => {
            let dot = document.getElementById(data.socketId);
            if (!dot && data.socketId) {
                dot = this.createDot(data.socketId);
            }
            // dot.style.left = `${data.x-7}px`
            // dot.style.top = `${data.y-7}px`
            if (dot) {
                //dot.style.left = `${(data.x - 5 + this.offsetX) * this.scale}px`;
                //dot.style.top = `${(data.y - 5 + this.offsetY) * this.scale}px`;
                dot.style.left = `${data.x}px`;
                dot.style.top = `${data.y}px`;
                dot.style.backgroundColor = 'black';//data.colour;
            }
            console.log(data);
        });

        this.collaborationService.otherComponent.subscribe(data => {
            var component = this.currentToolsComponent.find(x => x.id == data.id);
            if (!component) {
                this.toolSelected(data);
            } else {
                let updateCurrentTool = this.currentTools.find(x => x.instance.currentTool.id == data.id);
                if (updateCurrentTool) {
                    updateCurrentTool.instance.toolInfo = data;
                }
            }
        });
    }

    createDot(socketId:any) {
        const dot = document.createElement('div')
        dot.className = "dot";
        dot.id = socketId;
        dot.style.position = 'fixed';
        document.body.appendChild(dot);
        return dot;
    }

    private renderDynamicComponent(selectedTool: Toolbar) {
        const componentRef = this.dynamicChild.viewContainerRef.createComponent(ToolComponent);
        this.currentTools.push(componentRef);
        componentRef.instance.toolInfo = selectedTool;
        this.currentToolsComponent.push(selectedTool);
        this.collaborationService.sendComponent(selectedTool);
    }

    toolSelected(selectedTool: Toolbar) {
        if (selectedTool?.shouldRender) {
            if (selectedTool?.itemType === ToolbarItemTypes.IMAGE) {
                //First open a file selector and if user selects a file, then render this component.
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
