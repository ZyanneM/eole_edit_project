import React, {useState, useEffect} from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Player from './Player';

const VideosList = () => {

    // fetch pour récupérer les données depuis le serveur

    const [ videos, setVideos ] = useState<Array<any>>([]);

    const [ selectedVideo, setSelectedVideo ] = useState<string>('');
    const [ isOpen, setIsOpen ] = useState<boolean>(true);

    useEffect(() => {
        async function getVideos() {
          try {
            const response = await axios.get('http://localhost:3000/files');
            const data = response.data; 
            setVideos([...data]);
          } catch (error) {
            console.error(error);
          }
        }
        getVideos();
      }, []);

      function handlePlay (video:string){
        setSelectedVideo(video)
        setIsOpen(true)
      }
      // console.log(selectedVideo);

      function handleClose() {
        setIsOpen(false)
      
      }

    return (
        <div className='video-section'>
            <h1 className='files-title'>🎞️ Videos Gallery</h1>
              {videos.map((video) =>
                <button
                key={uuidv4()}
                className='single-video-btn'
                onClick={ () => handlePlay(video)}>
                  {video}
                  </button>
              )}
              {selectedVideo && isOpen ? 
              <>
              <Player
              filename={selectedVideo}
              />
              <button onClick={() => handleClose()} type="button" className="btn-close btn-close-white" aria-label="Close"></button>
              </> :
              ""}
        </div>
    );
};

export default VideosList;

{/* <Player
key={uuidv4()} 
video = {video}/> */}