function GuestList({ guests, deleteGuest, toggleAttending }) {
  return (
    <div className="GuestList">
      {guests.map((guest) => (
        <div key={`guest-${guest.id}`} data-test-id="guest">
          <span>
            {guest.firstName} {guest.lastName}
          </span>
          <input
            type="checkbox"
            checked={guest.attending}
            onChange={() => toggleAttending(guest.id)}
            aria-label={`${guest.firstName} ${guest.lastName} attending status`}
            name={`${guest.firstName}-${guest.lastName}-attending`} // Add name attribute
            id={`${guest.firstName}-${guest.lastName}-attending`} // Add id attribute
          />
          <button
            onClick={() => deleteGuest(guest.id)}
            aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default GuestList;
