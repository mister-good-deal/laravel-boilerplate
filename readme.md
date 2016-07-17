# Laravel PHP Framework - front stack integration

[![Build Status](https://travis-ci.org/laravel/framework.svg)](https://travis-ci.org/laravel/framework)
[![Total Downloads](https://poser.pugx.org/laravel/framework/d/total.svg)](https://packagist.org/packages/laravel/framework)
[![Latest Stable Version](https://poser.pugx.org/laravel/framework/v/stable.svg)](https://packagist.org/packages/laravel/framework)
[![Latest Unstable Version](https://poser.pugx.org/laravel/framework/v/unstable.svg)](https://packagist.org/packages/laravel/framework)
[![License](https://poser.pugx.org/laravel/framework/license.svg)](https://packagist.org/packages/laravel/framework)

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Laravel attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as authentication, routing, sessions, queueing, and caching.

Laravel is accessible, yet powerful, providing tools needed for large, robust applications. A superb inversion of control container, expressive migration system, and tightly integrated unit testing support give you the tools you need to build any application with which you are tasked.

## Official Documentation

Documentation for the framework can be found on the [Laravel website](http://laravel.com/docs).

## Getting start

This project is based on the Laravel5 framework. The boilerplate which was added to the initial laravel structure is composed by several front usefull tools listed below.
- [gulp](https://github.com/gulpjs/gulp/tree/4.0) (version 4)
- [bower](https://bower.io/)
- [es6](http://es6-features.org) (with [babel](https://babeljs.io/) transpiler)
- [requirejs](http://requirejs.org/)
- [sass](http://sass-lang.com/) full integration with vendors dynamic dependecies
- [bootstrap 4](http://v4-alpha.getbootstrap.com/) (sass integrated)
- [font Awesome](http://fontawesome.io/) (sass integrated)
- [eslint](http://eslint.org/)
- [jsdoc](http://usejsdoc.org/)

To add a library, add it into `bower.json` file and into `public/js/app.config.js => paths`.

Then set js / sass / fonts required files for your new external lib into `paths` const declaration L.24 in `gulp.babel.js`

Then run `gulp bower` and voilà, your lib is ready to be used !

All js vendors files are imported in `public/js/vendors` directory.

All scss vendors files are imported in `resources/assets/sass/vendors` directory.

All fonts vendors files are imported in `resources/assets/fonts` directory.

*Note: To use an es6 module, add `es6!your-es6-module` in your require|define call*

### Gulp integration

Gulp is used to automatize tasks, using nodeJs to process files.

Laravel uses a tool called [elixir](https://laravel.com/docs/5.2/elixir) which is basically a wrapper for gulp to quickly process basic tasks.

I decided to overwrite this tool and using directly a pure gulp 4 implementation with a nice es6 syntax while elixir is based on gulp 3.

Gulp tasks:

- Vendors bower requirements
    - **bowerDownload** *(Download bower dependencies in bower_components directory)*
    - **bowerMoveJs** *(Move js vendors files into public/js/vendor directory)*
    - **bowerMoveSass** *(Move sass vendors files into resources/assets/vendor directory)*
    - **bowerMoveFonts** *(Move fonts vendors files into resources/assets/fonts directory)*
    - **bowerClean** *(Clean bower dependencies in js, fonts and sass source files (not in bower_components))*
    - **bower** *(Wrapper for bowerDownload then bowerClean then bowerMoveJs, bowerMoveSass and bowerMoveFonts)*
- Sass / js build
    - **sassDev** *(Compile sass files and generate map in .css result file)*
    - **sassProd** *(Compile sass files in a .css file)*
    - **buildJs** *(Build the js source files into public/dist/app.js using requirejs and the requirejs optimizer)*
- Linter
    - **eslint** *(Lint js files with eslint linter)*
- jsDoc
    - **jsdoc** *(Generate the jsdoc in storage/app/public/jsDoc)*
    
All dependencies must be listed in `paths` const declaration L.24.

### Sass

The sass integration is pretty simple here. A main `resources/assets/sass/app.scss` is used to required all sass dependencies.

This file is compiled using sass pre-processor and generate a unique `public/dist/style.css` file for all you app with the command `gulp sassDev` or `gulp sassProd` (without sources map).

You can add as much custom .scss files as you want in `resources/assets/sass` directory, be sure to add those files in the main `resources/assets/sass/app.scss` file.

### Eslint

Natively `eslint:all` is set in the `.eslintrc.json` file which can be edited to add / remove js lint rules.

### Jsdoc

The jsdoc is automaticaly generated in `storage/app/public/jsDoc` directory with the commande `gulp jsdoc`.

[ink-docstrap](https://github.com/docstrap/docstrap) theme is used to generate the documentation.

Jsdoc parameters can be edited in `jsdocConfig.json` file.
