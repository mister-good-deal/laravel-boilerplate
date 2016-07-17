({
    'name'                      : 'app.config.js',
    'mainConfigFile'            : 'app.config.js',
    'out'                       : '../dist/app.js',
    'optimize'                  : 'uglify2',
    'preserveLicenseComments'   : false,
    'generateSourceMaps'        : true,
    'optimizeAllPluginResources': true,
    'findNestedDependencies'    : true,
    'wrap'                      : true,
    'include'                   : ['vendors/require.js']
});
