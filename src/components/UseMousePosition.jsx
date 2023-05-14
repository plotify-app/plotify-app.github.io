import { useEffect, useState } from "react";
import {isMobile} from 'react-device-detect';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if(isMobile) {
      const setFromEvent = (e) => {
        e.stopPropagation();
        setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
      window.addEventListener("touchstart", setFromEvent);
  
      return () => {
        window.removeEventListener("touchstart", setFromEvent);
      };
    } else {
      const setFromEvent = (e) => setPosition({ x: e.clientX, y: e.clientY });
      window.addEventListener("mousemove", setFromEvent);
  
      return () => {
        window.removeEventListener("mousemove", setFromEvent);
      };
    }
  }, [])
  
  return position;
};