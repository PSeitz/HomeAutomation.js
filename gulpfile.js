var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var concat = require('gulp-concat');

gulp.task('less', function() {
	gulp.src('./public/css/style.less')
		.pipe(less())
		.pipe(gulp.dest('./public/css/'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('./public/css/style.less', ['less']);
});


// Rerun the task when a file changes
gulp.task('build',  ['buildjs', 'buildjs_settings', 'buildcss']);

var DEST = 'public/build/';
gulp.task('buildjs', function() {
	gulp.src([
	'./public/js/jquery-2.1.1.min.js',
	'./public/js/fastclick.min.js',
	'./public/bootstrap/js/bootstrap.min.js',
	'./public/js/main.js'
	])
	.pipe(concat('all.js'))
	.pipe(gulp.dest(DEST));
});

gulp.task('buildjs_settings', function() {
	gulp.src([
	'./public/js/jquery-ui.min.js',
	'./public/js/jquery.ui.touch-punch.min.js',
	'./public/js/bootstrap-switch.js',
	'./public/js/settings.js'
	])
	.pipe(concat('all_settings.js'))
	.pipe(gulp.dest(DEST));
});


gulp.task('buildcss', function() {
	gulp.src([
	'./public/bootstrap/css/bootstrap.min.css',
	'./public/css/style.css'
])
	.pipe(concat('all.css'))
	.pipe(gulp.dest(DEST));
});