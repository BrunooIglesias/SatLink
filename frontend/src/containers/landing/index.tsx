import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import spaceBackground from '../../public/images/space-background.png';

const LandingPage: React.FC = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);

  useEffect(() => {
    // Create stars
    const starryNight = document.createElement('div');
    starryNight.style.position = 'fixed';
    starryNight.style.top = '0';
    starryNight.style.left = '0';
    starryNight.style.width = '100%';
    starryNight.style.height = '100%';
    starryNight.style.pointerEvents = 'none';
    document.body.appendChild(starryNight);

    // Create twinkling stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.style.position = 'absolute';
      const size = Math.random() * 3 + 4; // Increased size range
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.backgroundColor = 'white';
      star.style.borderRadius = '50%';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animation = `twinkle ${Math.random() * 5 + 2}s linear infinite`; // Faster twinkling
      starryNight.appendChild(star);
    }

    // Create floating stars
    for (let i = 0; i < 20; i++) {
      const floatingStar = document.createElement('div');
      floatingStar.style.position = 'absolute';
      const size = Math.random() * 4 + 2; // Increased size range
      floatingStar.style.width = `${size}px`;
      floatingStar.style.height = `${size}px`;
      floatingStar.style.backgroundColor = 'white';
      floatingStar.style.borderRadius = '50%';
      floatingStar.style.left = `${Math.random() * 100}%`;
      floatingStar.style.top = `${Math.random() * 100}%`;
      floatingStar.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`; // Faster floating
      floatingStar.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.7)';
      starryNight.appendChild(floatingStar);
    }

    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes float {
        0% { transform: translate(0, 0); }
        25% { transform: translate(20px, 20px); }
        50% { transform: translate(40px, 0); }
        75% { transform: translate(20px, -20px); }
        100% { transform: translate(0, 0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(starryNight);
      document.head.removeChild(style);
    };
  }, []);

  const goToHomePage = () => {
    router.push('/map');
  };

  const title = "HOUSTON, WE HAVE A PROGRAM";

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Image
        src={spaceBackground}
        alt="Space Background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚀</text></svg>\") 16 0, auto",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              marginBottom: '1rem',
              fontFamily: "'Space Grotesk', sans-serif",
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {title.split(/(\s+)/).map((part, index) => (
              part.match(/\s+/) ? (
                <span key={index}>&nbsp;</span>
              ) : (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    transition: 'transform 0.2s ease',
                    transform: hoveredLetter === index ? 'scale(1.2)' : 'scale(1)',
                  }}
                  onMouseEnter={() => setHoveredLetter(index)}
                  onMouseLeave={() => setHoveredLetter(null)}
                >
                  {part}
                </span>
              )
            ))}
          </h1>
          <p
            style={{
              fontSize: '1.5rem',
              marginBottom: '2rem',
              color: 'white',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Join us in exploring the final frontier with Landsat data
          </p>
          <button
            style={{
              backgroundColor: 'white',
              color: 'black',
              padding: '0.75rem 1.5rem',
              fontWeight: 'bold',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'inherit',
              transition: 'all 0.3s ease',
              fontFamily: "'Space Grotesk', sans-serif",
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              boxShadow: isHovered ? '0 0 15px rgba(255, 255, 255, 0.8)' : 'none',
            }}
            onClick={goToHomePage}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Explore My Landsat
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;