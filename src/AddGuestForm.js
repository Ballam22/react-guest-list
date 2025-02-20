import React, { useState } from 'react';

function AddGuestForm({ addGuest }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      addGuest(firstName, lastName);
      setFirstName('');
      setLastName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="AddGuestForm">
      <label>
        First name:
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>
      <label>
        Last name:
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          required
        />
      </label>
      <button>Add Guest</button>
    </form>
  );
}

export default AddGuestForm;
