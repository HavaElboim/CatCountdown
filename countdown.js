var intervalID;

var spinner = document.querySelector("#spinner");
spinner.style.display = "none";

// these will be the minutes and seconds the user input.
// their value will be inserted once the startTimer() function is started by a button click
var minutes = document.querySelector("#minutes");
var seconds = document.querySelector("#seconds");

//these will be the minutes and seconds left in the countdown,
// displayed in the central display.
// they need to be kept in a separate variable,
// otherwise the inputted mins and secs displayed will also decrease with the countdown.
var minutesLeft, secondsLeft;
var colon = document.querySelector("#displayColon").innerHTML;

/*
The following could be defined instead of the onclick="startTimer()" inside the button definition in the HTML:

var startButton = document.querySelector("#startButton");
startButton.addEventListener("click", startTimer);
var stopButton = document.querySelector("#stopButton");
stopButton.addEventListener("click", stopTimer);
*/

var catImageSrc = document.querySelector("#catpic");

/* enfore the attributes min="0" and max="59" for number of seconds
(since the browser ignores it and lets the user enter numbers out of range) */

function enforceMax(el) {
  //this function forces the webpage to read the input as a number and not a string
  //so that it will enforce the min="0" attribute of the input

  //It will also remove leading zeros (if the value input is not zero)
  //and then trim the input to a number less than 60.
  //If the user inputs a number bigger than 59,
  //trim off one or more of the last digits

  /* enforce input value to be zero or above, by removing any minus (or plus) sign from the number
(since such an input would most likely be a typing mistake) */
  el.value = el.value.replace("/-+/gi", "");

  //the following line is a trick to strip off leading zeros and also force the input to be read as a number
  //(since you ask js to compute a value using the number 0, it will return a number and not a string
  // - the number it will return will be by default without a trailing 0)
  el.value = el.value - 0;

  // while input value is over 59, strip off last digit
  // (this is preferable to reducing the value to 59, since it is more intuitive to the user)
  while (parseInt(el.value) > parseInt(el.max)) {
    el.value = el.value.slice(0, -1);
  }
}

function updateTimerDisplay() {
  // better to use .innerText than .innerHTML
  document.querySelector("#displayMins").innerHTML = minutesLeft;
  // make sure seconds value between 0 and 9 get converted to 2-digit format:
  document.querySelector("#displaySecs").innerHTML =
    secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
}

function startTimer() {
  // reset cat image to blank (in case there's an image left from a previous countdown)
  catImageSrc.src = "";
  catImageSrc.src.display = "none";
  //if no value entered for minutes, set minutes to zero
  minutes.value = minutes.value === "" ? 0 : minutes.value;
  seconds.value = seconds.value === "" ? 0 : seconds.value;

  /* instead of having a separate display for mins, : and secs,
define them all as an element called clock,
and then use:
clock.innerText = (mins<0? ("0" + mins):mins ) + ":" + ((secs<0? ("0"+secs): secs) ;
*/
  //disable the input boxes while the timer runs
  minutes.disabled = true;
  seconds.disabled = true;

  //don't start counting time if a zero time length has been entered
  if (minutes.value === 0 && seconds.value === 0) {
    return 0;
  }

  //display the countdown on the screen
  minutesLeft = minutes.value;
  secondsLeft = seconds.value;
  updateTimerDisplay();

  //start counting down time with intervals of one second (= 1000 miliseconds)
  intervalID = setInterval(function () {
    if (secondsLeft == 0) {
      // use == and not === because we need to convert the string seconds.value to a number
      if (minutesLeft == 0) {
        // use == and not === because we need to convert the string minutes.value to a number

        //got to end of countdown, stop the interval timer
        clearInterval(intervalID);

        //display a cat image
        displayCat();
        //NB the image loads very slowly, and not immediately on countdown reaching zero.
        //I tried instead to load the image into the data-src catImageSrc.dataset.src
        //at the beginning of the startTimer function, and then set
        // catImageSrc.src = catImageSrc.dataset.src
        // once the countdown reached zero,
        // but I didn't see any improvement in speed,
        // so I put the original displayCat() function back in place.

        //allow back input into input fields:
        minutes.disabled = false;
        seconds.disabled = false;
      } else {
        minutesLeft--;
        secondsLeft = 59;
      }
    } else {
      secondsLeft--;
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  // stop the counting process
  clearInterval(intervalID);

  // If you want the timer to be able to pause the countdown and then continue from
  // where it left off, then uncomment out the following 2 lines of code:
  // reset the user input minutes and seconds
  // to reflect the time left in the countdown after it was paused in the middle
  /*
  minutes.value = minutesLeft;
  seconds.value = secondsLeft;
  */

  //allow back input into input fields:
  minutes.disabled = false;
  seconds.disabled = false;
}

function pauseTimer() {
  // stop the counting process
  clearInterval(intervalID);

  // If you want the timer to be able to pause the countdown and then continue from
  // where it left off, then uncomment out the following 2 lines of code:
  // reset the user input minutes and seconds
  // to reflect the time left in the countdown after it was paused in the middle

  minutes.value = minutesLeft;
  seconds.value = secondsLeft;
}
async function displayCat() {
  /*spinner.style.display = "block";*/
  /* or use the . before the class name to refer to the class:
   */
  document.querySelector(".lds-dual-ring").style.display = "inline-block";
  // fetches a new cat image from the "random cat" site each time
  var result = await fetch("https://aws.random.cat/meow");
  var json = await result.json();

  catImageSrc.src = json.file;
  catImageSrc.style.display = "none"; //מסתיר את התמונה כדי לא לשנות את גודל הרקע

  //use onload to vanish the spinner only once the image has finished loading:
  catImageSrc.onload = function () {
    document.querySelector(".lds-dual-ring").style.display = "none";
    //מסתיר את התמונה כדי לא לשנות את גודל הרקע
    setTimeout(function () {
      catImageSrc.style.display = "none";
    }, 3000);
    catImageSrc.style.display = "inline-block"; //אחרי שטוען את התמונה חושף אותה 
  };
}
