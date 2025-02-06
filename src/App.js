import './App.css'; // Assuming you have a simple CSS file
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
    try {
      const response = await axios.get('http://localhost:4000/guests');
      setGuests(response.data);
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
    if (event.key !== 'Enter' || !firstName || !lastName) return;

    setIsAdding(true);
    try {
      const response = await axios.post('http://localhost:4000/guests', {
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
  const toggleAttending = async (id, attending) => {
    setIsToggling(true);
    try {
      const response = await axios.put(`${baseUrl}/guests/${id}`, {
        attending: !attending,
      });

      setGuests((prevGuests) =>
        prevGuests.map((guest) => (guest.id === id ? response.data : guest)),
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
      await axios.delete(`http://localhost:4000/guests/${id}`);
      setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== id));
    } catch (error) {
      console.error('Error removing guest:', error);
    }
  };

  return (
    <div className="app">
      <h1>Guest List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div>
            <label>
              First name:
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isAdding}
              />
            </label>
            <label>
              Last name:
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={addGuest}
                disabled={isAdding}
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
