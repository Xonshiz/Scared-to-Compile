import { ContextMenuActions } from "./context-menu-actions";
import { Toolbar } from "./toolbar";

export class ContextMenuRequest {
    mouseX?: number;
    mouseY?: number;
    selectedToolContext?: Toolbar;
    srcElement!: string;
    contextEvent: any;
    contextMenuActions?: ContextMenuActions;
    currentInstanceNumber: number = 0;
}