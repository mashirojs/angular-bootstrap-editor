import { ComponentBase } from './component-base';

export class AlertComponent extends ComponentBase {
  protected static readonly template = `
    <div class="alert alert-primary" role="alert" data-bootstrap="true">
        Alert
    </div>
  `;
}
