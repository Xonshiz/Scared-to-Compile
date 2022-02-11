import { ToolbarItemTypes } from "../helpers/common-enums";

export class Toolbar {
    id?: string;
    name?: string;
    icon?: string;
    shouldRender: boolean = false;
    itemType?: ToolbarItemTypes;
}