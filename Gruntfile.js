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
            'sequential':{
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
                          js_source +'jquery.sequential.js',
                          js_source +'default-custom-behavior.js'],
                    dest: js_dev +'bsd-sequential-donate.js'
                }]
            },
            'quick-donate':{
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
                    dest: js_dev +'bsd-quick-donate.js'
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
                          js_source +'jquery.detectCCType.js',
                          js_source +'jquery.bluecontribute.js',
                          js_source +'default-custom-behavior.js'],
                    dest: js_dev +'bsd-donate-only.js'
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
            src: [
                    js_dev + '/bsd-sequential-donate.js',
                    js_dev + '/bsd-quick-donate.js',
                    js_dev + '/bsd-donate-only.js'
                ]
            }
        },
        uglify: {
            main: {
                options: {
                    banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */',
                    preserveComments: false
                },
                files: [{
                    src: [js_dev + 'bsd-sequential-donate.js'],
                    dest: js_dist + 'bsd-sequential-donate.js'
                },{
                    src: [js_dev + 'bsd-quick-donate.js'],
                    dest: js_dist + 'bsd-quick-donate.js'
                },{
                    src: [js_dev + 'bsd-donate-only.js'],
                    dest: js_dist + 'bsd-donate-only.js'
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
                    style: 'compressed',
                    compass: 1
                },
                files: [{
                    expand: true,
                    cwd: jekyll_dist + 'scss',
                    src: '**/bsdcd-styles*.scss',
                    dest: jekyll_dist + 'page/-/donate',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options:{
                livereload: true
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
            buildsass:{
                options:{
                    livereload: false
                },
                files: [jekyll_dist +'scss/**/*.scss'],
                tasks: [
                    'sass:dev'
                ]
            },
            css: {
                options:{
                    livereload: true
                },
                files: [jekyll_dist + '_site/page/-/donate/**/*.css'],
                tasks: []
            }
        },
        exec: {
            jbuild: {
                cwd: jekyll_dist,
                cmd: 'jekyll build'

            },
            jserve: {
                cwd: jekyll_dist,
                cmd: 'jekyll serve --watch --detach',
                callback: function(){
                    return 'echo ' + this.version;
                }
            },
            jkill: {
                cmd: 'pkill -9 jekyll'//not likely needed, but here just in case
            }
        },
        copy : {
            tojekyll:{
                files: [
                    {
                        expand: true,
                        dest: jekyll_dist,
                        src: js_dist + '**/*.js'
                    }
                ]
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', 'do a full compile, start a jekyll server at localhost:4000, then watch for changes with livereload enabled',function(){
        grunt.task.run([
            'concat',
            'jshint',
            'uglify:main',
            'copy:tojekyll',
            'exec:jserve',
            'watch'
        ]);
    });

    grunt.registerTask('sitesass', 'compile styles',function(){
        grunt.task.run([
            'sass:dev'
        ]);
        grunt.log.verbose.writeln('styles compiled and deployed to jekyll root');
    });

    grunt.registerTask('copyto','copy /js to jekyll /js',function(){
        grunt.task.run([
        'copy:tojekyll'
        ]);
        grunt.log.verbose.writeln('copied /js to jekyll /js');
    });

    grunt.registerTask('polyandextras','compile and copy polyfills and extra files',function(){
        grunt.task.run([
        'uglify:poly',
        'uglify:extras',
        'copy:tojekyll'
        ]);
        grunt.log.verbose.writeln('deployed to jekyll root');
    });

    grunt.registerTask('build','do a full compile and create zips suitable for upload to BSD tools at /page/-/donate/',function(){
        grunt.task.run([
            'concat',
            'jshint',
            'uglify:main',
            'copy:tojekyll'
        ]);
        grunt.log.verbose.writeln('files are ready to deploy');
    });

};