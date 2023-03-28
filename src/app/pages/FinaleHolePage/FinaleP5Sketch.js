
export default function FinaleP5Sketch(p5){
    let canvas;
    let lowerLiftPos = 0;
    let upperLiftPos = 0;
 
    const inch_to_pixel = 20;

  
    p5.setup = () => {
      p5.createCanvas(375, 305);
      p5.noStroke();
      p5.fill(255);
      
      //Draw the rectangle from the center and it will also be the
      //rotate around that center
      p5.rectMode('CENTER')
    }

    p5.updateWithProps = p => {
      const jointState = p.jointStateMsg !== ""? p.jointStateMsg: null
      
      if (jointState !== null){
        //console.log(jointState.name[2]);
        if(jointState.name[0] === "bismuth_lift_lower_joint"){
          lowerLiftPos = Math.round(jointState.position[0]*inch_to_pixel);
          console.log("lowerLiftPos: " + String(lowerLiftPos));
        }
        else if (jointState.name[0] === "bismuth_lift_upper_joint"){
          upperLiftPos = Math.round(jointState.position[0]*inch_to_pixel);
          //console.log("upperLiftPos: " + String(upperLiftPos));
        }
        else{
          //console.log(jointState.name[0]);
        }
      }
      else{
        lowerLiftPos = 0;
        upperLiftPos = 0;
      }
      
    }

    let y_pad = 150;    

    p5.draw = () => {
      p5.background(51);
      p5.push();
      p5.translate(150,y_pad);
      p5.rect(0,0,5,7*inch_to_pixel);
      p5.rect(0,7*inch_to_pixel-lowerLiftPos,25,10);
      p5.pop();
      p5.push();
      p5.translate(200,y_pad-6*inch_to_pixel);
      p5.rect(0,0,5,7*inch_to_pixel);
      p5.rect(-25+5,7*inch_to_pixel-upperLiftPos,25,10);

    };

    p5.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      if(canvas) //Make sure the canvas has been created
        p5.fill(newProps.color);
    }
}