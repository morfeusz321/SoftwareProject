import { DayEnum, IntervalsEnum, TimeEnum } from '@app/shared/enums/intervals.enum';

export interface ISchedule {
  interval: IntervalsEnum;
  repeatOn?: DayEnum[];
  monthRepeat?: number;
  time: TimeEnum;
}
