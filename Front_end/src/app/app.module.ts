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


@NgModule({
  declarations: [
    AppComponent,
    ToolComponent,
    ToolbarComponent,
    DynamicToolDirectiveDirective,
    StickyNoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [CollaborationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
