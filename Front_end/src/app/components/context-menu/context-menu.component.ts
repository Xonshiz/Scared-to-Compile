import { Component, OnInit, Input, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';
import { ContextMenuOptionsEnum } from 'src/app/helpers/context-menu-enums';
import { ContextMenuRequest } from 'src/app/models/context-menu-request';
import { ContextMenuSelectionRequests } from 'src/app/models/context-menu-selection-request';


@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  @Input() contextMenuEvent: ContextMenuRequest | undefined;
  @Input() contextMenuSelector: any;
  @Input() contextMenuItems: any;

  @Output() contextMenuOptionSelected: EventEmitter<ContextMenuSelectionRequests> = new EventEmitter();

  isDisplayContextMenu: boolean = false;
  _currentMenuVisible = null;

  constructor(private elementRef: ElementRef) {
    this.isDisplayContextMenu = false;
  }

  ngOnInit(): void {
    this.initContextMenu();
  }

  initContextMenu() {
    console.log(this.contextMenuSelector);
    console.log(this.contextMenuEvent);
    if (this.contextMenuSelector && this.contextMenuEvent?.contextEvent) {
      this.contextMenuEvent.contextEvent.preventDefault();
      this.contextMenuEvent.contextEvent.stopPropagation();
      this.createContextMenu(this.contextMenuEvent.contextEvent.clientX, this.contextMenuEvent.contextEvent.clientY);
      this.contextMenuSelector.addEventListener('click', () => {
        this.closeCurrentlyOpenedMenu();
      });
    }
  }


  createContextMenu(x: any, y: any) {
    this.closeCurrentlyOpenedMenu();
    this.isDisplayContextMenu = true;
    if (this.isDisplayContextMenu && this.elementRef.nativeElement) {
      console.log(this.elementRef.nativeElement);
      const contextMenuDiv = this.elementRef.nativeElement.querySelector('.contextMenu');
      console.log(contextMenuDiv);
      if (contextMenuDiv) {
        this._currentMenuVisible = contextMenuDiv;
        contextMenuDiv.style.left = x + "px";
        contextMenuDiv.style.top = y + "px";
      }
    }
  }


  closeContextMenu(menu: any) {
    console.log(menu);
    menu.style.left = '0px';
    menu.style.top = '0px';
    this._currentMenuVisible = null;
  }


  closeCurrentlyOpenedMenu() {
    console.log(this._currentMenuVisible);
    if (this._currentMenuVisible !== null) {
      this.closeContextMenu(this._currentMenuVisible);
    }
  }

  onContextMenuClick(menuLink: ContextMenuOptionsEnum){
    if(this.contextMenuEvent?.contextMenuActions?.availableActions.some(x => x == menuLink)){
      this.contextMenuOptionSelected.emit({
        sourceEvent: this.contextMenuEvent,
        selectedOption: menuLink
      });
      return;
    }
  }


  /* close context menu on left click */
  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }


  /* close context menu on "ESC" key keypress */
  @HostListener('window:onkeyup')
  escKeyClick(): void {
    this.isDisplayContextMenu = false;
  }

}
