import React from 'react';
import DatePicker from 'react-datepicker';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';

// Registrar el locale español
registerLocale('es', es);

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    return (
        <div className="date-range-picker">
            <div className="date-picker-container">
                <label htmlFor="start-date">Fecha inicial:</label>
                <DatePicker
                    id="start-date"
                    selected={startDate}
                    onChange={onStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    maxDate={endDate || new Date()}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    className="date-picker"
                />
            </div>
            <div className="date-picker-container">
                <label htmlFor="end-date">Fecha final:</label>
                <DatePicker
                    id="end-date"
                    selected={endDate}
                    onChange={onEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    className="date-picker"
                />
            </div>
        </div>
    );
};

export default DateRangePicker;
