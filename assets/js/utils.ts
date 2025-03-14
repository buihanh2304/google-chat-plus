import dayjs, { Dayjs } from 'dayjs';
import { ShowType, WorkFor } from './configs';

export const calculateWorkTime = (from: Dayjs, mode: string, workFor: WorkFor = WorkFor.EIGHT) => {
  const firstCheckinTime = from.startOf('hour').hour(7).minute(30);
  const breakStart = from.startOf('hour').hour(12);
  const breakEnd = from.startOf('minute').hour(13).minute(15);
  const lastCheckoutTime = from.hour(19).minute(30).startOf('minute');

  if (from.isBefore(firstCheckinTime)) {
    from = firstCheckinTime;
  }

  let to = dayjs()

  if (from.isAfter(to)) {
    return '00:00';
  }

  let minutes = to.diff(from, 'minutes');
  let breakMinutes = 75;
  let realBreakMinutes = 0;

  if (from.isBefore(breakStart)) {
    if (to.isSameOrBefore(breakStart)) {
      realBreakMinutes = 0;
    } else if (to.isAfter(breakEnd)) {
      realBreakMinutes = 75;
    } else {
      realBreakMinutes = to.diff(breakStart, 'minutes');
    }

    minutes -= breakMinutes;
  } else if (from.isSameOrAfter(breakStart) && from.isSameOrBefore(breakEnd)) {
    if (to.isAfter(breakEnd)) {
      realBreakMinutes = breakEnd.diff(from, 'minutes');
    } else {
      realBreakMinutes = to.diff(from, 'minutes');
    }

    minutes -= breakEnd.diff(from, 'minutes');
    breakMinutes -= from.diff(breakStart, 'minutes');
  } else if (from.isAfter(breakEnd)) {
    breakMinutes = 0;
  }

  if (mode === ShowType.CHECKOUT_TIME) {
    const checkoutAt = from.add(parseInt(workFor), 'hours').add(breakMinutes, 'minute');

    if (checkoutAt.isAfter(lastCheckoutTime)) {
      const possibleMinutes = lastCheckoutTime.diff(from, 'minutes') - breakMinutes;

      return `Checkout at 19:30 [for ${convertMinutes(possibleMinutes)}]`;
    }

    return `Checkout at ${checkoutAt.format('HH:mm')}`;
  }

  if (mode === ShowType.TIME_LEFT) {
    minutes = Math.max(0, parseInt(workFor) * 60 - minutes);

    const checkoutAt = from.add(parseInt(workFor), 'hours').add(breakMinutes, 'minute');

    if (checkoutAt.isAfter(lastCheckoutTime)) {
      minutes -= checkoutAt.diff(lastCheckoutTime, 'minutes');
      const possibleMinutes = lastCheckoutTime.diff(from, 'minutes') - breakMinutes;

      return `${convertMinutes(minutes)} left [for ${convertMinutes(possibleMinutes)}]`;
    }

    return `${convertMinutes(minutes)} left`;
  }

  minutes += breakMinutes - realBreakMinutes;

  return `Worked ${convertMinutes(minutes)}`;
};

const convertMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes - hours * 60;

  return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;
}
