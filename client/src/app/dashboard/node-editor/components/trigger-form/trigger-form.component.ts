import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DayEnum, DayEnumToDay, IntervalsEnum, TimeEnum, TimeEnumToTime } from '@app/shared/enums/intervals.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

/**
 * Component for the trigger form
 */
@UntilDestroy()
@Component({
  selector: 'app-trigger-form',
  templateUrl: './trigger-form.component.html',
  styleUrls: ['./trigger-form.component.scss'],
})
export class TriggerFormComponent implements OnInit {
  readonly daysLabels = DayEnumToDay;
  readonly timeLabels = TimeEnumToTime;

  public scheduleFormText = 'nodeEditor.scheduleForm.';

  @Input() formGroupName: string;
  intervalTypesEnum = IntervalsEnum;

  triggerForm: FormGroup;
  intervalTypes = Object.values(IntervalsEnum);
  weekDays = Object.values(DayEnum).filter((day) => typeof day !== 'string');
  timeOfDayOptions = Object.values(TimeEnum).filter((time) => typeof time !== 'string');
  monthRepeatOptions = Array(31)
    .fill(0)
    .map((x, i) => i + 1);

  /**
   * Constructor for the trigger form component
   * @param rootFormGroup - root form group
   */
  constructor(private rootFormGroup: FormGroupDirective) {}

  /**
   * OnInit function to initialize the component with the correct form
   */
  ngOnInit(): void {
    this.triggerForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.triggerForm.controls['interval'].valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value === IntervalsEnum.WEEKLY) {
        this.triggerForm.removeControl('monthRepeat');
        this.triggerForm.addControl('repeatOn', new FormControl([], Validators.required), { emitEvent: false });
      } else if (value === IntervalsEnum.MONTHLY) {
        this.triggerForm.removeControl('repeatOn');
        this.triggerForm.addControl('monthRepeat', new FormControl('', Validators.required), { emitEvent: false });
      } else {
        this.triggerForm.removeControl('repeatOn');
        this.triggerForm.removeControl('monthRepeat');
      }
    });
  }
}
