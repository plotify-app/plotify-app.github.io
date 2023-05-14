import React, { useState } from "react";
import { findBounds } from "../helpers/helper.js";
import { GenreComponent } from "./GenreComponent";
import "../style/HoverComponent.css"

export function HoverComponent({x, y, imageSize, axisLength, popularity, valence, songInfo, smallFormat, isMobile, setHovered}) {
    // set bounds for the coordinates
    const bounds = findBounds(popularity, valence, axisLength, imageSize);

    // return correct component if in bounds 
    var currElem = null; 
    for (var key in bounds) {
        const lowX = bounds[key][0]
        const highX = bounds[key][1]
        const lowY = bounds[key][2]
        const highY = bounds[key][3]
        if (x >= lowX && x <= highX && y >= lowY && y <= highY) {
            currElem = key
        } 
    }

    // determine height of top 10 elements so showing song info doesn't shift page 
    const [topHeight, setTopHeight] = useState(0); 
    const elem = document.getElementById('test');
    if (elem !== null && topHeight !== elem.clientHeight) {
        setTopHeight(elem.clientHeight)
    }

    function determineElement() {
        if (currElem != null && currElem in songInfo) {
            const name = songInfo[currElem].track 
            if (!isMobile) {
                setHovered(name)
            }
            const artists = songInfo[currElem].artists
            let artistString = "" 
            for (var i = 0; i < artists.length; i++) {
                if (i === 0) {
                    artistString = artistString + artists[i].name
                } else {
                    artistString = artistString + ", " + artists[i].name
                }
            }
            const genres = songInfo[currElem].genres
            let className = "songInfo"
            if (smallFormat) {
                className = "smallSongInfo"
            }
            if (isMobile) {
                className = "mobile"
            }

            return (
                <div className="container"> 
                    <div className={className}>
                        <div style={{display: "flex", overflow: "hidden"}}> 
                            {isMobile ? <img src={songInfo[currElem].src} alt="album cover" className="songCover"/> : null}
                            <div> 
                                <p className="name"> 
                                    <strong> {name} </strong>
                                </p>
                                <p className="artist"> 
                                    {artistString}
                                </p>
                                <GenreComponent genres={genres}/>
                            </div>
                        </div> 
                    </div>
                </div> 
            )
        } else {
            if (isMobile) {
                let songsFirstHalf = []; 
                let songsSecondHalf = []; 
                var count = 1; 
                for (var song in songInfo) {
                    if (count < 6) {
                        songsFirstHalf.push(songInfo[song].track)
                    } else {
                        songsSecondHalf.push(songInfo[song].track)
                    }
                    count++;
                }
                
                if (songsFirstHalf.length <= 0 || songsSecondHalf.length <= 0) {
                    return (
                        <div> 
                            <h2 className="loading"> Loading Your Songs... </h2>
                            <p className="loadingTime">If this process takes > 2 minutes, please refresh or try again later. </p>
                        </div>
                    )
                }
                return (
                    <div id="test" className="topzz"> 
                        <h2 className="top10"> Your Top 10 </h2>
                        <p className="learnMore">Tap on a song for more info</p>
                        <div className="list"> 
                            <div className="left" > 
                                {songsFirstHalf.map(song => 
                                    <p key={song}> {song} </p>
                                )}
                            </div> 
                            <div className="right"> 
                                {songsSecondHalf.map(song => 
                                    <p key={song}> {song} </p>
                                )}
                            </div> 
                        </div>
                    </div>   
                )
            } else {
                setHovered("")
                return null
            }
        }
    }

    return (
        <div style={{height: topHeight + 20}}>
            {determineElement()}
        </div> 
    )  
}