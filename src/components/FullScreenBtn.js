import React from 'react';
import { useState } from 'react';
import { FaExpandAlt } from 'react-icons/fa';
import { ImShrink2 } from 'react-icons/im';
import { Disclosure} from '@headlessui/react'

export default function FullscreenBtn() {
  const [isFullscreen, setisFullscreen] = useState(false);

  const onFullscreen = () => {
    const elem = document.documentElement;
    if (elem?.requestFullscreen) {
      elem.requestFullscreen();
      setisFullscreen(true);
      console.log("clickedB");

    }
  };


  const onExitFullscreen = () => {
    document.exitFullscreen();
    setisFullscreen(false);
    console.log("clickedA");

  };



  return (
    <Disclosure>
    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={isFullscreen ? onExitFullscreen : onFullscreen}>
    <span className="sr-only">Open main menu</span>
    {isFullscreen ? (
      <ImShrink2 className="block h-6 w-6" aria-hidden="true" />
    ) : (
      <FaExpandAlt className="block h-6 w-6" aria-hidden="true" />
    )}
  </Disclosure.Button>
  </Disclosure>
  );
};
//<icon className="w-44 h-44" src={icon} onClick={isFullscreen ? onExitFullscreen : onFullscreen} alt=""></icon>



//<icon className="w-44 h-44" src={icon} onClick={isFullscreen ? onExitFullscreen : onFullscreen} alt=""></icon>

//<Icon className="h-1 w-1"  icon={isFullscreen ? (<ImShrink2 className="opacity-5" size="50"/>) : (<FaExpandAlt className="opacity-5" size="50"/>)}  onClick={isFullscreen ? onExitFullscreen : onFullscreen}/>