import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const BackgroundMusic = () => {
  const location = useLocation();
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState("/");
  const [hasInteracted, setHasInteracted] = useState(false);

  const dashboardMusic = "/audio/pokemon-bg.mp3";
  const battleMusic = "/audio/battle-bg.mp3";

  const VOLUME_LEVELS = {
    dashboard: 0.5,
    battle: 1.0,
  };

  const handleUserInteraction = () => {
    setHasInteracted(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;

    const isBattle = location.pathname === "/battle";

    if (isBattle && currentTrack !== "battle") {
      audio.src = battleMusic;
      audio.volume = VOLUME_LEVELS.battle;
      setCurrentTrack("battle");
      audio.play().catch(console.warn);
    } else if (!isBattle && currentTrack !== "/") {
      audio.src = dashboardMusic;
      audio.volume = VOLUME_LEVELS.dashboard;
      setCurrentTrack("/");
      audio.play().catch(console.warn);
    }
  }, [location.pathname, currentTrack, hasInteracted]);

  // Trigger music play on first interaction
  useEffect(() => {
    if (!hasInteracted) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = VOLUME_LEVELS.dashboard;
    audio.src = dashboardMusic;
    audio.play().catch((e) => {
      console.warn("Music autoplay blocked:", e);
    });
  }, [hasInteracted]);

  // Set up event listener for user interaction
  useEffect(() => {
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('scroll', handleUserInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  return <audio ref={audioRef} />;
};

export default BackgroundMusic;
