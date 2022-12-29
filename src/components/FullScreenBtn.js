import React from 'react';
import { useState } from 'react';
import { FaExpandAlt } from 'react-icons/fa';
import { ImShrink2 } from 'react-icons/im';


export default function FullscreenBtn() {
  const [isFullscreen, setisFullscreen] = useState(false);

  const onFullscreen = () => {
    const elem = document.documentElement;
    if (elem?.requestFullscreen) {
      elem.requestFullscreen();
      setisFullscreen(true);
    }
  };

  const onExitFullscreen = () => {
    document.exitFullscreen();
    setisFullscreen(false);
  };



  return (
        <button className="btn btn-blue w-44 mb-4" onClick={isFullscreen ? onExitFullscreen : onFullscreen}>FullScreen </button>
  );
}