import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { me as appbit } from "appbit";
import { preferences } from "user-settings";
import { week } from "user-activity";
//import { battery } from "power"; not in use at the moment

////////////////////////////////////////////////////////////////////
///   ui elements     

// steps
const uiSteps = document.getElementById("labelSteps"); //today.adjusted.steps;
//console.log(`${today.adjusted.steps}`); this prints the number of steps

// cals
const uiCals = document.getElementById("labelCals");

// active zone minutes
const uiDist = document.getElementById("labelDist"); //not currently in used

// heart rate
const uiHeartRate = document.getElementById("labelHeartRate");

////////////////////////////////////////////////////////////////////
///   debugging for general ui's
if (HeartRateSensor) {
  console.log("This device has a HeartRateSensor!");
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    console.log(`Current heart rate: ${hrm.heartRate}`);
    uiHeartRate.text = `${hrm.heartRate}`; //implementation of heart rate text
  });
  hrm.start();
} else {
  console.log("This device does NOT have a HeartRateSensor!");
}


if (appbit.permissions.granted("access_activity")) {
   console.log(`${week.adjusted.activeZoneMinutes} AZM`);
   console.log(`${today.adjusted.distance} Distance`);
}
if (appbit.permissions.granted("access_activity")) {
  console.log(`${today.adjusted.steps} Steps`);
  if (today.local.elevationGain !== undefined) {
    console.log(`${today.adjusted.elevationGain} Floor(s)`);
  }
}

////////////////////////////////////////////////////////////////////
///    getting matching text for appropriate ui
uiSteps.text = `${today.adjusted.steps}`;
uiCals.text = `${today.adjusted.calories}`;
uiDist.text = `${today.adjusted.distance}`;
//uiAzm.text = `${today.adjusted.elevationGain}`;

function zeroPad(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  

////////////////////////////////////////////////////////////////////
///    default clock
  // Update the clock every minute
  clock.granularity = "minutes";
  
  // Get a handle on the <text> element
  const myLabel = document.getElementById("myLabel");
  
  // Update the <text> element every tick with the current time
  clock.ontick = (evt) => {
    let today = evt.date;
    let hours = today.getHours();
    if (preferences.clockDisplay === "12h") {
      // 12h format
      hours = hours % 12 || 12;
    } else {
      // 24h format
      hours = zeroPad(hours);
    }
    let mins = zeroPad(today.getMinutes());
    myLabel.text = `${hours}:${mins}`;
  }


////////////////////////////////////////////////////////////////////
///    Months/Dates obtained from: https://github.com/netojoa/blog/blob/master/fitbit/my-first-clock-face-os5/app/index.js

//let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");

clock.granularity = "seconds";
clock.addEventListener("tick", tickHandler);

function tickHandler(evt) {
  let today = evt.date;

  let fullYear = today.getFullYear();
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = today.getDate();
  
  let dateString = `${dayNumber} ${monthNameShort} ${fullYear}`;
  txtDate.text = dateString;
}

  const monthsShort = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
