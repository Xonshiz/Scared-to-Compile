import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicToolDirectiveDirective } from './dynamic-tool-directive.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { StickyNoteComponent } from './components/sticky-note/sticky-note.component';
import { ToolComponent } from './components/shared-components/tool/tool.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CollaborationService } from './services/collaboration.service';
import { HttpClientModule } from '@angular/common/http';
import { BoardMenuComponent } from './components/board-menu/board-menu.component';
import { NotifBarComponent } from './components/notif-bar/notif-bar.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ToolComponent,
    ToolbarComponent,
    DynamicToolDirectiveDirective,
    StickyNoteComponent,
    BoardMenuComponent,
    NotifBarComponent,
    MainComponent,
    ContextMenuComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [CollaborationService],
  bootstrap: [MainComponent]

})
export class AppModule { }
