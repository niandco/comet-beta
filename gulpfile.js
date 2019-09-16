'use strict';

const { src, dest, watch } = require( 'gulp' );
const _sass = require( 'gulp-sass' );
const _webpack = require('webpack-stream');
const _csslint = require( 'gulp-csslint' );
const _eslint = require( 'gulp-eslint' );
const _named = require('vinyl-named');

function cssLint(){
    return src( [ 'src/css/*.css' ] )
    .pipe( _csslint())
    .pipe( _csslint.formatter());
    
}

function cssCompile(){
    return src( ['src/css/admin/admin.scss', 'src/css/editor/editor.scss', 'src/css/utils/view.scss' ], { sourcemaps: true })
    .pipe( _sass.sync( { outputStyle: 'compressed' } ).on( 'error', _sass.logError ) )
    .pipe( dest( 'src/css/' ), { sourcemaps: '.' } );

}

function cssWatch(){
    watch( 'src/css/**/*.scss', { ignoreInitial: false }, cssCompile );

}

function jsLint(){

    return src( [ 'src/js/**/*.js', '!src/js/*js', '!src/js/utils/viewport.js', '!src/js/utils/ui/viewport.js', '!src/js/utils/book.js' ] )
    .pipe( _eslint({
        'env': {
            'browser': true,
        },
        'parserOptions': {
            'ecmaVersion': 6,
            'sourceType': 'module',
            'ecmaFeatures': {
                'jsx': true
            }
        },
        'rules': {
            'eqeqeq': 'warn',
            'vars-on-top': 'error',
            'quotes': [ 'warn', 'single' ],
            'semi': [ 'error', 'always'],
            'no-extra-semi': 'error',
            'semi-spacing': 'warn',
            'strict': 'warn',
            'no-use-before-define': 'off',
            'no-console': 'warn',
            'no-new-func': 'warn',
            'no-new-wrappers': 'error',
            'no-func-assign': 'error',
            'no-shadow': [ 'error', { 'builtinGlobals': true, 'hoist': 'all' } ],
            'no-useless-escape': 'error',
            'no-useless-return': 'error',
            'yoda': 'error',
            'no-new-object': 'error',
            'no-invalid-regexp': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty': 'error',
            'no-invalid-regexp': 'error',
            'no-empty-function': 'error',
            'no-fallthrough': 'error',
            'no-redeclare': 'error',
            'no-delete-var': 'error',
            'no-label-var': 'error',
            'no-undef': 'error',
            'no-unused-vars': 'error',
            'no-self-assign': 'error',
            'no-octal': 'error',
            'valid-typeof': [ 'error', { 'requireStringLiterals': true } ],
            'no-unreachable': 'error',
            'no-unexpected-multiline': 'error',
            'no-sparse-arrays': 'error',
            'no-regex-spaces': 'error',
            'no-control-regex': 'error',
            'no-obj-calls': 'error',
            'no-inner-declarations': 'warn',
        }
    }))
    .pipe( _eslint.format())
    //.pipe(eslint.failOnError());

}

function jsCompile(){
    return src( [ 'src/js/editor/editor.js', 'src/js/utils/view.js', 'src/js/admin/admin.js' ] )
    .pipe( _named() )
    .pipe( _webpack( {
        //watch: true,
        target: 'web',
        mode: 'production',/*'development',*/
        devtool: 'source-map',
    } ) )
    .pipe( dest( 'src/js/' ) );

}

function jsWatch(){
    watch( 'src/js/**/*.js', { ignoreInitial: false }, jsCompile );

}

module.exports = {
    css: cssWatch,
    js: jsWatch,
    lcss: cssLint,
    ljs: jsLint

};
