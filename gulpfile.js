var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var del = require('del');
var runSequence = require('run-sequence')
var imagemin = require('gulp-imagemin');
var uglifyjs = require('uglify-js');
var uglify = require('gulp-uglify');
var minifier = require('gulp-uglify/minifier');
var pump = require('pump');
var babel = require('gulp-babel');
var partial = require('gulp-inject-partials'); 
var prompt = require('gulp-prompt');
var resize = require('gulp-image-resize');
var _ = require('lodash');
var jade = require('jade');
var wrap = require('gulp-wrap');
var plumber = require('plumber');
var rename = require('gulp-rename');
var fs = require('fs');
var md = require('gulp-markdown-to-json');
var marked = require('marked');
var ga = require('gulp-ga');
var stamp = require('gulp-credit-stamp');
var $ = require('jquery');
var imgStamp = require('gulp-image-stamp');
var zip = require('gulp-zip');
var moment = require('moment');


//-------- Options ------------------

var config = {
  templates: 'src/templates/',
  dist: './dist/',
  css: './node_modules/bootstrap/dist/css/bootstrap.css',
  password: '123'
}

var gaOptions = {
  url: 'localhost',
  uid:'UID'
};


marked.setOptions({
  pedantic: true,
  smartypants: true
});

//-------- Tasks --------------------

gulp.task('build-images', () => {
    gulp.src('src/images/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('compile', () => {
 return gulp.src('src/*.html')
    .pipe(partial())
    .pipe(gulp.dest('dist')); 
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/js/*.js'),
        babel({ presets:['es2015']}),
        uglify(),
        gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task('backup', () => {
  return gulp.src('./dist/**')
      .pipe(zip('backup_'+moment().format('MMMM_Do_YYYY_h_mm_ss') +'.zip'))
      .pipe(gulp.dest('./backups'));
});

gulp.task('clean', () => {     
  return del([config.dist]);
});

gulp.task('build-posts', () => {
  return gulp.src('src/content/*.md')
        .pipe(md(marked))
        .pipe(wrap(function(data) {
          var template = config.templates + data.contents.template;
          return fs.readFileSync(template).toString();
        }, {}, {engine: 'jade'}))
        .pipe(rename({extname:'.html'}))
        .pipe(partial()) //Include template parts
        .pipe(ga(gaOptions))
        .pipe(stamp())
        .pipe(gulp.dest(config.dist+'content'));
});

gulp.task('build-css', () => {
  return gulp.src(config.css)
    .pipe(gulp.dest(config.dist+'css'));
})

gulp.task('build-js')

gulp.task('deploy', () => {

  return gulp.src('')
  .pipe(prompt.prompt({
        type: 'password',
        name: 'pass',
        message: 'Please enter your password'
    }, function(res){
        if(res.pass === config.password) {
          console.log('Password OK - starting deployment');
          runSequence('backup','clean','build-images','build-css','build-posts');
        }
        else {
          console.log('Incorrect password - aborting deployment.');
        }
    }));
});