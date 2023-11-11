import { ISchedule } from '../../interfaces/triggers/schedule.interface';
import { DayEnum, IntervalsEnum, TimeEnum } from '../../enums/intervals.enum';

//todo: FINISH THIS
export const getScheduleFromCron = (cron: string): ISchedule => {
  if (!cron) return null;
  const cronParts = cron.split(' ');
  const interval = determineInterval(cronParts);
  switch (interval) {
    case IntervalsEnum.DAILY:
      return {
        interval,
        time: Number(cronParts[1]) as TimeEnum,
      };
    case IntervalsEnum.WEEKLY:
      return {
        interval,
        time: Number(cronParts[1]) as TimeEnum,
        repeatOn: cronParts[4].split(',').map((day) => Number(day) as DayEnum),
      };
    case IntervalsEnum.MONTHLY:
      return {
        interval,
        time: Number(cronParts[1]) as TimeEnum,
        monthRepeat: Number(cronParts[2]),
      };
    case IntervalsEnum.YEARLY:
      return {
        interval,
        time: Number(cronParts[1]) as TimeEnum,
      };
    case IntervalsEnum.QUARTERLY:
      return {
        interval,
        time: Number(cronParts[1]) as TimeEnum,
      };
    case IntervalsEnum.HALF_YEARLY:
      return {
        interval,
        time: Number(cronParts[1]) as TimeEnum,
      };
  }
};

export const determineInterval = (cronParts: string[]): IntervalsEnum => {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronParts.slice(0, 5);

  if (minute === '0' && hour !== '*') {
    if (dayOfMonth === '1' && dayOfWeek === '*') {
      if (month === '1' && dayOfMonth === '1') return IntervalsEnum.YEARLY;
      if (month === '*/3') return IntervalsEnum.QUARTERLY;
      if (month === '*/6') return IntervalsEnum.HALF_YEARLY;
    }
    if (dayOfMonth !== '*' && month === '*' && dayOfWeek === '*') return IntervalsEnum.MONTHLY;
    if (dayOfMonth === '*' && month === '*') {
      if (dayOfWeek !== '*') return IntervalsEnum.WEEKLY;
      if (dayOfWeek === '*') return IntervalsEnum.DAILY;
    }
  }

  throw new Error('Invalid cron string');
};

/*
# +---------------- minute (0 - 59)
# |  +------------- hour (0 - 23)
# |  |  +---------- day of month (1 - 31)
# |  |  |  +------- month (1 - 12)
# |  |  |  |  +---- day of week (0 - 7) (Sunday=0 or 7)
# |  |  |  |  |
# *  *  *  *  *
#--------------------------------------------------------------------------*/
export const getCronFromSchedule = (schedule: ISchedule): string => {
  switch (schedule.interval) {
    case IntervalsEnum.DAILY:
      return `0 ${schedule.time} * * *`;
    case IntervalsEnum.WEEKLY:
      return `0 ${schedule.time} * * ${schedule.repeatOn.join(',')}`;
    case IntervalsEnum.MONTHLY:
      return `0 ${schedule.time} ${schedule.monthRepeat} * *`;
    case IntervalsEnum.YEARLY:
      return `0 ${schedule.time} 1 1 *`;
    case IntervalsEnum.QUARTERLY:
      return `0 ${schedule.time} 1 */3 *`;
    case IntervalsEnum.HALF_YEARLY:
      return `0 ${schedule.time} 1 */6 *`;
    default:
      return '';
  }
};
