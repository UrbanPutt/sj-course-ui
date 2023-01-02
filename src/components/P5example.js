import React from 'react'
import Sketch from 'react-p5'

function P5example(props){
    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(500,400).parent(canvasParentRef);
    }

    console.log(props.x);

    const draw = (p5) => {
        p5.background(255,130,20);
        p5.ellipse(100,100,100);
        p5.ellipse(200,100,100);
    }

    return (
         <Sketch setup={setup} draw={draw} />
    );
};

export default P5example