export enum IntervalsEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY',
}

export enum TimeEnum {
  SLOT_1,
  SLOT_2,
  SLOT_3,
  SLOT_4,
  SLOT_5,
  SLOT_6,
  SLOT_7,
  SLOT_8,
  SLOT_9,
  SLOT_10,
  SLOT_11,
  SLOT_12,
  SLOT_13,
  SLOT_14,
  SLOT_15,
  SLOT_16,
  SLOT_17,
  SLOT_18,
  SLOT_19,
  SLOT_20,
  SLOT_21,
  SLOT_22,
  SLOT_23,
  SLOT_24,
}

export const TimeEnumToTime = {
  [TimeEnum.SLOT_1]: '00:00',
  [TimeEnum.SLOT_2]: '01:00',
  [TimeEnum.SLOT_3]: '02:00',
  [TimeEnum.SLOT_4]: '03:00',
  [TimeEnum.SLOT_5]: '04:00',
  [TimeEnum.SLOT_6]: '05:00',
  [TimeEnum.SLOT_7]: '06:00',
  [TimeEnum.SLOT_8]: '07:00',
  [TimeEnum.SLOT_9]: '08:00',
  [TimeEnum.SLOT_10]: '09:00',
  [TimeEnum.SLOT_11]: '10:00',
  [TimeEnum.SLOT_12]: '11:00',
  [TimeEnum.SLOT_13]: '12:00',
  [TimeEnum.SLOT_14]: '13:00',
  [TimeEnum.SLOT_15]: '14:00',
  [TimeEnum.SLOT_16]: '15:00',
  [TimeEnum.SLOT_17]: '16:00',
  [TimeEnum.SLOT_18]: '17:00',
  [TimeEnum.SLOT_19]: '18:00',
  [TimeEnum.SLOT_20]: '19:00',
  [TimeEnum.SLOT_21]: '20:00',
  [TimeEnum.SLOT_22]: '21:00',
  [TimeEnum.SLOT_23]: '22:00',
  [TimeEnum.SLOT_24]: '23:00',
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
export enum DayEnum {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 0,
}

export const DayEnumToDay = {
  [DayEnum.MONDAY]: 'Monday',
  [DayEnum.TUESDAY]: 'Tuesday',
  [DayEnum.WEDNESDAY]: 'Wednesday',
  [DayEnum.THURSDAY]: 'Thursday',
  [DayEnum.FRIDAY]: 'Friday',
  [DayEnum.SATURDAY]: 'Saturday',
  [DayEnum.SUNDAY]: 'Sunday',
};
