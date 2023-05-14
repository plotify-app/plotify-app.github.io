import React from "react";

export function KeyCanvas ({ height, width, smallFormat }) {
    
    const canvas = React.useRef();
    
    React.useEffect(() => {
        const context = canvas.current.getContext("2d");
        canvas.current.width = width * devicePixelRatio;
        canvas.current.height = height * devicePixelRatio;
        // ensure all drawing operations are scaled
        context.scale(devicePixelRatio, devicePixelRatio);
        // scale everything down using CSS
        canvas.current.style.width = width + 'px';
        canvas.current.style.height = height + 'px';
        // may want to make it s.t. if screen size changes --> refresh app 

        let lineStartX = 88; 
        let lineEndX = 113; 
        let radius = 5; 
        let fontsize = "14px"
        let hypeStart = 12; 
        let rightSideStart = 125; 

        if (smallFormat) {
            fontsize = "12px"
            radius = 4;
            lineStartX = 75;
            lineEndX = 95; 
            hypeStart = 11;
            rightSideStart = 104;
        }
        context.beginPath();
        var grd = context.createLinearGradient(lineStartX, 35, lineEndX - 10, 35);
        grd.addColorStop(0, "darkturquoise");
        grd.addColorStop(1, "greenyellow");
        context.strokeStyle = grd;
        context.lineWidth = 1.5; 
        context.moveTo(lineStartX, 35);
        context.lineTo(lineEndX, 35);
        context.stroke();

        context.beginPath();
        grd = context.createLinearGradient(lineStartX, 15, lineEndX, 15);
        grd.addColorStop(0, "yellow");
        grd.addColorStop(1, "magenta");
        context.strokeStyle = grd;
        context.moveTo(lineStartX, 15);
        context.lineTo(lineEndX, 15);
        context.stroke();

        context.beginPath(); 
        context.fillStyle = "yellow"
        context.arc(lineStartX - radius, 15, radius, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.beginPath(); 
        context.fillStyle = "magenta"
        context.arc(lineEndX - radius, 15, radius, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.beginPath(); 
        context.fillStyle = "darkturquoise"
        context.arc(lineStartX - radius, 35, radius, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.beginPath(); 
        context.fillStyle = "greenyellow"
        context.arc(lineEndX - radius, 35, radius, 0 * Math.PI, 2 * Math.PI);
        context.fill();

        context.fillStyle = "grey";
        context.font = fontsize + " Helvetica";
        context.fillText("underrated", 0, 18);

        context.fillStyle = "grey";
        context.font = fontsize + " Helvetica";
        context.fillText("happy :))", hypeStart, 38);

        context.fillStyle = "grey";
        context.font = fontsize + " Helvetica";
        context.fillText("basic", rightSideStart, 18);

        context.fillStyle = "grey";
        context.font = fontsize + " Helvetica";
        context.fillText("sad :(", rightSideStart, 38);
    });

    return (
        <div> 
            <canvas className="keyCanvas" ref={canvas} height={height} width={width} />
        </div>
    )
};
