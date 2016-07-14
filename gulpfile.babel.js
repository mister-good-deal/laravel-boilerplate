/**
 * Gulp 4 implementation using es6
 **/

import childProcess     from 'child_process';
import gulp             from 'gulp';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpBower        from 'gulp-bower';
import gulpEslint       from 'gulp-eslint';
import gulpRename       from 'gulp-rename';
import gulpSass         from 'gulp-sass';
import gulpSourcemaps   from 'gulp-sourcemaps';
import map              from 'lodash/map';
import path             from 'path';

const bowerDirectory = 'bower_components',
      paths          = {
          'sass'   : {
              'src' : 'resources/assets/sass/app.scss',
              'dest': 'public'
          },
          'js'     : {
              'src' : [
                  'public/js/**/*.js',
                  '!public/js/vendors/**',
                  'gulpfile.babel.js'
              ],
              'dest': 'public'
          },
          'vendors': {
              'js'   : [
                  {
                      'src' : path.join(bowerDirectory, 'bootstrap/dist/js/bootstrap.js'),
                      'dest': 'public/js/vendors'
                  },
                  {
                      'src' : path.join(bowerDirectory, 'domReady/domReady.js'),
                      'dest': 'public/js/vendors'
                  },
                  {
                      'src' : path.join(bowerDirectory, 'jquery/dist/jquery.js'),
                      'dest': 'public/js/vendors'
                  },
                  {
                      'src' : path.join(bowerDirectory, 'lodash/dist/lodash.js'),
                      'dest': 'public/js/vendors'
                  },
                  {
                      'src' : path.join(bowerDirectory, 'requirejs/require.js'),
                      'dest': 'public/js/vendors'
                  }
              ],
              'sass' : [
                  {
                      'src' : [
                          `${path.join(bowerDirectory, 'bootstrap/scss')}/**/*.scss`,
                          `!${path.join(bowerDirectory, 'bootstrap/scss/_variables.scss')}`
                      ],
                      'dest': 'resources/assets/sass/vendors/bootstrap'
                  },
                  {
                      'src' : `${path.join(bowerDirectory, 'font-awesome/scss')}/**/*.scss`,
                      'dest': 'resources/assets/sass/vendors/font-awesome'
                  }
              ],
              'fonts': [
                  {
                      'src' : path.join(bowerDirectory, 'font-awesome/fonts/**'),
                      'dest': 'resources/assets/fonts'
                  }
              ]
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
 * @param {Function} done Callback to sync
 * @returns {*} Gulp callback
 */
export function bowerMoveJs (done) {
    map(paths.vendors.js, (vendor) => gulp.src(vendor.src).pipe(gulp.dest(vendor.dest)));

    return done();
}

/**
 * Move sass vendors files into resources/assets/vendor directory
 *
 * @param {Function} done Callback to sync
 * @returns {*} Gulp callback
 */
export function bowerMoveSass (done) {
    map(paths.vendors.sass, (vendor) => gulp.src(vendor.src).pipe(gulp.dest(vendor.dest)));

    return done();
}

/**
 * Move fonts vendors files into resources/assets/fonts directory
 *
 * @param {Function} done Callback to sync
 * @returns {*} Gulp callback
 */
export function bowerMoveFonts (done) {
    map(paths.vendors.fonts, (vendor) => gulp.src(vendor.src).pipe(gulp.dest(vendor.dest)));

    return done();
}

/**
 * Wrapper for bowerDownload then bowerMoveJs and bowerMoveSass
 *
 * @returns {*} Gulp callback
 */
gulp.task('bower', gulp.series(bowerDownload, gulp.parallel(bowerMoveJs, bowerMoveSass, bowerMoveFonts)));

/* --------------------------------------------------------------------------
 * Sass / js build
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
               .pipe(gulpAutoprefixer())
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
               .pipe(gulpAutoprefixer())
               .pipe(gulpRename('style.css'))
               .pipe(gulp.dest(paths.sass.dest));
}

/**
 * Compile and optimize js sources in one file app.js using requireJs
 *
 * @param {Function} done Callback to sync
 * @returns {*} Gulp callback
 */
export function jsBuild (done) {
    console.log(childProcess.execSync(
        'cd ./public&node ../node_modules/requirejs/bin/r.js -o app.build.js',
        {'cwd': __dirname}
    ).toString());

    return done();
}

/* --------------------------------------------------------------------------
 * Linter
 * --------------------------------------------------------------------------
 */

/**
 * Lint js files with eslint linter
 *
 * @returns {*} Gulp callback
 */
export function eslint () {
    return gulp.src(paths.js.src)
               .pipe(gulpEslint())
               .pipe(gulpEslint.format())
               .pipe(gulpEslint.failAfterError());
}

/* --------------------------------------------------------------------------
 * jsDoc
 * --------------------------------------------------------------------------
 */


