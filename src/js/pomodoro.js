window.addEventListener('load', () => {
	let activeTimer;
	let timerStarted = false;
	let timerRunning = false;

	const timer_button = document.querySelector('.timer_button > a');
	const timer_links = document.querySelectorAll('.timer_links a');
	const timers = document.querySelectorAll('.timers > div');

	document.querySelectorAll('.what, .test-audio, .close-modal').forEach((element) => {
		element.addEventListener('click', (e) => {
			e.preventDefault();
		});
	});

	timer_links.forEach((timer_link) => {
		timer_link.addEventListener('click', (e) => {
			e.preventDefault();

			resetTimers();

			if (!timerRunning) {
				// reset timers if one is at 0
				timers.forEach((timer) => {
					if (timer.getAttribute('data-time-left') < 1) {
						resetTimers();
					}
				});

				timer_links.forEach((timer) => {
					timer.classList.remove('selected');
				});

				var timers_item = e.target;

				timers_item.classList.add('selected');

				var timer_to_show = document.querySelector('.' + timers_item.getAttribute('rel'));

				timers.forEach((timer) => {
					if (timer === timer_to_show) {
						timer.classList.add('active');
					} else {
						timer.classList.remove('active');
					}
				});
			}
		});
	});

	timer_button.addEventListener('click', (e) => {
		e.preventDefault();

		if (!timerRunning) {
			var timer_span = null;

			timers.forEach((timer) => {
				if (timer.classList.contains('active')) {
					timer_span = timer;
				}
			});

			var duration;

			// use "time-left" if timer hasn't been reset
			if (timer_span.getAttribute('data-time-left') > 0) {
				duration = timer_span.getAttribute('data-time-left');
			} else {
				resetTimers();
				duration = timer_span.getAttribute('data-time') - 1;
			}

			startTimer(duration, timer_span);
		} else {
			pauseTimer();
		}
	});

	document.querySelector('.reset > a').addEventListener('click', (e) => {
		e.preventDefault();
		pauseTimer();
		resetTimers();
	});

	document.querySelectorAll('.what, .md-overlay, .close-modal').forEach((element) => {
		element.addEventListener('click', () => {
			document.querySelector('.what-modal').classList.toggle('md-show');
		});
	});

	document.querySelector('.test-audio').addEventListener('click', () => {
		ding();
	});

	function startTimer(duration, timer_span) {
		var timer = duration, minutes, seconds;

		activeTimer = setInterval(() => {
			minutes = parseInt(timer / 60, 10)
			seconds = parseInt(timer % 60, 10);

			seconds = seconds < 10 ? "0" + seconds : seconds;

			document.title = '' + minutes + ':' + seconds + ' - Pomodoro';
			timer_span.textContent = minutes + ':' + seconds;
			timer_span.setAttribute('data-time-left', timer);

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
		document.title = 'Pomodoro';

		timers.forEach((timer) => {
			timer.removeAttribute('data-time-left');
			timer.textContent = timer.getAttribute('data-orig');
		});

		window.clearInterval(activeTimer);

		timerStarted = false;
		timerRunning = false;

		showButton('start');
	}

	function showButton(toggleVal) {
		if (toggleVal === 'start') {
			const textStr = (timerStarted) ? 'resume timer' : 'start timer';
			timer_button.classList.remove('running');
			timer_button.textContent = textStr;
		} else if (toggleVal === 'pause') {
			timer_button.classList.add('running');
			timer_button.textContent = ('pause timer');
		}
	}

	function ding() {
		document.querySelectorAll('audio')[0].play();
	}
});