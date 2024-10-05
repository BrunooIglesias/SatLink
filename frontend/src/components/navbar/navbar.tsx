import React, { useState } from 'react';

const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <nav style={{
            backgroundColor: '#000',
            color: '#fff',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            zIndex: 1000,
            boxShadow: '0px 4px 2px -2px gray',
        }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                Get your Landsat Image
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Where...?"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        marginRight: '0.5rem',
                        fontFamily: "'Space Grotesk', sans-serif",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#fff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#ddd')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                    Go
                </button>
            </form>
        </nav>
    );
};

export default Navbar;
