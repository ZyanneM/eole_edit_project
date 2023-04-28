import React , {useState, useEffect, useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';



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
}


}

function handlePause() {

  setIsPlaying(false);
  if(videoRef.current){
    console.log('pause');
    videoRef.current.pause();
}




}

    return (
        <>
                { filename && 
                <>
                <div className='video-container'>
                  <video ref={videoRef} id="video-player" preload="metadata" data-aos="fade-up" autoPlay width="480" height="auto">
                      <source src={`http://localhost:3000/files/${filename}`} type="video/mp4" />
                  </video>
                </div>
                {isPlaying ?
                <><button onClick={() => handlePause()} className='icon' ><FontAwesomeIcon icon={faPause} className='icon-pause' /></button>
                </>
                : <button onClick={() => handlePlay()} className='icon'><FontAwesomeIcon icon={faPlay} className='icon-play' /></button>}
                </>
                }
        </>
    );
};

export default Player;