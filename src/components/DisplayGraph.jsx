import React from "react";
import "../style/Canvas.css"
import { GetScreenSize } from "../helpers/getScreenSize.js";
import { MemorizedCanvas } from "./Canvas";
import { transformCoordinates } from "../helpers/helper.js";
import { KeyCanvas } from "./KeyCanvas";

export function DisplayGraph(props) {
    const songData = props.items;
    const popularityX = props.popularity;
    const valenceY = props.valence;
    const songDictionary = props.songDictionary;
    // keys are song ids, values are src links
    const albumSrcDictionary = {};

    // determine dimensions 
    const width = GetScreenSize() - 100;
    let imgSize; 
    let axisLength; 
    let smallFormat = false; 
    let superSmallFormat = false; 
    if (width > 900) {
      imgSize = 0.038 * width; 
      axisLength = 0.4 * width;
    } else {
      imgSize = 0.1 * width; 
      axisLength = 0.77 * width;
      smallFormat = true;
    }
    if (width < 400) {
      superSmallFormat = true;
    }

    // get tracks + album covers 
    if (songData !== null) {
      for (var i = 0; i < songData.length; i++) {
        albumSrcDictionary[songData[i].id] = songData[i].album.images[0].url;
      }  
    } 

    const loadedImages = {}
    // load images on graph w/o glitching (hopefully)
    function draw (context){
      if (Object.keys(loadedImages).length <= 0) {
        for (var key in albumSrcDictionary) {
          const image = new Image();
          image.src = albumSrcDictionary[key];
          const pt = transformCoordinates(popularityX[key], valenceY[key], axisLength, imgSize)
          image.onload = () => {
            context.drawImage(image, pt[0], pt[1], imgSize, imgSize);
          };
          loadedImages[key]= image
        }
      } else {
        for (var key2 in loadedImages) {
          const pt = transformCoordinates(popularityX[key2], valenceY[key2], axisLength, imgSize)
          context.drawImage(loadedImages[key2], pt[0], pt[1], imgSize, imgSize);
        }
      }   
    };

    // display stuff
    if (albumSrcDictionary.length < 10) {
        return (
            <p className="sorry"> Loading...</p>
        )
    } else if (width <300) {
      return (
        <p className="sorry"> 
          We're sorry, your display is too small to properly view the data. Please switch to a device with a larger screen size.
        </p>
      )
    } else {
      return (
        <div>
          <div className="heading">
            <h2 className="header" style={{fontSize: "2.15em", marginBottom: 0 }}> Where Your Music Falls </h2> 
            <div className="key"> 
              <KeyCanvas height={50} width={axisLength} smallFormat={superSmallFormat}/> 
            </div> 
          </div> 
          
          {smallFormat ? 
            <div className="smallerCanvas" > 
              <MemorizedCanvas draw={draw} 
                              height={axisLength} 
                              width={axisLength} 
                              imageSize={imgSize} 
                              popularity={popularityX} 
                              valence={valenceY}
                              songInfo={songDictionary}
                              smallFormat={smallFormat}/>
            </div> : 
            <div className="bigCanvas" > 
              <MemorizedCanvas draw={draw} 
                              height={axisLength} 
                              width={axisLength} 
                              imageSize={imgSize} 
                              popularity={popularityX} 
                              valence={valenceY}
                              songInfo={songDictionary}
                              smallFormat={smallFormat}/>
          </div>}
        </div>   
      )   
    } 
}