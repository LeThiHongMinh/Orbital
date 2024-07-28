import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import './CalendarCom.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarComponent = () => {
  const [events, setEvents] = useState([
    { title: 'New Year\'s Day', start: new Date(2024, 0, 1), end: new Date(2024, 0, 1) },
    { title: 'Chinese New Year', start: new Date(2024, 1, 10), end: new Date(2024, 1, 10) },
    { title: 'Chinese New Year', start: new Date(2024, 1, 11), end: new Date(2024, 1, 11) },
    { title: 'Good Friday', start: new Date(2024, 2, 29), end: new Date(2024, 2, 29) },
    { title: 'Hari Raya Puasa', start: new Date(2024, 3, 10), end: new Date(2024, 3, 10) },
    { title: 'Labour Day', start: new Date(2024, 4, 1), end: new Date(2024, 4, 1) },
    { title: 'Vesak Day', start: new Date(2024, 4, 22), end: new Date(2024, 4, 22) },
    { title: 'Hari Raya Haji', start: new Date(2024, 5, 17), end: new Date(2024, 5, 17) },
    { title: 'National Day', start: new Date(2024, 7, 9), end: new Date(2024, 7, 9) },
    { title: 'Deepavali', start: new Date(2024, 9, 31), end: new Date(2024, 9, 31) },
    { title: 'Christmas Day', start: new Date(2024, 11, 25), end: new Date(2024, 11, 25) },
    // Add more events as needed
  ]);

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
      />
    </div>
  );
};

export default CalendarComponent;
