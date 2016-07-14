requirejs.config(
    {
        'paths' : {
            'bootstrap': 'js/vendors/bootstrap',
            'domReady' : 'js/vendors/domReady',
            'jquery'   : 'js/vendors/jquery',
            'lodash'   : 'js/vendors/lodash',
            'require'  : 'js/vendors/require'
        },
        'shim'  : {
            'bootstrap': {
                'deps': ['jquery']
            }
        },
        'config': {
            'urlArgs': `bust=${(new Date()).getTime()}`
        }
    }
);

requirejs(['main']);
