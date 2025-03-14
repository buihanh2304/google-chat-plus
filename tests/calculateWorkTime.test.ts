import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { ShowType, WorkFor } from '../assets/js/configs';
import { calculateWorkTime } from '../assets/js/utils';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

describe('[Worked]', () => {
  describe('checkin after checkout', () => {
    const checkinTime = dayjs().hour(7).minute(15).startOf('minute');

    test('checkin at 07:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(0).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('00:00');
    });
  });

  describe('checkin before 07:30', () => {
    const checkinTime = dayjs().hour(7).minute(15).startOf('minute');

    test('checkout after 07:30', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(31).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 00:01');
    });

    test('checkout after 12:00', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(10).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 04:30');
    });

    test('checkout after 13:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 04:45');
    });

    test('checkout after 19:30', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(19).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 11:05');
    });
  });

  describe('checkin after 07:30', () => {
    const checkinTime = dayjs().hour(7).minute(45).startOf('minute');

    test('checkout after 07:30', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(46).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 00:01');
    });

    test('checkout after 12:00', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(1).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 04:15');
    });

    test('checkout after 13:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 04:30');
    });

    test('checkout after 19:30', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(19).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 10:50');
    });
  });

  describe('checkin after 12:00', () => {
    const checkinTime = dayjs().hour(12).minute(1).startOf('minute');

    test('checkout after 12:00', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(1).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 00:00');
    });

    test('checkout after 13:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 00:15');
    });

    test('checkout after 19:30', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(19).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 06:35');
    });
  });

  describe('checkin after 13:15', () => {
    const checkinTime = dayjs().hour(13).minute(30).startOf('minute');

    test('checkout after 13:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(45).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 00:15');
    });

    test('checkout after 19:30', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(19).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.WORKED)).toBe('Worked 06:20');
    });
  });
});

describe('[Checkout Time]', () => {
  describe('checkin after checkout', () => {
    const checkinTime = dayjs().hour(7).minute(15).startOf('minute');

    test('checkin at 07:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(0).toDate());

      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.SIX)).toBe('00:00');
    });
  });

  describe('checkin before 07:30', () => {
    const checkinTime = dayjs().hour(7).minute(15).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.SIX)).toBe('Checkout at 14:45');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.EIGHT)).toBe('Checkout at 16:45');
    });
  });

  describe('checkin after 07:30', () => {
    const checkinTime = dayjs().hour(7).minute(45).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.SIX)).toBe('Checkout at 15:00');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.EIGHT)).toBe('Checkout at 17:00');
    });
  });

  describe('checkin after 12:00', () => {
    const checkinTime = dayjs().hour(12).minute(1).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(2).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.SIX)).toBe('Checkout at 19:15');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(2).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.EIGHT)).toBe('Checkout at 19:30 [for 06:15]');
    });
  });

  describe('checkin after 13:15', () => {
    const checkinTime = dayjs().hour(13).minute(30).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME, WorkFor.SIX)).toBe('Checkout at 19:30');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.CHECKOUT_TIME)).toBe('Checkout at 19:30 [for 06:00]');
    });
  });
});

describe('[Time Left]', () => {
  describe('checkin after checkout', () => {
    const checkinTime = dayjs().hour(7).minute(15).startOf('minute');

    test('checkin at 07:15', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(0).toDate());

      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.SIX)).toBe('00:00');
    });
  });

  describe('checkin before 07:30', () => {
    const checkinTime = dayjs().hour(7).minute(15).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.SIX)).toBe('06:55 left');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.EIGHT)).toBe('08:55 left');
    });
  });

  describe('checkin after 07:30', () => {
    const checkinTime = dayjs().hour(7).minute(45).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.SIX)).toBe('07:10 left');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(7).minute(50).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.EIGHT)).toBe('09:10 left');
    });
  });

  describe('checkin after 12:00', () => {
    const checkinTime = dayjs().hour(12).minute(1).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(2).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.SIX)).toBe('07:13 left');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(12).minute(2).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.EIGHT)).toBe('07:28 left [for 06:15]');
    });
  });

  describe('checkin after 13:15', () => {
    const checkinTime = dayjs().hour(13).minute(30).startOf('minute');

    test('Work for 6h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT, WorkFor.SIX)).toBe('06:00 left');
    });

    test('Work for 8h', () => {
      jest.useFakeTimers().setSystemTime(checkinTime.hour(13).minute(30).toDate());
      expect(calculateWorkTime(checkinTime, ShowType.TIME_LEFT)).toBe('06:00 left [for 06:00]');
    });
  });
});
