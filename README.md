# Pomodoro
Tomato-based time management!

https://pomodoro.rocks

## What is Pomodoro?
Pomodoro is a technique used for time management. It's based on the idea that splitting up work with small breaks can reduce mental fatigue and improve overall productivity.

### The Pomodoro Flow
1. Work on a task for 25 minutes
2. Take a short, 5 minute break
3. Repeat
4. On every 4th cycle, take a longer, 10 minute break

Audio file is courtesy of [Andrew](http://www.orangefreesounds.com/desk-bell-sound/)

## Site Performance
This site is fast! There is a small amount of CSS and javascript which are inlined in the `index.html` file in order to avoid extra roundtrips to download the resources.

I re-worked a gulp plugin [gulp-inline-code](https://github.com/jchmski/gulp-inline-code) — forked from [gulp-style-inject](https://github.com/vladfilipro/gulp-style-inject) — which automatically inlines the CSS and JS, then `gulp-htmlmin` goes to work to minify the final html file for maximum size savings. And with Netlify's lightning quick network, you can't go wrong!

![web.dev test](https://res.cloudinary.com/jchmski/image/upload/v1587697642/Github/Pomodoro/Annotation_2020-04-23_230712_odcspu.jpg)
