import { Component, Input } from '@angular/core';

/**
 * Component for the form card html content
 */
@Component({
  selector: 'app-form-card',
  templateUrl: './form-card.component.html',
  styleUrls: ['./form-card.component.scss'],
})
export class FormCardComponent {
  public headers = 'nodeEditor.headers.';

  @Input()
  type: string;
  constructor() {}
}
