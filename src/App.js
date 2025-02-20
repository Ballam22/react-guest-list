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
    try {
      const response = await axios.get(`${baseUrl}/guests`);
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

  // Add a new guest when pressing Enter in the last name input
  const handleLastNameKeyDown = async (event) => {
    if (event.key === 'Enter') {
      // Validate that both fields are filled
      if (firstName.trim() === '' || lastName.trim() === '') {
        console.log('Invalid input: both fields are required.');
        return;
      }
      setIsAdding(true);
      try {
        const response = await axios.post(`${baseUrl}/guests`, {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          attending: false, // New guests are not attending by default
        });
        // Append the new guest to the list
        setGuests((prevGuests) => [...prevGuests, response.data]);
        // Clear both fields
        setFirstName('');
        setLastName('');
      } catch (error) {
        console.error('Error adding guest:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  // Toggle the attending status for a guest
  const toggleAttending = async (id, currentStatus) => {
    setIsToggling(true);
    try {
      // Retrieve the full guest object from state
      const guest = guests.find((g) => g.id === id);

      console.log('toggeling guest:', guest);

      // Exclude the id from the object sent to the API
      const { id: guestId, ...guestData } = guest;
      const updatedGuest = { ...guestData, attending: !currentStatus };

      await axios.put(`${baseUrl}/guests/${id}`, updatedGuest);
      setGuests((prevGuests) =>
        prevGuests.map((g) =>
          g.id === id ? { ...g, attending: !currentStatus } : g,
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
      {loading ? (
        <p data-test-id="loading">Loading...</p>
      ) : (
        <div>
          <div className="input-container">
            <label htmlFor="firstName">First name</label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isAdding}
            />
          </div>

          <div className="input-container">
            <label htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyDown={handleLastNameKeyDown}
              disabled={isAdding}
            />
          </div>

          {guests.length === 0 ? (
            <p>No guests found. Add a guest to get started!</p>
          ) : (
            <div className="guest-list">
              {guests.map((guest) => (
                <div
                  key={`guest-${guest.id}`}
                  data-test-id="guest"
                  className="guest-item"
                >
                  <span>
                    {guest.firstName} {guest.lastName}
                  </span>
                  <div className="guest-actions">
                    <input
                      type="checkbox"
                      checked={guest.attending}
                      onChange={() =>
                        toggleAttending(guest.id, guest.attending)
                      }
                      disabled={isToggling}
                      aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                    />
                    <button
                      onClick={() => removeGuest(guest.id)}
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
