require.config(
    {
        'paths' : {
            'require'  : 'vendors/require',
            'domReady' : 'vendors/domReady',
            'es6'      : 'vendors/requirejs-babel/es6',
            'babel'    : 'vendors/requirejs-babel/babel-5.8.34.min',
            'bootstrap': 'vendors/bootstrap',
            'tether'   : 'vendors/tether',
            'jquery'   : 'vendors/jquery',
            'lodash'   : 'vendors/lodash'
        },
        'shim'  : {
            'bootstrap': {
                'deps': ['jquery', 'tether']
            }
        },
        'config': {
            'urlArgs': 'bust=' + (new Date()).getTime()
        }
    }
);

require(['app']);
