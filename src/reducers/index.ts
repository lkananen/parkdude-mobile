import {combineReducers} from 'redux';
import {authReducer} from './authReducer';
import {errorReducer} from './errorReducer';
import {myReservationsReducer} from './myReservationsReducer';
import {calendarReducer} from './calendarReducer';
import {reservationReducer} from './reservationReducer';
import {parkingSpotReducer} from './parkingSpotReducer';
import {loadingReducer} from './loadingReducer';
import {cookieReducer} from './cookieReducer';


export const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
  loading: loadingReducer,
  myReservations: myReservationsReducer,
  calendar: calendarReducer,
  reservation: reservationReducer,
  parkingSpots: parkingSpotReducer,
  cookie: cookieReducer
});

export type RootReducer = ReturnType<typeof rootReducer>

export default rootReducer;
