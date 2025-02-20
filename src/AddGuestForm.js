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

  const handleLastNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="AddGuestForm">
      <div>
        <label htmlFor="firstNameInput">First name</label>
        <input
          id="firstNameInput"
          name="first-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          required
          autoComplete="given-name"
        />
      </div>
      <div>
        <label htmlFor="lastNameInput">Last name</label>
        <input
          id="lastNameInput"
          name="last-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyDown={handleLastNameKeyDown}
          disabled={loading}
          required
          autoComplete="family-name"
        />
      </div>
      <button disabled={loading}>Add Guest</button>
    </form>
  );
}

export default AddGuestForm;
