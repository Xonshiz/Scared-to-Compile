import { ToolbarItemTypes } from "../helpers/common-enums";
import { ToolPosition } from "./tool-position";

export class Toolbar {
    id?: string;
    name?: string;
    icon?: string;
    shouldRender: boolean = false;
    itemType?: ToolbarItemTypes;
    editable?: boolean = false;
    position?: ToolPosition;
    isImage?: boolean = false;
}