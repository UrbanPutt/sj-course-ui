export default function FinaleP5Sketch(p5){
    let canvas;
    let lowerLiftPos = 0;
    let upperLiftPos = 0;
 


  
    p5.setup = () => {
      p5.createCanvas(350, 350);
      p5.noStroke();
      p5.fill(255);
      
      //Draw the rectangle from the center and it will also be the
      //rotate around that center
      p5.rectMode('CENTER')
    }

    p5.updateWithProps = p => {
      const jointState = p.jointStateMsg !== ""? p.jointStateMsg: null
      
      if (jointState !== null){
        if(jointState.name[0] === "bismuth_lift_lower_joint"){
          const lowerLiftPos = Math.round(jointState.position[0]*10);
          //console.log("lowerLiftPos: " + String(lowerLiftPos));
        }
        else if (jointState.name[0] === "bismuth_lift_upper_joint"){
          const upperLiftPos = jointState.position[0];
          //console.log("torsoVel: " + String(jointState.velocity[0]));
        }
      }
      else{
        lowerLiftPos = 0;
      }
      console.log("lowerLiftPos: " + String(lowerLiftPos));
    }

    console.log("lowerLiftPos: " + String(lowerLiftPos));

    p5.draw = (lowerLiftPos) => {
      p5.background(51);
      p5.push()
      p5.ellipse(10,lowerLiftPos,10,10);
      //console.log("lowerLiftPos: " + String(lowerLiftPos));
    };

    p5.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      if(canvas) //Make sure the canvas has been created
        p5.fill(newProps.color);
    }
}