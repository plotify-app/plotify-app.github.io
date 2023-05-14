import React, {useState, useRef} from "react";
import { useMousePosition } from "./UseMousePosition";
import MouseTooltip from 'react-sticky-mouse-tooltip';
import { HoverComponent } from "./HoverComponent";
import {isMobile} from 'react-device-detect';
import { ComputerTop } from "./ComputerTop";
import { GetScreenSize } from "../helpers/getScreenSize.js";
import "../style/Canvas.css"

export function Canvas ({ draw, height, width, imageSize, popularity, valence, songInfo, smallFormat }) {
    
    const screenSize = GetScreenSize();

    const position = useMousePosition()
    const canvas = React.useRef();

    const xRect = useRef(0);
    const yRect = useRef(0);
    
    React.useEffect(() => {
        var rect = canvas.current.getBoundingClientRect();
        const context = canvas.current.getContext("2d");
        canvas.current.width = width * devicePixelRatio;
        canvas.current.height = height * devicePixelRatio;
        // ensure all drawing operations are scaled
        context.scale(devicePixelRatio, devicePixelRatio);
        // scale everything down using CSS
        canvas.current.style.width = width + 'px';
        canvas.current.style.height = height + 'px';
        // may want to make it s.t. if screen size changes --> refresh app 

        context.beginPath();
        var grd = context.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(0, "darkturquoise");
        grd.addColorStop(1, "greenyellow");
        context.strokeStyle = grd;
        context.lineWidth = 1.5; 
        context.moveTo(width/(2), 0);
        context.lineTo(width/(2), (width));
        context.stroke();

        context.beginPath();
        grd = context.createLinearGradient(0, 0, width, 0);
        grd.addColorStop(0, "yellow");
        grd.addColorStop(1, "magenta");
        context.strokeStyle = grd;
        context.moveTo(0, (width)/(2));
        context.lineTo((width), (width)/(2));
        context.stroke();

        context.beginPath(); 
        context.fillStyle = "yellow"
        context.arc(5, width/2, 5, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.beginPath(); 
        context.fillStyle = "magenta"
        context.arc(width - 5, width/2, 5, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.beginPath(); 
        context.fillStyle = "darkturquoise"
        context.arc(width/2, 5, 5, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.beginPath(); 
        context.fillStyle = "greenyellow"
        context.arc(width/2, width - 5, 5, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        draw(context);
        xRect.current = rect.x;
        yRect.current = rect.y;
    });

    let xOffset; 
    if (position.x - xRect.current >= width/2 && smallFormat) {
        xOffset = -100
    } else {
        xOffset = 0;
    }

    const[hovered, setHovered] = useState("")

    if (isMobile || screenSize < 900) {
        return (
            <div> 
                <canvas className="canvas" ref={canvas} height={height} width={width}/>
                <HoverComponent x={position.x - xRect.current} 
                                y={position.y - yRect.current} 
                                imageSize={imageSize} 
                                axisLength={width}
                                popularity={popularity}
                                valence={valence}
                                songInfo={songInfo}
                                smallFormat={smallFormat}
                                isMobile={true}
                                />
            </div>
        )
    } else {
        return (
            <div style={{display: "flex"}}> 
                <canvas className="canvas" ref={canvas} height={height} width={width}/>
                <MouseTooltip
                className="test"
                visible={true}
                offsetX={xOffset}
                offsetY={0}
                >
                <HoverComponent x={position.x - xRect.current} 
                                y={position.y - yRect.current} 
                                imageSize={imageSize} 
                                axisLength={width}
                                popularity={popularity}
                                valence={valence}
                                songInfo={songInfo}
                                smallFormat={smallFormat}
                                isMobile={false}
                                setHovered={setHovered}
                                />
                </MouseTooltip>
                <ComputerTop songInfo={songInfo} hoveredSong={hovered}/>
            </div>
        )
    }
};

export const MemorizedCanvas = React.memo(Canvas, () => {
    return false
})