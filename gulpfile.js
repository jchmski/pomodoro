var gulp = require('gulp'),
browserSync = require('browser-sync'),
sass = require('gulp-sass'),
inject = require('gulp-inline-code'),
htmlmin = require('gulp-htmlmin'),
babel = require('gulp-babel'),
eslint = require('gulp-eslint'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: 'pomodoro.local',
		open: false
	});

	gulp.watch('./src/index.html', gulp.series('copy', 'bundle'));
	gulp.watch('./src/css/*.scss', gulp.series('copy', 'css', 'bundle'));
	gulp.watch('./src/js/*.js', gulp.series('copy', 'js', 'bundle'));
});

gulp.task('copy', function() {
	return gulp.src('./src/index.html')
	.pipe(gulp.dest('./src/packaged/'))
});

gulp.task('css', function() {
  return gulp.src('./src/css/*.scss')
      .pipe(concat('styles.css'))
      .pipe(autoprefixer())
      .on('error', function(e) {
          console.log(e)
          this.emit('end')
      })
      .pipe(sass({ outputStyle: 'compressed' }))
      .on('error', function(e) {
          console.log(e)
          this.emit('end')
      })
      .pipe(gulp.dest('./src/packaged/css/'))
      .pipe(browserSync.stream());
});

gulp.task('js', function () {
	return gulp.src('./src/js/*.js')
		.pipe(babel())
		.on('error', function (e) {
			console.log(e)
			this.emit('end')
		})
		.pipe(eslint({ baseConfig: { extends: 'eslint:recommended' } }))
		.pipe(eslint.format())
		.on('error', function (e) {
			console.log(e)
			this.emit('end')
		})
		.pipe(concat('pomodoro.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./src/packaged/js/'))
		.pipe(browserSync.stream());
});

gulp.task('inline-css', function() {
	return gulp.src('./src/packaged/index.html')
		.pipe(inject({
			type: 'css',
			path: './src/packaged/css/styles.css'
		}))
		.pipe(gulp.dest('./src/packaged/'))
		.pipe(browserSync.stream());
});

gulp.task('inline-js', function () {
	return gulp.src('./src/packaged/index.html')
		.pipe(inject({
			type: 'js',
			path: './src/packaged/js/pomodoro.js'
		}))
		.pipe(gulp.dest('./src/packaged/'))
		.pipe(browserSync.stream());
});

gulp.task('htmlmin', function () {
	return gulp.src('./src/packaged/index.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('./dist/'))
		.pipe(browserSync.stream());
});

gulp.task('default', gulp.series('browser-sync'));
gulp.task('bundle', gulp.series('inline-css', 'inline-js', 'htmlmin'));
gulp.task('build', gulp.series('copy', 'inline-css', 'inline-js', 'htmlmin'));