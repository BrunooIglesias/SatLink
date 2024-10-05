import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';
import spaceBackground from '../../public/images/space-background.png';

const LandingPage: React.FC = () => {
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/home');
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontFamily: "'Space Grotesk', sans-serif", // Updated font
        cursor: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚀</text></svg>\") 16 0, auto", // Rocket emoji cursor
      }}
    >
      <Image
        src={spaceBackground}
        alt="Space Background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)', marginBottom: '1rem' }}>
          Houston, We Have a Program
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)' }}>
          Join us in exploring the final frontier with Landsat data
        </p>
        <button
          style={{
            backgroundColor: '#1e3a8a',
            color: 'white',
            padding: '0.75rem 1.5rem',
            fontWeight: 'bold',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'inherit',
            transition: 'transform 0.3s ease, background-color 0.3s ease',
          }}
          onClick={goToHomePage}
        >
          Explore My Landsat
        </button>
      </div>
    </div>
  );
};

export default LandingPage;