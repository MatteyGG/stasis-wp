import Image from "next/image";
import React, { useState } from "react";

interface AudioProps {
  src: string;
}

export const Audio: React.FC<AudioProps> = ({ src }) => {
  const [isMuted, setIsMuted] = useState(true);

  const audioRef = React.createRef<HTMLAudioElement>();

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  return (
    <div className="absolute right-2 bottom-0 items-center">
      <audio ref={audioRef} muted autoPlay loop src={src} suppressHydrationWarning={true}/>
      <div
        className=" inline-flex gap-2 text-gray-600 hover:text-gray-900 cursor-pointer "
        onClick={toggleMute}
      >
        <Image src="/source/icon/mute.png" width={20} height={20} alt="mute" />
        {isMuted ? "Звук отключен" : "Звук включен"}
      </div>
    </div>
  );
};
