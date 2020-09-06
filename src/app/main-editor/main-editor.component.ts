import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { WINDOW } from '../injection-tokens/window-token';
import { DOCUMENT } from '@angular/common';
import { ComponentMap } from '../components/component-map';
import { v4 } from 'uuid';

@Component({
  selector: 'app-main-editor',
  templateUrl: './main-editor.component.html',
  styleUrls: ['./main-editor.component.scss'],
})
export class MainEditorComponent implements OnInit {
  @ViewChild('container', { static: true, read: ElementRef }) private readonly container!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true, read: ElementRef }) private readonly canvas!: ElementRef<HTMLIFrameElement>;
  @ViewChild('wrap', { static: true, read: ElementRef }) private readonly wrap!: ElementRef<HTMLDivElement>;
  private rootElement!: HTMLDivElement;
  private elements: { element: HTMLElement; depth: number; parent: HTMLElement | null }[] = [];

  spacerStyle = {
    width: '',
    height: '',
    top: '0',
    left: '0',
    display: 'none',
    borderBottomStyle: '',
    borderTopStyle: '',
    borderLeftStyle: '',
    borderRightStyle: '',
  };

  constructor(@Inject(WINDOW) private window: Window, @Inject(DOCUMENT) private document: Document) {}

  readonly dndEvents = ((editor) => ({
    previousOverTarget: null as HTMLElement | null,
    overTarget: null as HTMLElement | null,
    insertPosition: 'none' as 'none' | 'before' | 'after',
    dragOver(event: DragEvent) {
      // editor.hideSpacer = false;
      const mp = {
        x: event.clientX - editor.wrap.nativeElement.getBoundingClientRect().x,
        y: event.clientY,
      };
      const hits = editor.elements
        .filter((item) => {
          const rect = item.element.getBoundingClientRect();
          return (
            mp.y >= rect.top && mp.y <= rect.height + rect.top && mp.x >= rect.left && mp.x <= rect.width + rect.left
          );
        })
        .sort((a, b) => (a.depth > b.depth ? -1 : 1));
      if (hits.length > 0) {
        this.previousOverTarget = this.overTarget;
        this.overTarget = hits[0].element;
        const rect = this.overTarget.getBoundingClientRect();
        const display = editor.window.getComputedStyle(this.overTarget).display;
        const mpInner = { x: mp.x - rect.left, y: mp.y - rect.top };
        editor.spacerStyle.display = 'block';
        editor.spacerStyle.width = `${rect.width}px`;
        editor.spacerStyle.height = `${rect.height}px`;
        editor.spacerStyle.top = `${rect.top}px`;
        editor.spacerStyle.left = `${rect.left}px`;
        editor.spacerStyle.borderLeftStyle = '';
        editor.spacerStyle.borderRightStyle = '';
        editor.spacerStyle.borderTopStyle = '';
        editor.spacerStyle.borderBottomStyle = '';
        if (display === 'block') {
          this.insertPosition = mpInner.y >= rect.height / 2 ? 'after' : 'before';
          this.insertPosition === 'before'
            ? (editor.spacerStyle.borderTopStyle = 'solid')
            : (editor.spacerStyle.borderBottomStyle = 'solid');
        } else {
          this.insertPosition = mpInner.x >= rect.width / 2 ? 'after' : 'before';
          this.insertPosition === 'before'
            ? (editor.spacerStyle.borderLeftStyle = 'solid')
            : (editor.spacerStyle.borderRightStyle = 'solid');
        }
      }
      event.preventDefault();
      event.stopPropagation();
    },
    drop(event: DragEvent) {
      if (this.previousOverTarget && this.insertPosition !== 'none') {
        const type = event.dataTransfer?.getData('text/plain') as keyof typeof ComponentMap;
        const component = ComponentMap[type];
        const element = component.create();

        if (this.previousOverTarget.dataset.root) {
          this.insertPosition === 'before' && editor.rootElement.children.length !== 0
            ? editor.rootElement.insertBefore(element, editor.rootElement.children[0])
            : editor.rootElement.appendChild(element);
        } else {
          this.insertPosition === 'before'
            ? this.previousOverTarget.insertAdjacentElement('beforebegin', element)
            : this.previousOverTarget.insertAdjacentElement('afterend', element);
        }
        editor.elements.push({ element, depth: 1, parent: editor.rootElement });
        editor.spacerStyle.display = 'none';
        const canvasHeight = editor.window.getComputedStyle(editor.rootElement).height;
        editor.canvas.nativeElement.style.height = `${canvasHeight}`;
        editor.wrap.nativeElement.style.height = `${canvasHeight}`;
      }
      event.preventDefault();
      event.stopPropagation();
    },
  }))(this);

  ngOnInit(): void {}

  frameOnLoad() {
    this.setup();
  }

  private setup() {
    const canvasDocument = this.canvas.nativeElement.contentDocument as Document;
    const canvasHeight = canvasDocument.body.getBoundingClientRect().height;
    this.rootElement = this.document.createElement('div');
    this.rootElement.dataset.root = 'true';
    this.rootElement.dataset.identifier = v4();
    this.rootElement.dataset.bootstrap = 'true';
    this.rootElement.style.minHeight = '100vh';
    this.rootElement.style.padding = '.5rem';
    this.canvas.nativeElement.style.height = `${canvasHeight}px`;
    this.wrap.nativeElement.style.height = `${canvasHeight}px`;
    canvasDocument.body.appendChild(this.rootElement);
    this.elements.push({ element: this.rootElement, depth: 0, parent: null });
  }
}
