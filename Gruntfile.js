module.exports = function(grunt) {

    "use strict";

    var docroot= '',
        js_source = docroot+'src/',
        js_dev = docroot+'dev/',
        js_dist = docroot+'js/',
        jekyll_dist = docroot+'webroot/';

  // Project configuration.
  grunt.initConfig({
        pkg: grunt.file.readJSON(docroot+'package.json'),
        concat: {
            sequential:{
                options: {
                    banner: '(function($,w){',
                    footer: '}(jQuery,window));',
                    stripBanners: true
                },
                files: [{
                    src: [js_source +'bsd-cd-controller.js',
                          js_source +'jquery.quickDonate.js',
                          js_source +'jquery.detectCCType.js',
                          js_source +'jquery.bluecontribute.js',
                          js_source +'sequential.js',
                          js_source +'default-custom-behavior.js'],
                    dest: js_dev +'sequential-donate.js'
                }]
            },
            'donate-only':{
                options: {
                    banner: '(function($,w){',
                    footer: '}(jQuery,window));',
                    stripBanners: true
                },
                files: [{
                    src: [js_source +'bsd-cd-controller.js',
                          js_source +'jquery.quickDonate.js',
                          js_source +'jquery.detectCCType.js',
                          js_source +'jquery.bluecontribute.js',
                          js_source +'default-custom-behavior.js'],
                    dest: js_dev +'sequential-donate.js'
                }]
            }
        },
        jshint: {
            client: {
                options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: false,
                    bQuery: false,
                    gup: false,
                    Backbone: false,
                    Handlebars: false,
                    c: false,
                    report: false,
                    _gaq: false,
                    geoip: false,
                    google: false,
                    console: false,
                    FB: false,
                    twttr: false,
                    Modernizr: false,
                    yepnope: false,
                    SC: false,
                    user:false,
                    _: false
                }
            },
            src: [js_dev + '/sequential-donate.js']
            }
        },
        uglify: {
            main: {
                options: {
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */',
                    preserveComments: false
                },
                files: [{
                    src: [js_dev + 'sequential-donate.js'],
                    dest: js_dist + 'sequential-donate.js'
                }]
            },
            poly: {
                options: {
                    warnings: true,
                    preserveComments: false
                },
                files: [{
                    expand: true,
                    src: '*.js',
                    cwd: js_source + 'polyfills',
                    dest: js_dist + 'polyfills',
                    rename: function(dest, src){
                        return js_dist + 'polyfills/'+ src.replace(js_source,'');
                    }
                }]
            },
            extras: {
                options: {
                    warnings: true,
                    preserveComments: false
                },
                files: [{
                    expand: true,
                    src: '*.js',
                    cwd: js_source + 'extras',
                    dest: js_dist + 'extras',
                    rename: function(dest, src){
                        return js_dist + 'extras/'+ src.replace(js_source,'');
                    }
                }]
            }
        },
        sass: {//add production version later
            dev:{
                options: {
                    style: 'comrpessed',
                    compass: 1
                },
                files: [{
                    expand: true,
                    cwd: jekyll_dist + 'scss',
                    src: '**/bsdcd-styles*.scss',
                    dest: jekyll_dist + 'page/-/donatetest',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options:{
                livereload: true,
                spawn: false
            },
            js: {
                options:{
                    livereload: false
                },
                files: [js_source +'*.js'],
                tasks: [
                    'concat:sequential',
                    'uglify:main',
                    'copy'
                ]
            },
            sass:{
                options:{
                    livereload: true
                },
                files: [jekyll_dist +'scss/**/*.js'],
                tasks: [
                    'sass:dev'
                ]
            }
        },
        copy : {
            files: [
                {
                    expand: true,
                    dest: jekyll_dist + '/js/',
                    src: js_dist + '**'
                }
            ]
        }
  });

    require('load-grunt-tasks')(grunt);

/*
    var changedFiles = Object.create(null);
    var onChange = grunt.util._.debounce(function() {
      grunt.config('jshint.all.src', Object.keys(changedFiles));
      changedFiles = Object.create(null);
    }, 200);

    grunt.event.on('watch', function(action, filepath) {
      changedFiles[filepath] = action;
      onChange();
    });
*/
  // Default task(s).
    grunt.registerTask('default', [
        'concat:sequential',
        'jshint',
        'uglify:main',
        'copy'
    ]);

    grunt.registerTask('sass', [
        'sass:dev'
    ]);

    grunt.registerTask('polyandextras', [
        'uglify:poly',
        'uglify:extras',
        'copy'
    ]);

};