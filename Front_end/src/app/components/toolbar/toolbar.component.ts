import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { common } from 'src/app/helpers/common-methods';
import { ToolbarItemTypes } from '../../helpers/common-enums';
import { Toolbar } from '../../models/toolbar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  Items: Toolbar[] = [
    {
      id: common.newGuid(),
      name: "Mouse",
      shouldRender: false,
      itemType: ToolbarItemTypes.MOUSE,
      icon: "ads_click"
    },
    {
      id: common.newGuid(),
      name: "Sticky Note",
      shouldRender: true,
      itemType: ToolbarItemTypes.STICKY_NOTE,
      icon: "note",
      editable: true
    },
    {
      id: common.newGuid(),
      name: "Static Board",
      shouldRender: true,
      itemType: ToolbarItemTypes.STATIC_BOARD,
      icon: "credit_card"
    },
    {
      id: common.newGuid(),
      name: "Pencil",
      shouldRender: false,
      itemType: ToolbarItemTypes.PENIL,
      icon: "draw"
    },
    {
      id: common.newGuid(),
      name: "Image",
      shouldRender: true,
      itemType: ToolbarItemTypes.IMAGE,
      icon: "image",
      isImageOnly: true,
      editable: false
    }
  ];
  @Output() itemSelected: EventEmitter<Toolbar> = new EventEmitter();

  isExpanded: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  itemSelectedEvent(selectedItem: Toolbar) {
    selectedItem.id = common.newGuid();
    this.itemSelected.emit(selectedItem);
  }

}
