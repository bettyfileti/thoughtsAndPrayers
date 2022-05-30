// This example code is created based on:
// https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs#usage

let cam;
let pose;
let detector;
let recentLeftXs = [];
let recentRightXs = [];
let recentLeftYs = [];
let recentRightYs = [];
let recentLeftEyeXs = [];
let recentLeftEyeYs = [];
let recentRightEyeXs = [];
let recentRightEyeYs = [];
let numXs = 5; //this is the number of frames to average


let weArePraying = false;
let headlines = [];
let futura = "futura-pt-bold";
let futuraCondensed = "futura-pt-condensed";
let helvetica = "helvetica";
let activeHeadline;

let doingCount = 0;
let whatCanWeDo = [
  "How could this happen? Please pray for change.",
  "Not any better? Pray again.",
  "Please keep praying. We are so close.",
  "Pray harder.",
  "Please, more prayer."
]
let headlineSpeed = 50;

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.parent('canvas-container');

  background("#1B4D92");

  setupHeadlines();

  cam = createCapture(VIDEO, camReady);
  cam.size(640, 480);
  cam.hide();

  textFont(helvetica);
  activateRandomHeadline();
}

function draw() {
  image(cam, 0, 0);

  if (pose != undefined) {
    let pinkyDistance;
    let leftPinky = pose.keypoints[17];
    let rightPinky = pose.keypoints[18];

    let eyeDistance;
    let leftEyeInner = pose.keypoints[1];
    let rightEyeInner = pose.keypoints[4]


    let myAveragedLeftPinkyXPos = averagePos(leftPinky.x, recentLeftXs);
    let myAveragedLeftPinkyYPos = averagePos(leftPinky.y, recentLeftYs);

    let myAveragedRightPinkyXPos = averagePos(rightPinky.x, recentRightXs);
    let myAveragedRightPinkyYPos = averagePos(rightPinky.y, recentRightYs);

    let myAveragedLeftEyeXPos = averagePos(leftEyeInner.x, recentLeftEyeXs);
    let myAveragedLeftEyeYPos = averagePos(leftEyeInner.y, recentLeftEyeYs);

    let myAveragedRightEyeXPos = averagePos(rightEyeInner.x, recentRightEyeXs);
    let myAveragedRightEyeYPos = averagePos(rightEyeInner.y, recentRightEyeYs);

    eyeDistance = dist(myAveragedLeftEyeXPos, myAveragedLeftEyeYPos, myAveragedRightEyeXPos, myAveragedRightEyeYPos);

    push();
    noFill();
    strokeWeight(2);
    ellipse(leftEyeInner.x, leftEyeInner.y, 10);
    ellipse(rightEyeInner.x, rightEyeInner.y, 10);

    fill("blue");
    ellipse(myAveragedLeftEyeXPos, myAveragedLeftEyeYPos);
    ellipse(myAveragedRightEyeXPos, myAveragedRightEyeYPos);
    pop();

    // displayData(leftPinky);
    // displayData(rightPinky);

    pinkyDistance = dist(myAveragedLeftPinkyXPos, myAveragedLeftPinkyYPos, myAveragedRightPinkyXPos, myAveragedLeftPinkyYPos);
    if (leftPinky.score > .10 && rightPinky.score > .10) {

      if (myAveragedLeftPinkyYPos >= myAveragedRightPinkyYPos + 150 || myAveragedLeftPinkyYPos <= myAveragedRightPinkyYPos - 150) {
        console.log("pinky fingers are too far apart");
        pinkyDistance = 1000;// + leftPinky.score;
      } else {
        pinkyDistance = dist(myAveragedLeftPinkyXPos, myAveragedLeftPinkyYPos, myAveragedRightPinkyXPos, myAveragedLeftPinkyYPos);
      }
    } else {
      pinkyDistance = 2000; //+ leftPinky.score;
      console.log("Not confident on pinky positions."); // Left: ", leftPinky.score, "Right: ", rightPinky.score);
    }

    if (pinkyDistance < eyeDistance * 1.75) {
      if (weArePraying === false) {
        activeHeadline = random(headlines);
      }
      for (headline of headlines) {
        if (activeHeadline.headlineText === headline.headlineText) {
          headline.active = true;
        } else {
          headline.active = false;
        }
      }
      if (!weArePraying){
        doingCount++;
        if (doingCount > whatCanWeDo.length-1){
          doingCount = 0;
        }

      }
      weArePraying = true;
    } else {
      weArePraying = false;
    }


    for (let headline of headlines) {
      if (headline.active === true) {
        headline.draw();
      }
    }

    let frameCountSpeed = 10 * (whatCanWeDo.length - doingCount) //higher number here makes speed slower
    console.log(frameCountSpeed);
    if (weArePraying && frameCount % frameCountSpeed === 0) { 
      activateRandomHeadline();
    }


    if (!weArePraying){
      push();
      fill("white");
      textFont(futura);
      textSize(20);
      textAlign(CENTER);
      text(whatCanWeDo[doingCount], width/2, 40);
      pop();
    }

    //Display info
    // if (pinkyDistance != undefined) {
    //   push();
    //   textSize(12);
    //   fill("white");
    //   rect(0, 0, 100, 20);
    //   fill("black");
    //   text("dist:" + pinkyDistance.toFixed(2), 10, 15);

    //   fill("white");
    //   rect(0, 20, 100, 20);
    //   fill("black");
    //   if (weArePraying) {
    //     text("PRAYING", 10, 35);
    //   } else {
    //     text("NOT PRAYING", 10, 35);
    //   }

    //   fill("white");
    //   rect(0, 40, 100, 20);
    //   fill("black");
    //   text("eye dist:" + eyeDistance.toFixed(2), 10, 55);
    //   pop();
    // }

  }
}

//--------------------------------------------------------------
// Helper Functions

function camReady() {
  console.log("Webcam Ready!");
  loadPoseDetectionModel();
}

function displayData(posePosition) {
  push();
  translate(posePosition.x, posePosition.y);
  noStroke();
  fill(0, 255, 0);
  circle(0, 0, 5);
  text(posePosition.name, 10, 10);
  text("score:" + posePosition.score.toFixed(2), 10, 25);
  text("x,y:" + posePosition.x.toFixed(2) + " , " + posePosition.y.toFixed(2), 10, 40);
  pop();
}

function averagePos(x, myArray) {
  //This is from https://javascript.plainenglish.io/simple-smoothing-for-posenet-keypoints-cd1bc57f5872
  if (myArray.length < 1) {
    for (let i = 0; i < numXs; i++) {
      myArray.push(x);
    }
  } else {
    myArray.shift(); // removes first item from array
    myArray.push(x); // adds new x to end of array
  }
  // add up all the values in the array
  let sum = 0;
  for (let i = 0; i < myArray.length; i++) {
    sum += myArray[i];
  }
  // return the average x value
  return sum / myArray.length;
}


async function loadPoseDetectionModel() {
  const model = poseDetection.SupportedModels.BlazePose;
  const detectorConfig = {
    runtime: "tfjs",
    enableSmoothing: true,
    modelType: "full",  // (i.e., 'lite', 'full', 'heavy')
  };
  detector = await poseDetection.createDetector(model, detectorConfig);
  console.log("Model Loaded!");

  getPoses();
}

async function getPoses() {
  const estimationConfig = { flipHorizontal: true };
  const timestamp = performance.now();
  const poses = await detector.estimatePoses(
    cam.elt,
    estimationConfig,
    timestamp
  );

  pose = poses[0];

  getPoses();
}

function setupHeadlines() {
  headlines.push(new Headline("> BREAKING NEWS", "ALLEGED BUFFALO SHOOTER POSTED ONLINE ABOUT 'GREAT REPLACEMENT' CONSPIRACY THEORY DAYS BEFORE ATTACK", "msnbc", 2))
  headlines.push(new Headline("> BREAKING NEWS", "15 DEAD IN TX, U.S. MOURNS ANOTHER\nMASS SHOOTING THIS MONTH", "msnbc", 2))
  headlines.push(new Headline("> BREAKING NEWS", "TX GOV: 14 KIDS AND 1 TEACHER KILLED IN TX\nELEMENTARY SCHOOL SHOOTING", "msnbc", 2))
  headlines.push(new Headline("> BREAKING NEWS", "TX GOV: 15 VICTIMS IN MASS SHOOTING TX\nAT TEXAS SCHOOL, SHOOTER DEAD", "msnbc", 2))
  headlines.push(new Headline("> BREAKING NEWS", "BIDEN TO ADDRESS NATION ON TX SHOOTING AT 8:15 PM ET", "msnbc", 1))
  headlines.push(new Headline("> BREAKING NEWS", "AT LEAST 10 KILLED, 3 INJURED IN BUFFALO MASS SHOOTING", "msnbc", 1))

  headlines.push(new Headline("BREAKING NEWS", "TX GOV: 14 CHILDREN, 1 TEACHER DEAD IN ELEMENTARY SCHOOL SHOOTING", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "TEXAS GOV: 15 DEAD IN ELEMENTARY SCHOOL SHOOTING IN UVALDE,\nINCLUDING 14 STUDENTS AND 1 TEACHER; SUSPECT ALSO DEAD", "cnn", 2));
  headlines.push(new Headline("BREAKING NEWS", "TEXAS GOV: 14 CHILDREN, 1 TEACHER DEAD IN ELEMENTARY SCHOOL SHOOTING; GUNMAN IS 18-YEAR-OLD MALE; HAD A HANDGUN, POSSIBLY A RIFLE", "cnn", 2));
  headlines.push(new Headline("BREAKING NEWS", "TEXAS GOV: 15 DEAD IN ELEMENTARY SCHOOL SHOOTING IN UVALDE,\nA CITY OF ABOUT 16,000 PEOPLE ABOUT 80 MILES WEST OF SAN ANTONIO", "cnn", 2));
  headlines.push(new Headline("BREAKING NEWS", "SHERIFF: BUFFALO SHOOTING WAS A RACIALLY-MOTIVATED HATE CRIME", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "POLICE: 10 PEOPLE KILLED IN BUFFALO SUPERMARKET SHOOTING", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "GOV. HOCHUL: THIS WAS A MILITARY STYLE EXECUTION OF PEOPLE WHO SIMPLY WANTED TO BUY GROCERIES", "cnn", 2));
  headlines.push(new Headline("BREAKING NEWS", "POLICE: SUSPECT WORE TACTICAL GEAR, LIVESTREAMED SHOOTING", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "BUFFALO POLICE: SHOOTING SUSPECT IS A WHITE, 18-YEAR-OLD MALE", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "FBI: BUFFALO MASS SHOOTING BEING INVESTIGATED AS HATE CRIME", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "SOURCES: PURPORTED MANIFESTO LINKED TO SHOOTING UNDER REVIEW", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "BUFFALO MAYOR: SHOOTER CAME FROM HOURS AWAY TO COMMIT CRIME", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "BUFFALO MASS SHOOTING SUSPECT ARRAIGNED ON MURDER CHARGES", "cnn", 1));
  headlines.push(new Headline("BREAKING NEWS", "POLICE: 10 PEOPLE KILLED IN BUFFALO SUPERMARKET SHOOTING", "cnn", 1));

  headlines.push(new Headline("NEW THIS MORNING", "PRESIDENT BIDEN HEADS TO BUFFALO", "abc", 2, "WILL MEET WITH VICTIMS' FAMILIES IN WAKE OF DEADLY SUPERMARKET SHOOTING"));
  headlines.push(new Headline("DEVELOPING STORY", "DEADLY SUPERMARKET SHOOTING INVESTIGATION", "abc", 2, "NEW DETAILS ON SUSPECT AS PRESIDENT BIDEN HEADS TO BUFFALO"));
  headlines.push(new Headline("DEVELOPING STORY", "NEW DETAILS IN SUPERMARKET SHOOTING INVESTIGATION", "abc", 2, "POLICE: SUSPECT PLANNED DEADLY BUFFALO RAMPAGE FOR MONTHS"));
  headlines.push(new Headline("DEVELOPING STORY", "DEADLY SUPERMARKET SHOOTING INVESTIGATION", "abc", 2, "SURVIVORS OF DEADLY RAMPAGE SHARE THEIR HARROWING STORY"));
  headlines.push(new Headline("DEVELOPING STORY", "REMEMBERING THE VICTIMS", "abc", 2, "10 KILLED IN DEADLY BUFFALO SUPERMARKET RAMPAGE"));
  headlines.push(new Headline("DEVELOPING STORY", "DEADLY SUPERMARKET SHOOTING INVESTIGATION", "abc", 2, "NEW QUESTIONS ABOUT MISSED WARNING SIGNS & SUSPECT'S PATH TO RADICALIZATION"));
  headlines.push(new Headline("DEVELOPING STORY", "DEADLY SUPERMARKET SHOOTING INVESTIGATION", "abc", 2, "NEW QUESTIONS ABOUT MISSED WARNING SIGNS & SUSPECT'S PATH TO RADICALIZATION"));

}

function activateRandomHeadline() {
  activeHeadline = random(headlines);
  for (headline of headlines) {
    if (activeHeadline.headlineText === headline.headlineText) {
      headline.active = true;
    } else {
      headline.active = false;
    }
  }
}
