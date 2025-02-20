import React from 'react';

function AddGuestForm({ addGuest, loading }) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

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
          name="first-name" // Add name attribute
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          required
          autoComplete="given-name" // Optional: Improve autofill
        />
      </label>
      <label>
        Last name:
        <input
          name="last-name" // Add name attribute
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
          disabled={loading}
          required
          autoComplete="family-name" // Optional: Improve autofill
        />
      </label>
      <button disabled={loading}>Add Guest</button>
    </form>
  );
}

export default AddGuestForm;
