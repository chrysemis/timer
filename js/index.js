/* Credit for help with arc color animation on timer to http://s.codepen.io/MutantSpore/debug/WvVZyM */

$(document).ready(function() {

  //html element variables
  var $main = $('#main');
  var $setup = $('#setup');
  var $timer = $('#time');
  var $sessionLength = $('#session-length .length');
  var $breakLength = $('#break-length .length');
  var $sessionBreak = $('#session-break');

  //function variables
  var interval, sessionSeconds, initialTime;
  var countdownOn = true;
  var switchState = 'session';
  var lineColor = 'cadetblue',
    baseColor = 'orange';

  //canvas 
  var $canvas = $('#canvas')[0];
  var ctx = $canvas.getContext('2d');
  var x = $canvas.width / 2;
  var y = $canvas.height / 2;

  //audio elements 
  var audio = $('audio')[0];
  //checking values in html input form are valid, i.e. positive numbers
  //reset values to 25min session/5min break if wrong user input
  $sessionLength.focusout(function() {
    var timeInserted = $(this).val();
    if (isNaN(timeInserted) || timeInserted <= 0) $(this).val(25);
  });

  $breakLength.focusout(function() {
    var timeInserted = $(this).val();
    if (isNaN(timeInserted) || timeInserted <= 0) $(this).val(5);
  });

  //set up session length and break length on setup section
  $('.button').click(function() {
    var $this = $(this);
    var $length = $this.siblings().children('.length');
    var length = $length.val();

    if ($this.is('.minus') && length > 1) length--;
    else if ($this.is('.plus') && length < 60) length++;

    $length.val(length);
  });

  //hide setup section
  //setup and show time display and initial color arc
  //start session countdown
  $('#start').click(function() {
    sessionSeconds = $sessionLength.val() * 60;
    initialTime = sessionSeconds;
    colorSetUp(1.5, 123, 'indigo');
    colorSetUp(10, 132, baseColor);
    colorSetUp(1.5, 140, 'indigo');
    $sessionBreak.text('work');
    displayTime();
    $main.show();
    $setup.hide();
    startTimer();
  });

  //pause timer and restart after pause
  $('#pause').click(function() {
    if (countdownOn) {
      pauseTimer();
      countdownOn = false;
      $(this).html('<i class="fa fa-play-circle-o" aria-hidden="true"></i>');
    } else {
      startTimer();
      countdownOn = true;
      $(this).html('<i class="fa fa-pause-circle-o" aria-hidden="true"></i>');
    }
  });

  //stop timer
  $('#stop').click(function() {
    stopTimer();
  });

  //resetting session length to 25 mins and break length to 5 mins
  $('#reset').click(function() {
    $sessionLength.val('25');
    $breakLength.val('5');
  });

  //declaring functions
  function startTimer() {
    interval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    sessionSeconds--;
    displayTime();
    colorAnimation();
    if (sessionSeconds === 0) {
      audio.play();
      switchSession();
    }
  }

  function pauseTimer() {
    clearInterval(interval);
  }

  function stopTimer() {
    $setup.show();
    $main.hide();
    clearInterval(interval);
    baseColor = 'orange';
    lineColor = 'cadetblue';
  }

  function displayTime() {
    $timer.html(pad(parseInt(sessionSeconds / 60)) + ':' + pad(parseInt(sessionSeconds % 60)));

    function pad(val) {
      var valString = val + "";
      if (valString.length < 2) {
        return "0" + valString;
      } else {
        return valString;
      }
    }
  }

  //switching between session and break
  function switchSession() {
    if (switchState === 'session') {
      clearInterval(interval);
      sessionSeconds = $breakLength.val() * 60;
      switchState = 'break';
      baseColor = 'cadetblue';
      lineColor = 'orange';
      fadeEffect('break');
    } else {
      clearInterval(interval);
      sessionSeconds = $sessionLength.val() * 60;
      switchState = 'session';
      baseColor = 'orange';
      lineColor = 'cadetblue';
      fadeEffect('work');
    }
  }

  function fadeEffect(sessName) {
    var $display = $('#display');
    $display.hide();
    $sessionBreak.text(sessName);
    displayTime();
    $display.fadeIn('slow');
    startTimer();
  }

  //initial color setup
  function colorSetUp(lwidth, r, colorName) {
    ctx.strokeStyle = colorName;
    ctx.lineWidth = lwidth;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
  }

  //color animation during countdown
  function colorAnimation() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    colorSetUp(1.5, 123, 'indigo');
    colorSetUp(10, 132, baseColor);
    colorSetUp(1.5, 140, 'indigo');
    /*
         full length:
         angle = 2 
         if we start at start angle 0:
      angle =  2 - sessionSeconds/initialTime * 2
      if we start at start angle 0.5:
      angle = (2 - sessionSeconds/initialTime * 2) + 0.5
    */
    var angle = (2 - sessionSeconds / initialTime * 2) + 0.5;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(x, y, 132, 0.5 * Math.PI, angle * Math.PI);
    ctx.stroke();
    requestAnimationFrame(colorAnimation);
  }

});