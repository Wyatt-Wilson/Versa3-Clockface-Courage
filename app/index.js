import clock from "clock";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { preferences } from "user-settings";
import { battery } from "power";

////////////////////////////////////////////////////////////////////
///   ui elements     
// steps
const uiSteps = document.getElementById("labelSteps");

// cals
const uiCals = document.getElementById("labelCals");

// distance
const uiDist = document.getElementById("labelDist");

// heart rate
const uiHeartRate = document.getElementById("labelHeartRate");

////////////////////////////////////////////////////////////////////
///    Assigning values to corresponding stats
function updateStats() {
  uiSteps.text = `${today.adjusted.steps}`;
  uiCals.text = `${today.adjusted.calories}`;
  const dist = `${today.adjusted.distance}`;
  dist /= 1609; //converting meters to miles
  dist = dist.toFixed(2);
  uiDist.text = dist;
}

////////////////////////////////////////////////////////////////////
///    Heart rate
if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    uiHeartRate.text = `${hrm.heartRate}`; //constantly assigning the heart rate in real time
  });
  hrm.start();
}


////////////////////////////////////////////////////////////////////
///    default clock
function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");


////////////////////////////////////////////////////////////////////
///    tick event (for every tick, do the following below)
// Update the <text> element every tick with the current time as well as other elements
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
  
  //    Getting battery pngs to load
  const imgReplace = document.getElementById("batteryIcon");
  if(battery.charging){ //use "charger.connected" if you want to see if a charger is connected in general (must import charger from power)
    imgReplace.href = "icons/batteryCharge.png";
  } else if(Math.floor(battery.chargeLevel) > 75){ //If battery % is greater than 75 then display the appropriate battery.png and so on...
    imgReplace.href = "icons/battery100.png";
  } else if(Math.floor(battery.chargeLevel) > 50){
    imgReplace.href = "icons/battery75.png";
  } else if(Math.floor(battery.chargeLevel) > 25){
    imgReplace.href = "icons/battery50.png";
  } else if(Math.floor(battery.chargeLevel) > 10){
    imgReplace.href = "icons/battery25.png";
  } else if(Math.floor(battery.chargeLevel) > 0){
    imgReplace.href = "icons/battery10.png";
  };

  //    Continuously updating stats
  updateStats();
}

////////////////////////////////////////////////////////////////////
///    Months/Dates obtained from: https://github.com/netojoa/blog/blob/master/fitbit/my-first-clock-face-os5/app/index.js
///    This is another tick event, however, I have left it unchanged for clearer understanding
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
