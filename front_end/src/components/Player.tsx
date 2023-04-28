import React , {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';



type PlayerComponentProps = {
  filename : string

}

const Player = ({filename}:PlayerComponentProps) => {

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [ isPlaying, setIsPlaying ] = useState<boolean>(true);



function handlePlay() {
  setIsPlaying(true);
  if(videoRef.current){
    console.log('play');
    videoRef.current.play();

    // videoRef.current.load()
}


}

function handlePause() {

  setIsPlaying(false);
  if(videoRef.current){
    console.log('pause');
    videoRef.current.pause();

    // videoRef.current.load()
}


}

    return (
        <>
                { filename && 
                <>
                <div className='video-container'>
                  <video ref={videoRef} id="video-player" muted="muted" loop="loop" playsInline="playsinline" preload="metadata" data-aos="fade-up" autoPlay width="480" height="auto">
                      <source src={`http://localhost:3000/files/${filename}`} type="video/mp4" />
                  </video>
                </div>
                {isPlaying ?
                <button onClick={() => handlePause()}>Pause</button>
                : <button onClick={() => handlePlay()}>Play</button>}
                <button type="button" className="btn-close btn-close-white" aria-label="Close"></button>
                </>
                }
        </>
    );
};

export default Player;