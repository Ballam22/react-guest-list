import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddGuestForm from './AddGuestForm';
import GuestList from './GuestList';

const API_URL = 'http://localhost:4000/guests';

function App() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load guests from API on component mount
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get(API_URL);
        // Introduce an artificial delay for the loading indicator
        setTimeout(() => {
          setGuests(response.data);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching guests:', error);
        setLoading(false);
      }
    };

    fetchGuests().catch((error) =>
      console.error('Unhandled error in fetchGuests:', error),
    );
  }, []);

  // Add a new guest
  const addGuest = async (firstName, lastName) => {
    const newGuest = {
      firstName,
      lastName,
      attending: false,
    };
    try {
      const response = await axios.post(API_URL, newGuest);
      setGuests([...guests, response.data]);
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  // Delete a guest
  const deleteGuest = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setGuests(guests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  // Toggle attending status
  const toggleAttending = async (id) => {
    const currentGuest = guests.find((guest) => guest.id === id);
    const updatedGuest = { attending: !currentGuest.attending };
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedGuest);
      setGuests(
        guests.map((guest) =>
          guest.id === id
            ? { ...guest, attending: response.data.attending }
            : guest,
        ),
      );
    } catch (error) {
      console.error('Error updating guest:', error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Guest List</h1>
        {/* Show loading text if loading is true */}
        {loading && <p data-test-id="loading">Loading...</p>}
        <AddGuestForm addGuest={addGuest} loading={loading} />
        <h2>Guests</h2>
        <GuestList
          guests={guests}
          deleteGuest={deleteGuest}
          toggleAttending={toggleAttending}
        />
      </div>
    </div>
  );
}

export default App;
