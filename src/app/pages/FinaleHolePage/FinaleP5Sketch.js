export default function FinaleP5Sketch(p5){
    let canvas;
    let torsoPos = 0;
    //let jawPos = 0;


  
    p5.setup = () => {
      p5.createCanvas(350, 500);
      p5.noStroke();
      p5.fill(255);
      
      //Draw the rectangle from the center and it will also be the
      //rotate around that center
      p5.rectMode('CENTER')
    }

    p5.updateWithProps = p => {
      const torsoStatus = p.torsoMsg ? JSON.parse(p.torsoMsg): JSON.parse("{}");
      const jointState = p.jointStateMsg !== ""? p.jointStateMsg: null
      
      if (jointState !== null){
        if(jointState.name[0] === "torso_joint"){
          const torsoPosDeg = jointState.position[0];
          //console.log("torsoPos: " + String(torsoPos));
          torsoPos = torsoPosDeg*Math.PI/180.0; //convert to radians
          //console.log("torsoVel: " + String(jointState.velocity[0]));
        }
      }
      else{
        torsoPos = 0.0;
      }
    

      //console.log(torsoStatus.actualPosition)
      //torsoPos = torsoStatus.actualPosition? torsoStatus.actualPosition*Math.PI/180.0 : 0; //convert to radians
    }

    p5.draw = () => {
      p5.background(51);
      p5.push();
      p5.translate(p5.width / 2, p5.height - 50);
      p5.ellipse(10,10,10,10);
      p5.pop();
      p5.translate(p5.width / 2, 50);
      p5.rotate(-torsoPos)
      p5.rect(-25,0,50,100);
      p5.rect(-50,30,100,20);

      
    };

    p5.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
      if(canvas) //Make sure the canvas has been created
        p5.fill(newProps.color);
    }
}