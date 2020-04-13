// npm install browser-sync gulp gulp-autoprefixer gulp-eslint gulp-sass gulp-watch gulp-concat @babel/core babel gulp-babel @babel/preset-env @babel/polyfill gulp-uglify gulp-phplint --save-dev

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    phplint = require('gulp-phplint');


gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: 'pomodoro.local'
	});

	gulp.watch('./src/css/*.scss', gulp.series('css'));
	gulp.watch('./src/js/*.js', gulp.series('js'));
	gulp.watch('./src/**/*.php', gulp.series('php'));
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
      .pipe(gulp.dest('./dist/css/'))
      .pipe(browserSync.stream());
});


gulp.task('js', function() {
  return gulp.src('./src/js/*.js')
     /* .pipe(sourcemaps.init())*/
      .pipe(babel())
      .on('error', function(e) {
          console.log(e)
          this.emit('end')
      })
      .pipe(eslint({baseConfig: {extends: 'eslint:recommended'}}))
      .pipe(eslint.format())
      .on('error', function(e) {
          console.log(e)
          this.emit('end')
      })
      .pipe(concat('pomodoro.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./dist/js/'))
      .pipe(browserSync.stream());
});


gulp.task('lint', function() {
  return gulp.src('./src/js/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});


gulp.task('phplint', function() {
  return gulp.src(['./src/includes/*.php'])
    .pipe(phplint());
});


gulp.task('php', gulp.series('phplint', function() {
  return gulp.src('./src/includes/*.php')
    .pipe(concat('functions.php'))
    .pipe(gulp.dest('./dist/includes/'));
}));


gulp.task('images', function() {
  gulp.src('./dist/images/**/')
  .pipe(imagemin([
    mozjpeg({ quality: '85' }),
    pngquant({ quality: '100' })
  ]))
  .pipe(gulp.dest('./dist/images-compressed'));
});


gulp.task('default', gulp.series('browser-sync'));