import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import '../CalendarPage.css';

const formatTime = (time, format) => moment(time, 'HH:mm').format(format);
const formatDate = (date, format) => moment(date).format(format);

const CalendarPage = () => {
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedTime1, setSelectedTime1] = useState(moment().format('HH:mm'));
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [selectedTime2, setSelectedTime2] = useState(moment().format('HH:mm'));
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };

  const handleTimeChange1 = (time) => {
    setSelectedTime1(moment(time, 'hh:mm A').format('HH:mm:ss'));
  };

  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };

  const handleTimeChange2 = (time) => {
    setSelectedTime2(moment(time, 'hh:mm A').format('HH:mm:ss'));
  };

  const postData = async () => {
    try {
      const response = await fetch('https://pcg81mqc-3010.asse.devtunnels.ms/calendars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedDate1: moment(selectedDate1).format('YYYY-MM-DD'),
          selectedTime1,
          selectedDate2: moment(selectedDate2).format('YYYY-MM-DD'),
          selectedTime2
        })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Data successfully posted');
      setSelectedDate1(null); // Reset selectedDate1
      setSelectedDate2(null); // Reset selectedDate2
      alert('Data successfully inserted');
      fetchData(); // Refresh data after successful post
    } catch (error) {
      console.error('Error posting data:', error);
      setError('Error posting data');
    }
  };
  
  const fetchData = async () => {
    try {
      const response = await fetch('https://pcg81mqc-3010.asse.devtunnels.ms/calendars');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched calendar entries:', data);
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    }
  };

  return (
    <div className="container">
      <h1>Calendar and Time Picker</h1>
      <div>
        <label>Date 1:</label>
        <DatePicker
          selected={selectedDate1}
          onChange={handleDateChange1}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>Time 1:</label>
        <input
          type="time"
          value={selectedTime1}
          onChange={(e) => handleTimeChange1(e.target.value)}
        />
      </div>
      <div>
        <label>Date 2:</label>
        <DatePicker
          selected={selectedDate2}
          onChange={handleDateChange2}
          minDate={new Date()}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>Time 2:</label>
        <input
          type="time"
          value={selectedTime2}
          onChange={(e) => handleTimeChange2(e.target.value)}
        />
      </div>
      <button onClick={postData}>
        Submit
      </button>
      <button onClick={fetchData}>
        Fetch Calendar Entries
      </button>
      {error && <p className="error">{error}</p>}
      <ul>
        {data.map(entry => (
          <li key={entry.id}>
            {formatDate(entry.selected_date1, 'MMM DD, YYYY')} {formatTime(entry.selected_time1, 'h:mm A')}
            <br/>
            {formatDate(entry.selected_date2, 'MMM DD, YYYY')} {formatTime(entry.selected_time2, 'h:mm A')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarPage;
