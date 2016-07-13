/**
 * Gulp 4 implementation
 **/

import gulp           from 'gulp';
import gulpBower      from 'gulp-bower';
import gulpRename     from 'gulp-rename';
import gulpSass       from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import path           from 'path';

const bowerDirectory = path.join('.', 'bower_components'),
      paths          = {
          'sass'   : {
              'src' : path.join('.', 'resources/assets/sass/app.scss'),
              'dest': path.join('.', 'public')
          },
          'js'     : {
              'src' : `${path.join('.', 'public/js')}/**/*.js`,
              'dest': path.join('.', 'public')
          },
          'vendors': {
              'js'  : {
                  'src' : [
                      path.join(bowerDirectory, 'bootstrap/dist/js/bootstrap.js'),
                      path.join(bowerDirectory, 'domReady/domReady.js'),
                      path.join(bowerDirectory, 'jquery/dist/jquery.js'),
                      path.join(bowerDirectory, 'lodash/dist/lodash.js'),
                      path.join(bowerDirectory, 'requirejs/require.js')
                  ],
                  'dest': path.join('.', 'public/js/vendors')
              },
              'sass': {
                  'src' : [
                      `${path.join(bowerDirectory, 'bootstrap/scss')}/**/*.scss`,
                      `!${path.join(bowerDirectory, 'bootstrap/scss/_variables.scss')}`
                  ],
                  'dest': path.join('.', 'resources/assets/sass/vendors')
              }
          }
      };

/* --------------------------------------------------------------------------
 * Vendors bower requirements
 * --------------------------------------------------------------------------
 */

/**
 * Download bower dependencies in bower_components directory
 *
 * @returns {*} Gulp callback
 */
export function bowerDownload () {
    // Had to add .pipe to sync => @see https://github.com/zont/gulp-bower/issues/42
    return gulpBower({'cmd': 'update'}).pipe(gulp.dest(bowerDirectory));
}

/**
 * Move js vendors files into public/js/vendor directory
 *
 * @returns {*} Gulp callback
 */
export function bowerMoveJs () {
    return gulp.src(paths.vendors.js.src).pipe(gulp.dest(paths.vendors.js.dest));
}

/**
 * Move sass vendors files into resources/assets/vendor directory
 *
 * @returns {*} Gulp callback
 */
export function bowerMoveSass () {
    return gulp.src(paths.vendors.sass.src).pipe(gulp.dest(paths.vendors.sass.dest));
}

/**
 * Wrapper for bowerDownload then bowerMoveJs and bowerMoveSass
 *
 * @returns {*} Gulp callback
 */
gulp.task('bower', gulp.series(bowerDownload, gulp.parallel(bowerMoveJs, bowerMoveSass)));

/* --------------------------------------------------------------------------
 * Sass
 * --------------------------------------------------------------------------
 */

/**
 * Compile sass files and generate map in .css result file
 *
 * @returns {*} Gulp callback
 */
export function sassDev () {
    return gulp.src(paths.sass.src, {'base': 'src'})
               .pipe(gulpSourcemaps.init())
               .pipe(gulpSass({'outputStyle': 'compressed'}).on('error', gulpSass.logError))
               .pipe(gulpSourcemaps.write())
               .pipe(gulpRename('style.css'))
               .pipe(gulp.dest(paths.sass.dest));
}

/**
 * Compile sass files in a .css file
 *
 * @returns {*} Gulp callback
 */
export function sassProd () {
    return gulp.src(paths.sass.src, {'base': 'src'})
               .pipe(gulpSass({'outputStyle': 'compressed'}).on('error', gulpSass.logError))
               .pipe(gulpRename('style.css'))
               .pipe(gulp.dest(paths.sass.dest));
}
