import React, {useState, useEffect} from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import Player from './Player';

const VideosList = () => {

    // fetch pour récupérer les données depuis le serveur

    const [ videos, setVideos ] = useState<Array<any>>([]);

    useEffect(() => {
        async function getVideos() {
          try {
            const response = await axios.get('http://localhost:3000/files');
            const data = response.data;
            setVideos(prevVideos => [...prevVideos, ...data]);
          } catch (error) {
            console.error(error);
          }
        }
        getVideos();
      }, []);



    return (
        <div>
            <h1 className='files-title'>🎞️ Videos Gallery</h1>
            <ul>
             <Player 
             videos = {videos}/>
            </ul>
        </div>
    );
};

export default VideosList;