import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MainEditorComponent } from './main-editor/main-editor.component';
import { WINDOW } from './injection-tokens/window-token';

@NgModule({
  declarations: [AppComponent, SideMenuComponent, MainEditorComponent],
  imports: [BrowserModule],
  providers: [{ provide: WINDOW, useFactory: () => window }],
  bootstrap: [AppComponent],
})
export class AppModule {}
