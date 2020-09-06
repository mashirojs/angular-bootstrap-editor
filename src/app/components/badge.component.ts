import { ComponentBase } from './component-base';

export class BadgeComponent extends ComponentBase {
  protected static readonly template = `
    <span class="d-inline mr-1 badge badge-primary">Badge</span>
  `;
}
