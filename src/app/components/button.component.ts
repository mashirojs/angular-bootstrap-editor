import { ComponentBase } from './component-base';

export class ButtonComponent extends ComponentBase {
  protected static readonly template = `
    <button type="button" class="btn btn-primary d-inline mr-1">Button</button>
  `;
}
