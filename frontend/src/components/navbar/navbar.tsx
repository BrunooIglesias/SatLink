import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SatLink from '../../public/images/satlink.png';

const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    if (router.pathname === '/image') {
        return (
            <nav style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
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
                <Image 
                    src={SatLink} 
                    alt="SatLink Logo" 
                    width={120} 
                    height={64} 
                    style={{ objectFit: 'contain' }}
                />
            </nav>
        );
    }

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
            {/* Left Section - Text */}
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', flex: 1 }}>
                Press somewhere on the map to get your image!
            </div>

            {/* Center Section - Logo */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Image 
                    src={SatLink} 
                    alt="SatLink Logo" 
                    width={120} 
                    height={64} 
                    style={{ objectFit: 'contain' }}
                />
            </div>

            {/* Right Section - Search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
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
                >
                    Go
                </button>
            </form>
        </nav>
    );
};

export default Navbar;
