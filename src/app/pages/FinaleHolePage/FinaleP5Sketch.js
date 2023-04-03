
export default function FinaleP5Sketch(p5){
    let canvas;
    let lowerLiftPos = 0;
    let upperLiftPos = 0;
    let lowerLiftPosInch = "0.0"+'"';
    let upperLiftPosInch = "0.0"+'"';
 
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
          lowerLiftPosInch = String(jointState.position[0].toFixed(2))+'"';
          //console.log("lowerLiftPos: " + String(lowerLiftPos));
        }
        else if (jointState.name[0] === "bismuth_lift_upper_joint"){
          upperLiftPos = Math.round(jointState.position[0]*inch_to_pixel);
          upperLiftPosInch = String(jointState.position[0].toFixed(2))+'"';
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
      p5.textSize(15);
      p5.fill(150,150,150)
      p5.text('lower lift',80,300)
      p5.text('upper lift',220,180)
      p5.push();
      p5.fill(150,150,150)
      p5.translate(150,y_pad);
      p5.rect(0,0,5,7*inch_to_pixel);
      p5.fill(255,255,255)
      p5.rect(0,7*inch_to_pixel-lowerLiftPos,25,10);
      p5.text(lowerLiftPosInch,0,7*inch_to_pixel-lowerLiftPos);
      p5.pop();
      p5.push();
      p5.fill(150,150,150)
      p5.translate(200,y_pad-6*inch_to_pixel);
      p5.rect(0,0,5,7*inch_to_pixel);
      p5.fill(255,255,255)
      p5.text(upperLiftPosInch,0,7*inch_to_pixel-upperLiftPos);
      p5.rect(-25+5,7*inch_to_pixel-upperLiftPos,25,10);

    };

    p5.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      if(canvas) //Make sure the canvas has been created
        p5.fill(newProps.color);
    }
}