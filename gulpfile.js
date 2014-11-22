var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');


gulp.task('less', function() {
	gulp.src('./public/css/style.less')
		.pipe(less())
		.pipe(gulp.dest('./public/css/'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('./public/css/style.less', ['less']);
	
});

