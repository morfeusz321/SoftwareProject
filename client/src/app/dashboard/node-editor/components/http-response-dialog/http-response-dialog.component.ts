import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component to display the http response dialog
 */
@Component({
  selector: 'app-http-response-dialog',
  templateUrl: './http-response-dialog.component.html',
  styleUrls: ['./http-response-dialog.component.css'],
})
export class HttpResponseDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { response: string; title: string }) {}
}
