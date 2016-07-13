/**
 * Gulp 4 implementation
 **/

'use strict';

import gulp from 'gulp';
import gulpBower from 'gulp-bower';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpRename from 'gulp-rename';

const bowerDirectory = __dirname + '/bower_components';
const paths = {
    sass: {
        src: __dirname + '/resources/assets/sass/app.scss',
        dest: __dirname + '/public'
    },
    js: {
        src: __dirname + '/public/js/**/*.js',
        dest: __dirname + '/public'
    },
    vendors: {
        js: {
            src: [
                bowerDirectory + '/bootstrap/dist/js/bootstrap.js',
                bowerDirectory + '/domReady/domReady.js',
                bowerDirectory + '/jquery/dist/jquery.js',
                bowerDirectory + '/lodash/dist/lodash.js',
                bowerDirectory + '/requirejs/require.js',
            ],
            dest: __dirname + '/public/js/vendors'
        },
        sass: {
            src: [
                bowerDirectory + '/bootstrap/scss/**/*.scss',
                '!' + bowerDirectory + '/bootstrap/scss/_variables.scss'
            ],
            dest: __dirname + '/resources/assets/sass/vendors'
        }
    }
};

/*
 *--------------------------------------------------------------------------
 * Vendors bower requirements
 *--------------------------------------------------------------------------
 */

export function bowerInstall() {
    // Had to add .pipe to sync => @see https://github.com/zont/gulp-bower/issues/42
    return gulpBower({cmd: 'update'}).pipe(gulp.dest(bowerDirectory));
}

export function bowerMoveJs() {
    return gulp.src(paths.vendors.js.src).pipe(gulp.dest(paths.vendors.js.dest));
}

export function bowerMoveSass() {
    return gulp.src(paths.vendors.sass.src).pipe(gulp.dest(paths.vendors.sass.dest));
}

const bower = gulp.series(bowerInstall, gulp.parallel(bowerMoveJs, bowerMoveSass));

export {bower};

/*
 *--------------------------------------------------------------------------
 * Sass
 *--------------------------------------------------------------------------
 */

export function sassDev() {
    return gulp.src(paths.sass.src, { base: 'src' })
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass({outputStyle: 'compressed'}).on('error', gulpSass.logError))
        .pipe(gulpSourcemaps.write())
        .pipe(gulpRename('style.css'))
        .pipe(gulp.dest(paths.sass.dest));
}

export function sassProd() {
    return gulp.src(paths.sass.src, { base: 'src' })
        .pipe(gulpSass({outputStyle: 'compressed'}).on('error', gulpSass.logError))
        .pipe(gulpRename('style.css'))
        .pipe(gulp.dest(paths.sass.dest));
}
