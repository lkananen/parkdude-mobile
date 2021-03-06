import {createMarkedDatesObject, toDateString} from '../../src/Utils';
import {Colors} from '../../assets/colors';
import {CalendarType} from '../../src/types';

const todayDate = new Date();
const testDay = toDateString(todayDate);
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const testDay2 = toDateString(tomorrowDate);
const testUserReservations = [{id: '123-id', name: '315'}];

describe('createMarkedDatesObject function', () => {
  it('should return empty object', () => {
    const expectedResult = {};
    const actualResult = createMarkedDatesObject([], {});
    expect(actualResult).toEqual(expectedResult);
  });

  it('no reservations', () => {
    const expectedResult = {
      [testDay]: {
        selected: false,
        selectedColor: Colors.WHITE,
        disabled: false
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: [], availableSpaces: 2}],
      {},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('user has reservation', () => {
    const expectedResult = {
      [testDay]: {
        selected: true,
        selectedColor: Colors.GREEN,
        disabled: true
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: testUserReservations, availableSpaces: 2}],
      {},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('no available spots for day', () => {
    const expectedResult = {
      [testDay]: {
        selected: false,
        selectedColor: Colors.WHITE,
        disabled: true
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: [], availableSpaces: 0}],
      {},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('user has reservations and there is no other available spots', () => {
    const expectedResult = {
      [testDay]: {
        selected: true,
        selectedColor: Colors.GREEN,
        disabled: true
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: testUserReservations, availableSpaces: 0}],
      {},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('User has active selection on calendar', () => {
    const expectedResult = {
      [testDay]: {
        selected: true,
        selectedColor: Colors.YELLOW,
        disabled: false
      }
    };
    const actualResult = createMarkedDatesObject(
      [],
      {[testDay]: {selected: true, selectedColor: Colors.YELLOW}},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('User has active selection on calendar and own reservations', () => {
    const expectedResult = {
      [testDay]: {
        selected: true,
        selectedColor: Colors.GREEN,
        disabled: true
      },
      [testDay2]: {
        selected: true,
        selectedColor: Colors.YELLOW,
        disabled: false
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: testUserReservations, availableSpaces: 3}],
      {[testDay2]: {selected: true, selectedColor: Colors.YELLOW}},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('User tries to select a day where is his own active reservation', () => {
    const expectedResult = {
      [testDay]: {
        selected: true,
        selectedColor: Colors.GREEN,
        disabled: true
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: testUserReservations, availableSpaces: 3}],
      {[testDay]: {selected: true, selectedColor: Colors.YELLOW}},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });

  it('User tries to select a day where is no spots available', () => {
    const expectedResult = {
      [testDay]: {
        selected: false,
        selectedColor: Colors.WHITE,
        disabled: true
      }
    };
    const actualResult = createMarkedDatesObject(
      [{date: testDay, spacesReservedByUser: [], availableSpaces: 0}],
      {[testDay]: {selected: true, selectedColor: Colors.YELLOW}},
      CalendarType.RESERVATION
    );
    expect(actualResult).toEqual(expectedResult);
  });
});
