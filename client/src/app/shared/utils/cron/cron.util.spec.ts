import { DayEnum, IntervalsEnum, TimeEnum } from '@app/shared/enums/intervals.enum';
import { determineInterval, getCronFromSchedule, getScheduleFromCron } from '@app/shared/utils/cron/cron.util';

describe('cron tests', () => {
  it('should convert daily cron string to schedule', () => {
    const cron = '0 8 * * *';
    const expectedSchedule = {
      interval: IntervalsEnum.DAILY,
      time: TimeEnum.SLOT_9,
    };

    const schedule = getScheduleFromCron(cron);

    expect(schedule).toEqual(expectedSchedule);
  });

  it('should convert weekly cron string to schedule', () => {
    const cron = '0 10 * * 1,3,5';
    const expectedSchedule = {
      interval: IntervalsEnum.WEEKLY,
      time: TimeEnum.SLOT_11,
      repeatOn: [DayEnum.MONDAY, DayEnum.WEDNESDAY, DayEnum.FRIDAY],
    };

    const schedule = getScheduleFromCron(cron);

    expect(schedule).toEqual(expectedSchedule);
  });

  it('should convert monthly cron string to schedule', () => {
    const cron = '0 12 15 * *';
    const expectedSchedule = {
      interval: IntervalsEnum.MONTHLY,
      time: TimeEnum.SLOT_13,
      monthRepeat: 15,
    };

    const schedule = getScheduleFromCron(cron);

    expect(schedule).toEqual(expectedSchedule);
  });

  it('should convert yearly cron string to schedule', () => {
    const cron = '0 9 1 1 *';
    const expectedSchedule = {
      interval: IntervalsEnum.YEARLY,
      time: TimeEnum.SLOT_10,
    };

    const schedule = getScheduleFromCron(cron);

    expect(schedule).toEqual(expectedSchedule);
  });

  it('should convert quarterly cron string to schedule', () => {
    const cron = '0 14 1 */3 *';
    const expectedSchedule = {
      interval: IntervalsEnum.QUARTERLY,
      time: TimeEnum.SLOT_15,
    };

    const schedule = getScheduleFromCron(cron);

    expect(schedule).toEqual(expectedSchedule);
  });

  it('should convert half-yearly cron string to schedule', () => {
    const cron = '0 16 1 */6 *';
    const expectedSchedule = {
      interval: IntervalsEnum.HALF_YEARLY,
      time: TimeEnum.SLOT_17,
    };

    const schedule = getScheduleFromCron(cron);

    expect(schedule).toEqual(expectedSchedule);
  });
  it('should return IntervalsEnum.DAILY for valid daily cron parts', () => {
    const cronParts = ['0', '8', '*', '*', '*'];
    const expectedInterval = IntervalsEnum.DAILY;

    const interval = determineInterval(cronParts);

    expect(interval).toEqual(expectedInterval);
  });

  it('should return IntervalsEnum.WEEKLY for valid weekly cron parts', () => {
    const cronParts = ['0', '10', '*', '*', '1,3,5'];
    const expectedInterval = IntervalsEnum.WEEKLY;

    const interval = determineInterval(cronParts);

    expect(interval).toEqual(expectedInterval);
  });

  it('should return IntervalsEnum.MONTHLY for valid monthly cron parts', () => {
    const cronParts = ['0', '12', '15', '*', '*'];
    const expectedInterval = IntervalsEnum.MONTHLY;

    const interval = determineInterval(cronParts);

    expect(interval).toEqual(expectedInterval);
  });

  it('should return IntervalsEnum.YEARLY for valid yearly cron parts', () => {
    const cronParts = ['0', '9', '1', '1', '*'];
    const expectedInterval = IntervalsEnum.YEARLY;

    const interval = determineInterval(cronParts);

    expect(interval).toEqual(expectedInterval);
  });

  it('should return IntervalsEnum.QUARTERLY for valid quarterly cron parts', () => {
    const cronParts = ['0', '14', '1', '*/3', '*'];
    const expectedInterval = IntervalsEnum.QUARTERLY;

    const interval = determineInterval(cronParts);

    expect(interval).toEqual(expectedInterval);
  });

  it('should return IntervalsEnum.HALF_YEARLY for valid half-yearly cron parts', () => {
    const cronParts = ['0', '16', '1', '*/6', '*'];
    const expectedInterval = IntervalsEnum.HALF_YEARLY;

    const interval = determineInterval(cronParts);

    expect(interval).toEqual(expectedInterval);
  });


  it('should throw error for bad string', () => {
    const cronParts = ['*', '*', '*', '*', '*'];
    const expectedError = new Error('Invalid cron string');

    expect(() => determineInterval(cronParts)).toThrow(expectedError);
  });

  it('should convert daily schedule to cron string', () => {
    const schedule = {
      interval: IntervalsEnum.DAILY,
      time: TimeEnum.SLOT_9,
    };
    const expectedCron = '0 8 * * *';

    const cron = getCronFromSchedule(schedule);

    expect(cron).toEqual(expectedCron);
  });

  it('should convert weekly schedule to cron string', () => {
    const schedule = {
      interval: IntervalsEnum.WEEKLY,
      time: TimeEnum.SLOT_11,
      repeatOn: [DayEnum.MONDAY, DayEnum.WEDNESDAY, DayEnum.FRIDAY],
    };
    const expectedCron = '0 10 * * 1,3,5';

    const cron = getCronFromSchedule(schedule);

    expect(cron).toEqual(expectedCron);
  });

  it('should convert monthly schedule to cron string', () => {
    const schedule = {
      interval: IntervalsEnum.MONTHLY,
      time: TimeEnum.SLOT_13,
      monthRepeat: 15,
    };
    const expectedCron = '0 12 15 * *';

    const cron = getCronFromSchedule(schedule);

    expect(cron).toEqual(expectedCron);
  });

  it('should convert yearly schedule to cron string', () => {
    const schedule = {
      interval: IntervalsEnum.YEARLY,
      time: TimeEnum.SLOT_10,
    };
    const expectedCron = '0 9 1 1 *';

    const cron = getCronFromSchedule(schedule);

    expect(cron).toEqual(expectedCron);
  });

  it('should convert quarterly schedule to cron string', () => {
    const schedule = {
      interval: IntervalsEnum.QUARTERLY,
      time: TimeEnum.SLOT_15,
      monthRepeat: 1,
    };
    const expectedCron = '0 14 1 */3 *';

    const cron = getCronFromSchedule(schedule);

    expect(cron).toEqual(expectedCron);
  });

  it('should convert half-yearly schedule to cron string', () => {
    const schedule = {
      interval: IntervalsEnum.HALF_YEARLY,
      time: TimeEnum.SLOT_17,
      monthRepeat: 1,
    };
    const expectedCron = '0 16 1 */6 *';

    const cron = getCronFromSchedule(schedule);

    expect(cron).toEqual(expectedCron);
  });
});
