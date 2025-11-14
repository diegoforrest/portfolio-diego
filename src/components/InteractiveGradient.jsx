import { useEffect } from 'react';

export const InteractiveGradient = () => {
  useEffect(() => {
    const hero = document.querySelector('.hero');
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;

      hero.style.setProperty('--mouse-x', `${xPercent}%`);
      hero.style.setProperty('--mouse-y', `${yPercent}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return null; 
};
