import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component to display the image tip
 */
@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.component.html',
  styleUrls: ['./image-display.component.css'],
})
export class ImageDisplayComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagePath: string }) {}
}
