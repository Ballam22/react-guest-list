import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const baseUrl = 'http://localhost:4000';

const App = () => {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Fetch guests from the API
  const fetchGuests = async () => {
    setLoading(true);

    // Simulate a delay for the loading spinner
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });

    try {
      const response = await fetch(`${baseUrl}/guests`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const allGuests = await response.json();
      setGuests(allGuests);
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests().catch((error) => console.error('Error in useEffect:', error));
  }, []);

  // Add a new guest
  const addGuest = async (event) => {
    if (
      event.key !== 'Enter' ||
      firstName.trim() === '' ||
      lastName.trim() === ''
    ) {
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post(`${baseUrl}/guests`, {
        firstName,
        lastName,
        attending: false, // Set new guests as 'not attending' by default
      });
      setGuests((prevGuests) => [...prevGuests, response.data]);
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error('Error adding guest:', error);
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle the attending status of a guest
  const toggleAttending = async (id, currentStatus) => {
    setIsToggling(true);
    try {
      await axios.put(`${baseUrl}/guests/${id}`, {
        attending: !currentStatus,
      });
      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === id ? { ...guest, attending: !currentStatus } : guest,
        ),
      );
    } catch (error) {
      console.error('Error toggling attending status:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Remove a guest
  const removeGuest = async (id) => {
    try {
      await axios.delete(`${baseUrl}/guests/${id}`);
      setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error removing guest:', error);
    }
  };

  return (
    <div className="app">
      <h1>Guest List</h1>
      {console.log('Loading state:', loading)}

      {/* Show "Loading..." when fetching guests */}
      {loading ? (
        <p data-test-id="loading">Loading...</p>
      ) : (
        <div>
          <div>
            <label>
              First name:
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={Boolean(loading) || Boolean(isAdding)}
              />
            </label>
            <label>
              Last name:
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={addGuest}
                disabled={Boolean(loading) || Boolean(isAdding)}
              />
            </label>
          </div>

          {guests.length === 0 ? (
            <p>No guests found. Add a guest to get started!</p>
          ) : (
            guests.map((guest) => (
              <div
                key={`guest-${guest.id}`}
                data-test-id="guest"
                className="guest-item"
              >
                <span>
                  {guest.firstName} {guest.lastName}
                </span>
                <input
                  type="checkbox"
                  checked={guest.attending}
                  onChange={() => toggleAttending(guest.id, guest.attending)}
                  disabled={isToggling}
                  aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                />
                <button
                  onClick={() => removeGuest(guest.id)}
                  disabled={isToggling}
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default App;
