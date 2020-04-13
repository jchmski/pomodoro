var activeTimer;
var timerStarted = false;
var timerRunning = false;

$(document).ready(function() {
	$('.what, .test-audio, .close-modal').on('click', function(e) {
		e.preventDefault();
	});

	$('.timers a').on('click', function(e) {
		e.preventDefault();

		resetTimers();

		if (!timerRunning) {
			// reset timers if one is at 0
			$('.timer > div').each(function() {
				if($(this).attr('data-time-left') < 1) {
					resetTimers();
				}
			});

			$('.timers a').removeClass('selected');

			var $timers_item = $(e.target);
			$timers_item.addClass('selected');

			var timer_id = '.' + $timers_item.attr('rel');

			$('.timer > div').hide();
			$(timer_id).show();
		}
	});

	$('.timer_button > a').on('click', function(e) {
		e.preventDefault();

		if(!timerRunning) {
			var $timer_span = $('.timer > div').filter(':visible');

			var duration;

			// use "time-left" if timer hasn't been reset
			if($timer_span.attr('data-time-left') > 0) {
				duration = $timer_span.attr('data-time-left');
			} else {
				resetTimers();
				duration = $timer_span.attr('data-time') - 1;
			}

			startTimer(duration, $timer_span);
		} else {
			pauseTimer();
		}
	});

	$('.reset > a').on('click', function(e) {
		e.preventDefault();
		pauseTimer();
		resetTimers();
	});

	$('.what, .md-overlay, .close-modal').on('click', function() {
		$('.what-modal').toggleClass('md-show');
	});

	$('.test-audio').on('click', function() {
		ding();
	});
});


function startTimer(duration, timer_span) {
    var timer = duration, minutes, seconds;

    activeTimer = setInterval(function() {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

		document.title = 'Pomodoro (' + minutes + ':' + seconds + ')';
        timer_span.text(minutes + ':' + seconds);
		timer_span.attr('data-time-left', timer);

        if (--timer < 0) {
			resetTimers();

			ding();

			document.querySelector('.timer').classList.add('shaking');

			setTimeout(() => {
				document.querySelector('.timer').classList.remove('shaking');
			}, 684); // matches CSS: 38ms per animation cycle * 15 cycles
        }
    }, 1000);

	timerStarted = true;
	timerRunning = true;

	showButton('pause');
}


function pauseTimer() {
	window.clearInterval(activeTimer);
	timerRunning = false;

	showButton('start');
}


// resets all timers to original positions
function resetTimers() {
	$('.timer > div').each(function() {
		$(this).removeAttr('data-time-left').text($(this).attr('data-orig'));
	});

	window.clearInterval(activeTimer);

	timerStarted = false;
	timerRunning = false;

	showButton('start');
}


function showButton(toggleVal) {
	if(toggleVal === 'start') {
		const textStr = (timerStarted) ? 'resume timer' : 'start timer';

		$('.timer_button > a').removeClass('running').text(textStr);
	} else if(toggleVal === 'pause') {
		$('.timer_button > a').addClass('running').text('pause timer');
	}
}


function ding() {
	$('audio')[0].play();
}
