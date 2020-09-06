import { Component, OnInit } from '@angular/core';
import { ComponentMap } from '../components/component-map';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  dragStart(event: DragEvent, type: keyof typeof ComponentMap) {
    event.dataTransfer?.setData('text/plain', type);
  }
}
