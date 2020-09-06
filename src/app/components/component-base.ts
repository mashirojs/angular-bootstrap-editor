import { v4 } from 'uuid';

export abstract class ComponentBase {
  protected static readonly template: string;
  static create(): HTMLElement {
    const root = document.createElement('div');
    root.innerHTML = this.template;
    const self = root.firstElementChild as HTMLElement;
    self.dataset.identifier = v4();
    return self;
  }
}
