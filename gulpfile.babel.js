/**
 * Gulp 4 implementation using es6
 **/

import childProcess     from 'child_process';
import del              from 'del';
import gulp             from 'gulp';
import gulpAutoprefixer from 'gulp-autoprefixer';
import gulpBabel        from 'gulp-babel';
import gulpBower        from 'gulp-bower';
import gulpConcat       from 'gulp-concat';
import gulpEslint       from 'gulp-eslint';
import gulpRename       from 'gulp-rename';
import gulpSass         from 'gulp-sass';
import gulpSourcemaps   from 'gulp-sourcemaps';
import gulpUglify       from 'gulp-uglify';
import map              from 'lodash/map';
import path             from 'path';
import pump             from 'pump';

const bowerDirectory = 'bower_components',
      paths          = {
          'sass'   : {
              'src' : 'resources/assets/sass/app.scss',
              'dest': 'public/dist'
          },
          'js'     : {
              'src' : [
                  'public/js/**/*.js',
                  '!public/js/vendors/**'
              ],
              'dest': 'public/dist'
          },
          'vendors': {
              'js'   : [
                  {
                      'src' : path.join(bowerDirectory, 'bootstrap/dist/js/bootstrap.js'),
                      'dest': 'public/js/vendors'
                  },
                  {
                      'src' : path.join(bowerDirectory, 'jquery/dist/jquery.js'),
                      'dest': 'public/js/vendors'
                  },
                  {
                      'src' : path.join(bowerDirectory, 'lodash/dist/lodash.js'),
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
 * Clean bower dependencies in js, fonts and sass source files (not in bower_components)
 *
 * @returns {*} Gulp callback
 */
export function bowerClean () {
    return del(
        [
            'public/js/vendors',
            'resources/assets/fonts',
            'resources/assets/sass/vendors/**',
            '!resources/assets/sass/vendors',
            '!resources/assets/sass/vendors/bootstrap',
            '!resources/assets/sass/vendors/bootstrap/_variables.scss'
        ]
    );
}

/**
 * Wrapper for bowerDownload then bowerClean then bowerMoveJs, bowerMoveSass and bowerMoveFonts
 *
 * @returns {*} Gulp callback
 */
gulp.task(
    'bower',
    gulp.series(
        bowerDownload,
        gulp.series(bowerClean, gulp.parallel(bowerMoveJs, bowerMoveSass, bowerMoveFonts))
    )
);

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
 * Transpile all js srource files from es6 to es5 using babel and concat them into public/dist/app.js file
 *
 * @returns {*} Gulp callback
 */
export function babelTranspile () {
    return gulp.src(paths.js.src)
               .pipe(gulpSourcemaps.init())
               .pipe(gulpBabel({'presets': ['es2015']}))
               .pipe(gulpConcat('app.js'))
               .pipe(gulpSourcemaps.write('.'))
               .pipe(gulp.dest(paths.js.dest));
}

/**
 * Uglify public/dist/app.js using UglifyJS lib
 *
 * @param {Function} done Callback to sync
 * @returns {*} Gulp callback
 */
export function uglify (done) {
    pump(
        [
            gulp.src(path.join(paths.js.dest, 'app.js')),
            gulpUglify(),
            gulp.dest(paths.js.dest)
        ],
        done
    );
}

/**
 * Wrapper for generating public/dist/app.js using babelTranspile then uglify
 *
 * @returns {*} Gulp callback
 */
gulp.task('buildJs', gulp.series(babelTranspile, uglify));

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

/**
 * Generate the jsdoc in storage/app/public/jsDoc
 *
 * @todo check where to put the documentation based on laravel architecture (storage/app/public/jsDoc)
 *
 * @param {Function} done Callback to sync
 * @returns {*} Gulp callback
 */
export function jsdoc (done) {
    childProcess.exec(
        '"./node_modules/.bin/jsdoc"' +
        ' -c jsdocConfig.json' +
        ' -r -t ./node_modules/ink-docstrap/template --verbose', (err, output) => {
            console.log(output);
            done(err);
        }
    );
}
