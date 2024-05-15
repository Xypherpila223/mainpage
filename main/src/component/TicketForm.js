import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import '../TicketForm.css'; // Import the CSS file

const CalendarPage = ({
  selectedDate1,
  setSelectedDate1,
  selectedTime1,
  setSelectedTime1,
  selectedDate2,
  setSelectedDate2,
  selectedTime2,
  setSelectedTime2,
}) => {
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

  return (
    <>
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
    </>
  );
};

function TicketForm() {
  const [schoolId, setSchoolId] = useState('');
  const [profiles, setProfiles] = useState([{}]);
  const [equipment, setEquipment] = useState('');
  const [room, setRoom] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [selectedTime1, setSelectedTime1] = useState(moment().format('HH:mm'));
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const [selectedTime2, setSelectedTime2] = useState(moment().format('HH:mm'));

  useEffect(() => {
    if (schoolId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`https://pcg81mqc-3003.asse.devtunnels.ms/studentprofiles/${schoolId}`);
          setProfiles(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [schoolId]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('https://pcg81mqc-3010.asse.devtunnels.ms/allrequests');
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => setSchoolId(e.target.value);

  const handleProfileChange = (e, index, key) => {
    const updatedProfiles = [...profiles];
    updatedProfiles[index][key] = e.target.value;
    setProfiles(updatedProfiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      schoolId: schoolId,
      firstName: profiles[0].first_name || '',
      lastName: profiles[0].last_name || '',
      room: profiles[0].room || '',
      equipment: profiles[0].equipment || '',
      email: profiles[0].email || '',
      status: 'REQUESTED',
      section: profiles[0].section, // Add the section field here
      sectionRoom: profiles[0].section_room, // Add the section room field here
      selectedDate1: moment(selectedDate1).format('YYYY-MM-DD'),
      selectedTime1: moment(selectedTime1, 'HH:mm').format('HH:mm:ss'),
      selectedDate2: moment(selectedDate2).format('YYYY-MM-DD'),
      selectedTime2: moment(selectedTime2, 'HH:mm').format('HH:mm:ss'),
    };

    try {
      console.log('Submitting data:', formattedData);
      const response = await fetch('https://pcg81mqc-3010.asse.devtunnels.ms/insertFormData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (response.ok) {
        alert('Ticket submitted successfully');
      } else {
        alert('Failed to submit ticket');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to submit ticket');
    }
  };

  const searchTable = (requests, equipment, room) => {
    if (equipment && room) {
      return requests.filter(request => request.equipment.toLowerCase().includes(equipment.toLowerCase()) && request.room.toLowerCase().includes(room.toLowerCase()));
    } else if (equipment) {
      return requests.filter(request => request.equipment.toLowerCase().includes(equipment.toLowerCase()) || request.room.toLowerCase().startsWith(equipment.toLowerCase()));
    } else if (room) {
      const filteredRequests = requests.filter(request => request.room.toLowerCase().includes(room.toLowerCase()));
      if (filteredRequests.length === 0) {
        const shortenedRoom = room.substring(0, 4).toLowerCase();
        return requests.filter(request => request.room.toLowerCase().includes(shortenedRoom));
      }
      return filteredRequests;
    }
    return requests;
  };

  const filteredRequests = searchTable(requests, equipment, room);

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Student Profiles</h2>
          <label htmlFor="schoolId">School ID:</label>
          <input
            type="text"
            id="schoolId"
            value={schoolId}
            onChange={handleInputChange}
          />
          {profiles.map((profile, index) => (
            <div key={index}>
              <label htmlFor={`firstName${index}`}>First Name:</label>
              <input
                type="text"
                id={`firstName${index}`}
                value={profile.first_name || ''}
                onChange={(e) => handleProfileChange(e, index, 'first_name')}
              />
              <label htmlFor={`lastName${index}`}>Last Name:</label>
              <input
                type="text"
                id={`lastName${index}`}
                value={profile.last_name || ''}
                onChange={(e) => handleProfileChange(e, index, 'last_name')}
              />
              <label htmlFor={`equipment${index}`}>              equipment:</label>
              <input
                type="text"
                id={`equipment${index}`}
                value={profile.equipment || ''}
                onChange={(e) => handleProfileChange(e, index, 'equipment')}
              />
              <label htmlFor={`room${index}`}>Room:</label>
              <input
                type="text"
                id={`room${index}`}
                value={profile.room || ''}
                onChange={(e) => handleProfileChange(e, index, 'room')}
              />
              <label htmlFor={`email${index}`}>Email:</label>
              <input
                type="text"
                id={`email${index}`}
                value={profile.email || ''}
                onChange={(e) => handleProfileChange(e, index, 'email')}
              />
              <label htmlFor={`section${index}`}>Section:</label>
              <input
                type="text"
                id={`section${index}`}
                value={profile.section || ''}
                onChange={(e) => handleProfileChange(e, index, 'section')}
              />
              <label htmlFor={`sectionRoom${index}`}>Section Room:</label>
              <input
                type="text"
                id={`sectionRoom${index}`}
                value={profile.section_room || ''}
                onChange={(e) => handleProfileChange(e, index, 'section_room')}
              />
            </div>
          ))}

          <CalendarPage
            selectedDate1={selectedDate1}
            setSelectedDate1={setSelectedDate1}
            selectedTime1={selectedTime1}
            setSelectedTime1={setSelectedTime1}
            selectedDate2={selectedDate2}
            setSelectedDate2={setSelectedDate2}
            selectedTime2={selectedTime2}
            setSelectedTime2={setSelectedTime2}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="select-container">
        <select
          id="equipment1"
          name="equipment1"
          value={equipment}
          onChange={e => setEquipment(e.target.value)}
        >
          <option value="">Select Equipment</option>
          <option value="LAPTOP">LAPTOP</option>
          <option value="CHAIR">CHAIR</option>
          <option value="DESK">DESK</option>
          <option value="PROJECTOR">PROJECTOR</option>
        </select>
        <select
          id="room1"
          name="room1"
          value={room}
          onChange={e => setRoom(e.target.value)}
        >
          <option value="">Select Room</option>
          <option value="PR">PR</option>
          <option value="LEC">LEC</option>
          <option value="LIBRARY">LIBRARY</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Room</th>
              <th>Status</th>
              <th>Return Day</th>
              <th>Return Time</th>
              <th>Get Day</th>
              <th>Get Time</th>
              <th>School ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: 'center',
                    fontSize: '1.2em',
                    color: 'black',
                    backgroundColor: '#e7e7e7da',
                    fontWeight: 'bolder'
                  }}
                >
                  No data found
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.ticketnum}>
                  <td>{request.equipment}</td>
                  <td>{request.room}</td>
                  <td>{request.status}</td>
            <td>{moment(request.selected_date1).format('YYYY-MM-DD')}</td>
            <td>{moment(request.selected_time1, 'HH:mm:ss').format('hh:mm A')}</td>
            <td>{moment(request.selected_date2).format('YYYY-MM-DD')}</td>
            <td>{moment(request.selected_time2, 'HH:mm:ss').format('hh:mm A')}</td>
                  <td>{request.school_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketForm;

