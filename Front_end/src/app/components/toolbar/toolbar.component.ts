import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ToolbarItemTypes } from '../../helpers/common-enums';
import { Toolbar } from '../../models/toolbar';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  
  @Input() Items: Toolbar[] = [
    {
      id: "item1",
      name: "Mouse",
      shouldRender: false,
      itemType: ToolbarItemTypes.MOUSE
    },
    {
      id: "item2",
      name: "Sticky Note",
      shouldRender: true,
      itemType: ToolbarItemTypes.STICKY_NOTE
    },
    {
      id: "item3",
      name: "Static Board",
      shouldRender: true,
      itemType: ToolbarItemTypes.STATIC_BOARD
    },
    {
      id: "item4",
      name: "Pencil",
      shouldRender: false,
      itemType: ToolbarItemTypes.PENIL
    },
    {
      id: "item5",
      name: "Image",
      shouldRender: true,
      itemType: ToolbarItemTypes.IMAGE
    }
  ];
  @Output() itemSelected: EventEmitter<Toolbar> = new EventEmitter();

    isExpanded: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  itemSelectedEvent(selectedItem: Toolbar){
    this.itemSelected.emit(selectedItem);
  }

}
