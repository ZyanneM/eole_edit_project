import { useState } from 'react'
// import bootstrap from 'bootstrap'
import './App.css'
import Upload from './components/Upload'
import VideosList from './components/VideosList'


function App() {


  return (

      <div>
        <header>
          <h1>Eole <span>Edit</span> Project</h1>
            <div className="eoleimg">
              <img src="/eolelogo.png" alt="eolementhe logo" />
            </div>
        </header>
        <p>Discover our fantastic tool for easy video upload 🎥</p>
        <div className='sections'>
            <div className='upload-section'>
              <Upload/>
            </div>
            <div className='videogallery-section'>
              <VideosList/>
            </div>
          </div>
        </div>

  )
}

export default App
