import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implement search functionality here
    console.log('Search query:', searchQuery);
  };

  return (
    <nav style={{
      backgroundColor: 'black',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: "'Space Grotesk', sans-serif",
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Get your Landsat Image
      </div>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          placeholder="Where...?"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: 'none',
            marginRight: '0.5rem',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 'bold',
          }}
        >
          Go
        </button>
      </form>
    </nav>
  );
};

export default Navbar;