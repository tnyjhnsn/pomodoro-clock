$(document).ready(function() {
  var myClock = new Clock();
  $("#work-plus").on("click", function() {
    myClock.setBaseWork(1);
  })
  $("#work-minus").on("click", function() {
    myClock.setBaseWork(-1);
  })
  $("#break-plus").on("click", function() {
    myClock.setBaseBreak(1);
  })
  $("#break-minus").on("click", function() {
    myClock.setBaseBreak(-1);
  })
  $("#timer").on("click", function() {
    myClock.pause();
  })
})

var Clock = function() {

  var baseWork = 25;
  var baseBreak = 5;
  var atWork = true;
  var onBreak = false;
  var paused = true;
  var session = getWork();

  var stopClockNotice = "Clock must be paused first";
  var limitWarning = "Cannot set time less than 1 minute";
  var atWorkStatus = "AT WORK";
  var onBreakStatus = "ON BREAK";

  var minutes = document.getElementById('minutes');
  var seconds = document.getElementById('seconds');
  var bucket = document.getElementById('bucket');
  var workBaseTime = document.getElementById('work-base');
  var breakBaseTime = document.getElementById('break-base');
  var status = document.getElementById('status');
  var notice = document.getElementById('notice');

  var timeInterval;

  this.setBaseWork = function(val) {
    if (paused && baseWork + val >= 1) {
      baseWork += val;
      workBaseTime.innerHTML = padTime(baseWork);
      session = atWork ? getWork() : session;
    } else {
      feedback(notice, baseWork === 1 ? limitWarning : stopClockNotice);
    }
  }

  this.setBaseBreak = function(val) {
    if (paused && baseBreak + val >= 1) {
      baseBreak += val;
      breakBaseTime.innerHTML = padTime(baseBreak);
      session = onBreak ? getBreak() : session;
    } else {
      feedback(notice, baseBreak === 1 ? limitWarning : stopClockNotice);
    }
  }

  this.pause = function() {
    clearInterval(timeInterval);
    resetFeedback();
    if (!paused) {
      paused = true;
      return;
    }
    paused = false;
    timeInterval = setInterval(run, 1000);
    feedback(status, atWork ? atWorkStatus : onBreakStatus);
  }

  function feedback(id, text) {
    id.innerHTML = text.toUpperCase();
  }

  function resetFeedback() {
    feedback(notice, "=:=");
  }

  function getWork() {
    return baseWork * 60000;
  }

  function getBreak() {
    return baseBreak * 60000;
  }

  function run() {
    var time = calculateTime();
    minutes.innerHTML = padTime(time.minutes);
    seconds.innerHTML = padTime(time.seconds);
    bucket.style.height = time.bucket + "%";
    if (session <= 0) {
      toggleClock();
    }
    session -= 1000;
  }

  function toggleClock() {
    clearInterval(timeInterval);
    atWork = !atWork;
    onBreak = !onBreak;
    bucket.className = atWork ? "work" : "break";
    session = atWork ? getWork() : getBreak();
    timeInterval = setInterval(run, 1000);
    feedback(status, atWork ? atWorkStatus : onBreakStatus);
  }

  function calculateTime() {
    var minutes = Math.floor((session / 1000 / 60) % 60);
    var seconds = Math.floor((session / 1000) % 60);
    var bucket = atWork ? (session / getWork() * 100) :
      (100 - (session / getBreak() * 100));
    return {
      'minutes': minutes,
      'seconds': seconds,
      'bucket' : bucket
    };
  }

  function padTime(time) {
    return ('0' + time).slice(-2);
  }
}

