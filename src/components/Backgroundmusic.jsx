import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { useLocation } from "react-router-dom";

const BackgroundMusic = forwardRef((_, ref) => {
  const location = useLocation();
  const audioRef = useRef(null);
  const currentPath = location.pathname;

  const dashboardMusic = "/audio/pokemon-bg.mp3";
  const battleMusic = "/audio/battle-bg.mp3";

  useImperativeHandle(ref, () => audioRef.current);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    if (currentPath === "/battle") {
      if (audio.src !== window.location.origin + battleMusic) {
        audio.src = battleMusic;
        audio.volume = 1.0;
        audio.play().catch(console.warn);
      }
    } else {
      if (audio.src !== window.location.origin + dashboardMusic) {
        audio.src = dashboardMusic;
        audio.volume = 0.5;
        audio.play().catch(console.warn);
      }
    }
  }, [currentPath]);

  return <audio ref={audioRef} />;
});

export default BackgroundMusic;
