import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarCom.css';

const CalendarCom = () => {
    const [date, setDate] = useState(new Date());

    const onChange = (newDate) => {
        setDate(newDate);
    };

    return (
        <div className="fixed top-8 right-8 bg-red-100 p-5 border-r-8 shadow-sm mb-5 w-full max-w-md rounded-lg">
            <h2 className='mb-5 text-2xl text-red-900'>Calendar</h2>
            <Calendar onChange={onChange} value={date} />
        </div>
    );
};

export default CalendarCom;
