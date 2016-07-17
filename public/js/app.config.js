requirejs.config(
    {
        'paths' : {
            'require'  : 'vendors/require',
            'domReady' : 'vendors/domReady',
            'es6'      : 'vendors/requirejs-babel/es6',
            'babel'    : 'vendors/requirejs-babel/babel-5.8.34.min',
            'bootstrap': 'vendors/bootstrap',
            'jquery'   : 'vendors/jquery',
            'lodash'   : 'vendors/lodash'
        },
        'shim'  : {
            'bootstrap': {
                'deps': ['jquery']
            }
        },
        'config': {
            'urlArgs': 'bust=' + (new Date()).getTime()
        }
    }
);

requirejs(['app']);
