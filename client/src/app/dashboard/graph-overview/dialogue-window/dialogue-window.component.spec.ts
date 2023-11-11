import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DialogueWindowComponent} from "@app/dashboard/graph-overview/dialogue-window/dialogue-window-component";
import {TranslocoModule} from "@ngneat/transloco";

// Create a mock class that extends MatDialogRef
class MatDialogRefMock {
  close(result?: any): void {}
}

describe('DialogueWindowComponent', () => {
  let component: DialogueWindowComponent;
  let fixture: ComponentFixture<DialogueWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogueWindowComponent],
      imports: [TranslocoModule],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogueWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with newName when onConfirm is called', () => {
    const dialogRefSpy = spyOn(component.DialogRef, 'close');
    const newName = 'John Doe';

    component.newName = newName;
    component.onConfirm();

    expect(dialogRefSpy).toHaveBeenCalledWith(newName);
  });

  it('should close the dialog with true when onConfirm is called without newName', () => {
    const dialogRefSpy = spyOn(component.DialogRef, 'close');

    component.onConfirm();

    expect(dialogRefSpy).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when onCancel is called', () => {
    const dialogRefSpy = spyOn(component.DialogRef, 'close');

    component.onCancel();

    expect(dialogRefSpy).toHaveBeenCalledWith(false);
  });
});
