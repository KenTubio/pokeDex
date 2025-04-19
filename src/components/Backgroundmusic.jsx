import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const BackgroundMusic = () => {
  const location = useLocation();
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState("/");

  const dashboardMusic = "/audio/pokemon-bg.mp3";
  const battleMusic = "/audio/battle-bg.mp3";

  const VOLUME_LEVELS = {
    dashboard: 0.5,
    battle: 1.0,
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isBattle = location.pathname === "/battle";

    audio.loop = true;

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
  }, [location.pathname, currentTrack]);

  return <audio ref={audioRef} />;
};

export default BackgroundMusic;
