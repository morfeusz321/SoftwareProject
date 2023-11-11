import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Component for the dialogue window
 */
@Component({
  selector: 'app-dialogue-window',
  templateUrl: './dialogue-window.component.html',
  styleUrls: ['./dialogue-window.component.scss'],
})
export class DialogueWindowComponent {
  @Input() newName: string;

  /**
   * Constructor for the dialogue window
   * @param DialogRef - Reference to the dialogue window
   * @param data - Data to be displayed in the dialogue window
   */
  constructor(
    public DialogRef: MatDialogRef<DialogueWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; messageOnConfirm: string; messageOnCancel: string }
  ) {}

  /**
   * Function to confirm the dialogue window and close with new name
   */
  onConfirm(): void {
    this.DialogRef.close(this.newName || true);
  }

  /**
   * Function to cancel the dialogue window
   */
  onCancel(): void {
    this.DialogRef.close(false);
  }
}
