import React , {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Player = (props:any) => {

    // const [videoUrls, setVideoUrls] = useState<Array<any>>([]);

    // useEffect(() => {
    //   const fetchVideoUrls = async () => {
    //     const urls = await Promise.all(props.videos.map(async (video) => {
    //       const response = await axios.get(`http://localhost:3000/video/${video}`, { responseType: 'blob' });
    //       const url = URL.createObjectURL(response.data);
    //       return { name: video, url };
    //     }));
    //     setVideoUrls(urls);
    //   };
    //   fetchVideoUrls();
    // }, [props.videos]);

    return (
        <>
            {props.videos.map((video) => {
               return <li
               key={uuidv4()}
               id={uuidv4()}>
                <a href="#">{video}</a>
                <video autoPlay="autoplay" muted="muted" loop="loop" playsInline="playsinline" preload="metadata" data-aos="fade-up" controls width="280">
                    <source src={`http://localhost:3000/uploads/processed/${video}`} type="video/mp4"></source>
                </video>
                </li>
            })}
        </>
    );
};

export default Player;