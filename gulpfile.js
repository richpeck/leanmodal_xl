var gulp   = require('gulp');
var coffee = require('gulp-coffee');
 
gulp.task('scripts', function () {
  gulp.src('src/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./'));
});
 
gulp.task('watch', function () {
  gulp.watch('src/*.coffee', ['scripts']);
});
 
gulp.task('default', ['scripts', 'watch']);