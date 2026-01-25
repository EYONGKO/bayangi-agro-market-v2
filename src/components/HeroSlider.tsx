import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '600px',
  overflow: 'hidden',
  marginTop: '64px',
});

const SlideImage = styled('img')<{ active: number }>(({ active }: { active: number }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: active === 1 ? 1 : 0,
  transition: 'opacity 1.5s ease-in-out',
  zIndex: active === 1 ? 2 : 1,
}));

const SlideOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textAlign: 'center',
  padding: '20px',
});

const HeroTitle = styled('h1')({
  fontSize: '4rem',
  fontWeight: 700,
  marginBottom: '1.5rem',
  textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
  letterSpacing: '0.02em',
  animation: 'fadeInUp 1s ease-out',
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@media (max-width: 768px)': {
    fontSize: '2.5rem',
  },
});

const HeroSubtitle = styled('p')({
  fontSize: '1.3rem',
  marginBottom: '2.5rem',
  maxWidth: '800px',
  textShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
  animation: 'fadeInUp 1s ease-out 0.2s backwards',
  lineHeight: 1.6,
  '@media (max-width: 768px)': {
    fontSize: '1rem',
  },
});

const CTAButton = styled('button')({
  background: '#2ecc71',
  color: 'white',
  padding: '18px 56px',
  border: 'none',
  borderRadius: '50px',
  fontSize: '1.1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 6px 24px rgba(46, 204, 113, 0.5)',
  animation: 'fadeInUp 1s ease-out 0.4s backwards',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 32px rgba(46, 204, 113, 0.7)',
    background: '#27ae60',
  },
});

const DotsContainer = styled(Box)({
  position: 'absolute',
  bottom: '30px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: '12px',
  zIndex: 10,
});

const Dot = styled('button')<{ active: boolean }>(({ active }: { active: boolean }) => ({
  width: active ? '40px' : '12px',
  height: '12px',
  borderRadius: '6px',
  border: 'none',
  background: active ? '#2ecc71' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: active ? '#2ecc71' : 'rgba(255, 255, 255, 0.8)',
  },
}));

const heroImages = [
  '/hero-moving-bg.jpg',
  '/hero-moving-bg-2.jpg',
  '/hero-moving-bg-3.jpg',
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % heroImages.length;
        console.log('Sliding to:', nextSlide);
        return nextSlide;
      });
    }, 2000); // Changed to 2 seconds

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <SliderContainer>
      {heroImages.map((image, index) => (
        <SlideImage
          key={`slide-${index}`}
          src={image}
          alt={`Hero slide ${index + 1}`}
          active={currentSlide === index ? 1 : 0}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      <SlideOverlay>
        <HeroTitle>Join Our Community</HeroTitle>
        <HeroSubtitle>
          Connect with local farmers, artisans, and food enthusiasts in vibrant community marketplaces
        </HeroSubtitle>
        <CTAButton>EXPLORE COMMUNITIES</CTAButton>
      </SlideOverlay>
      <DotsContainer>
        {heroImages.map((_, index) => (
          <Dot
            key={index}
            active={currentSlide === index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </DotsContainer>
    </SliderContainer>
  );
}
