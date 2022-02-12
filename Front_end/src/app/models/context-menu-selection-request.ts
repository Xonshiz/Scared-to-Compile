import { ContextMenuOptionsEnum } from "../helpers/context-menu-enums";
import { ContextMenuRequest } from "./context-menu-request";

export class ContextMenuSelectionRequests {
    sourceEvent?: ContextMenuRequest;
    selectedOption?: ContextMenuOptionsEnum;
}