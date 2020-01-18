import React, {Component} from 'react';
import {Calendar} from 'react-native-calendars';
import {ConnectedProps, connect} from 'react-redux';
import {NavigationScreenProp} from 'react-navigation';
import {Marking, CalendarDateObject, CalendarType, BasicParkingSpotData} from '../types';
import {RootReducer} from '../reducers';
import {Colors} from '../../assets/colors';
import {createMarkedDatesObject, getMonthRangeForURL} from '../Utils';
import {getCalendarSpots} from '../actions/calendarActions';

type Props = ConnectedProps<typeof connector> & {
  navigation: NavigationScreenProp<any, any>;
  markingType: Marking;
  calendarType: CalendarType;
  updateUserSelectedDates?: (userSelectedDates: Record<string, any>) => void;
  setParkingSpot?: (spot: BasicParkingSpotData) => void;
  calendarData?: any;
}

interface CalendarState {
  calendarData: any; // ******************** !!
  userSelectedDates: Record<string, any>;
  currentMonth: number;
  currentYear: number;
}

class ReservationCalendar extends Component<Props, CalendarState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      calendarData: [],
      userSelectedDates: {},
      currentMonth: 0,
      currentYear: 0
    };
    this.toggleSelectedDay = this.toggleSelectedDay.bind(this);
  }

  componentDidMount() {
    const date = new Date();
    this.setState({currentMonth: date.getMonth()+1, currentYear: date.getFullYear()}, () => {
      if (this.props.calendarType === CalendarType.RESERVATION) {
        const dateObject = {
          dateString: undefined,
          day: undefined,
          month: this.state.currentMonth,
          timestamp: undefined,
          year: this.state.currentYear
        };
        this.fetchDataForMonth(dateObject);
        this.props.navigation.addListener('willFocus', () => {
          this.fetchDataForMonth({
            dateString: undefined,
            day: undefined,
            month: this.state.currentMonth,
            timestamp: undefined,
            year: this.state.currentYear
          });
        });
      }
    });
    if (this.props.calendarType === CalendarType.RELEASE) {
      this.setState({calendarData: this.props.calendarData});
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.reservation.reservations !== this.props.reservation.reservations) {
      console.log('new succesful reservation, triggering calendar render');
      const dateObject = {
        dateString: undefined,
        day: undefined,
        month: this.state.currentMonth,
        timestamp: undefined,
        year: this.state.currentYear
      };
      this.fetchDataForMonth(dateObject);
      this.setState({
        userSelectedDates: {}
      });
      this.props.setParkingSpot({id: 'random', name: 'Any free spot'});
    }
    if (nextProps.calendarList !== this.props.calendarList) {
      this.setState({calendarData: this.props.calendarList});
    }
  }

  fetchDataForMonth(calendarDateObject: CalendarDateObject) {
    if (this.props.calendarType === CalendarType.RESERVATION) {
      this.setState({currentMonth: calendarDateObject.month, currentYear: calendarDateObject.year});
      const year = calendarDateObject.year;
      const month = calendarDateObject.month-1;
      const urlQuery = getMonthRangeForURL(year, month);
      this.props.getCalendarSpots(urlQuery);
    }
  }

  toggleSelectedDay(day: CalendarDateObject) {
    if (day.dateString in this.state.userSelectedDates) {
      const newDates = {...this.state.userSelectedDates};
      delete newDates[day.dateString];
      if (this.props.calendarType === CalendarType.RESERVATION) {
        this.setState({
          userSelectedDates: newDates
        }, () => this.props.updateUserSelectedDates(this.state.userSelectedDates));
      }
      if (this.props.calendarType === CalendarType.RELEASE) {
        this.setState({
          userSelectedDates: newDates
        });
      }
    } else {
      if (this.props.calendarType === CalendarType.RESERVATION) {
        const userReservedDates = this.props.calendarList.filter((entry) =>
          entry.date === day.dateString);
        // data still loading
        if (!this.props.getMonthLoading) {
          // user cannot click on date which already contains reservation for user
          if (userReservedDates[0].spacesReservedByUser.length === 0) {
            const newDates = {...this.state.userSelectedDates};
            newDates[day.dateString] = {selected: true, selectedColor: Colors.YELLOW};
            this.setState({
              userSelectedDates: newDates
            }, () => this.props.updateUserSelectedDates(this.state.userSelectedDates));
          }
        }
      }
      if (this.props.calendarType === CalendarType.RELEASE) {
        const newDates = {...this.state.userSelectedDates};
        newDates[day.dateString] = {selected: true, selectedColor: Colors.YELLOW};
        this.setState({userSelectedDates: newDates});
      }
    }
  }

  render() {
    return (
      <Calendar
        markingType={this.props.markingType}
        onDayPress={(day) => {
          this.toggleSelectedDay(day);
        }}
        minDate={new Date()}
        markedDates={
          createMarkedDatesObject(this.state.calendarData, this.state.userSelectedDates)
        }
        firstDay={1}
        hideExtraDays={true}
        onMonthChange={(calendarDateObject) => {
          this.fetchDataForMonth(calendarDateObject);
        }}
        // style={styles.calendar}
        theme={{
          textDayFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          selectedDayTextColor: 'black'
        }}
      />
    );
  }
}

const mapStateToProps = (state: RootReducer) => ({
  calendarList: state.calendar.calendar,
  reservation: state.reservation,
  error: state.error,
  reserveSpotsLoading: state.loading.reserveSpotsLoading,
  getMonthLoading: state.loading.getMonthLoading
});

const mapDispatchToProps = {getCalendarSpots};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ReservationCalendar);
