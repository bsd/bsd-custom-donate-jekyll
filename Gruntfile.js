module.exports = function(grunt) {

    "use strict";

    var docroot= '',
        js_source = docroot+'src/',
        js_dev = docroot+'dev/',
        js_dist = docroot+'js/',
        jekyll_dist = docroot +'webroot/',
        dynamiccopy,
        jekyll_port = 4000,
        screenshot_port = 4400,
        dynamiczip;

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
                    dest: jekyll_dist +'js/bsd-sequential-donate.js'
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
                    dest: jekyll_dist +'js/bsd-quick-donate.js'
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
                    dest: jekyll_dist +'js/bsd-donate-only.js'
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
                    jekyll_dist +'js/bsd-sequential-donate.js',
                    jekyll_dist +'js/bsd-quick-donate.js',
                    jekyll_dist +'js/bsd-donate-only.js'
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
                    src: [jekyll_dist +'js/bsd-sequential-donate.js'],
                    dest: js_dist + 'bsd-sequential-donate.js'
                },{
                    src: [jekyll_dist +'js/bsd-quick-donate.js'],
                    dest: js_dist + 'bsd-quick-donate.js'
                },{
                    src: [jekyll_dist +'js/bsd-donate-only.js'],
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
                    compass: 1,
                    noCache: true,
                    sourcemap: true
                },
                files: [{
                    expand: true,
                    cwd: jekyll_dist + 'scss',
                    src: '**/bsdcd-styles*.scss',
                    dest: jekyll_dist + 'css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options:{
                livereload: true
            },
            site: {
                files: [jekyll_dist +'**/*.html', jekyll_dist +'**/*.md', "!"+jekyll_dist +'_site/**/*'],
                tasks: [
                    'exec:jbuild'
                ]
            },
            js: {
                options:{
                    livereload: false
                },
                files: [js_source +'*.js'],
                tasks: [
                    'concat',
                    'jshint',
                    'uglify:main',
                    'copy:jekylljs',
                    'exec:jbuild'
                ]
            },
            buildsass:{
                options:{
                    livereload: false
                },
                files: [jekyll_dist +'scss/**/*.scss'],
                tasks: [
                    'sass:dev',
                    'copy:jekyllcss',
                    'exec:jbuild'
                ]
            },
            localcss:{
                files: [jekyll_dist+'localcss/*.css'],
                tasks: ['exec:jbuild']
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
                cmd: 'jekyll serve --detach',
                callback: function(){
                    return 'echo ' + this.version;
                }
            },
            jkill: {
                cmd: 'pkill -9 jekyll'//not likely needed, but here just in case
            }
        },
        compress:{
            options:{
                mode: 'zip'
            },
            main: {
                options: {
                  archive: docroot +'deploys/archive.zip'
                },
                files: [
                  {expand: true, src: [jekyll_dist + 'page/-/donate/**/*',js_dist+'bsd-*.js'], filter: 'isFile'}, // makes all src relative to cwd
                ]
            }
        },
        copy:{
            jekyllcss:{
                files: [
                    {
                        expand: true,
                        cwd: jekyll_dist + 'css/',
                        dest: jekyll_dist + 'page/-/donate/',
                        src: '**/*'
                    }
                ]
            },
            jekylljs:{
                files: [
                    {
                        expand: true,
                        cwd: jekyll_dist + 'js/',
                        dest: jekyll_dist + 'page/-/donate/',
                        src: '**/*'
                    }
                ]
            },
            jekylljsextras:{
                files: [
                    {
                        expand: true,
                        cwd: js_dist+ 'extras',
                        dest: jekyll_dist + 'js',
                        src: '**/*.js'
                    },
                    {
                        expand: true,
                        cwd: js_dist+'polyfills',
                        dest: jekyll_dist + 'js',
                        src: '**/*.js'
                    }
                ]
            },
            readme: {
                options: {
                  process: function (content, srcpath) {
                    return '---\nlayout: demo-page-list\ninner: true\ntitle: Readme\n---\n\n'+content.replace(/```/g,'`');
                  }
                },
                files: [{
                    src: 'readme.md',
                    dest: jekyll_dist + 'readme2.md'
                }]
            }
        },
        localscreenshots: {
                options: {
                    path: jekyll_dist + 'img/screenshots',
                    type: 'png',
                    hash: '#noquickd',
                    local : {
                        path: 'webroot/_site',
                        port: 4444
                    },
                    viewport: ['320x800','480x800', '768x1024', '1024x1024','1280x1024'],
                },
                src: [jekyll_dist + '_site/examples/*.html']
        },
        clean: {
            tempzip:{
                src: ['deploys/tmp']
            }
        }

    });

    require('load-grunt-tasks')(grunt);


    dynamiccopy = function(stylename){
        return {
            files: [
                {
                    expand: true,
                    cwd: jekyll_dist + 'css/' + stylename +'/',
                    src: '**',
                    dest: (docroot + 'deploys/tmp/'+stylename+'/'+stylename+'/')
                },{
                    expand: true,
                    cwd: js_dist,
                    src: 'bsd-*.js',
                    dest: docroot + 'deploys/tmp/'+stylename+'/',
                },{
                    expand: true,
                    cwd: js_source+ '/vendor/',
                    src: 'modernizr.js',
                    dest: docroot + 'deploys/tmp/'+stylename+'/',
                },{
                    expand: true,
                    cwd: docroot + 'img/',
                    src: '**',
                    dest: docroot + 'deploys/tmp/'+stylename+'/',
                }
            ]
        };
    };
    dynamiczip = function(stylename){
        return {
            options:{
                mode: 'zip',
                archive: docroot +'deploys/'+stylename+'.zip'
            },
            files: [
                {expand: true, cwd: (docroot + 'deploys/tmp/'+stylename+'/'), src: '**/*', filter: 'isFile'}
            ]
        };
    };

    // Default task(s).
    grunt.registerTask('default', 'do a full compile, start a jekyll server at http://localhost:4000, then watch for changes with livereload enabled',function(){
        grunt.task.run([
            'concat',
            'jshint',
            'uglify:main',
            'sass:dev',
            'copy:jekyllcss',
            'copy:jekylljs',
            //'copy:readme',
            'exec:jserve',
            'watchmsg',
            'watch'
        ]);
    });

    grunt.registerTask('watchmsg','.', function() {
      grunt.log.writeln('Starting the watch task. ^C should also cancel the jekyll server. If not use the PID kill command listed above, or use this command to find the PID: ps aux | grep jekyll');
    });

    grunt.registerTask('readme','move readme', function() {
      grunt.task.run([
            'copy:readme'
        ]);
    });

    grunt.registerTask('zipdone', '.', function(stylename) {
      grunt.log.writeln('Zipfile '+stylename+'.zip available in /deploy. Upload and unzip this file to the BSD tools in page/-/donate');
    });

    grunt.registerTask('allsass', 'compile all styles once',function(){
        grunt.task.run([
            'sass:dev',
            'copy:jekyllcss'
        ]);
    });

    grunt.registerTask('polyandextras','compile and copy polyfills and extra javascript files into jekyll webroot',function(){
        grunt.task.run([
        'uglify:poly',
        'uglify:extras',
        'copy:jekylljsextras'
        ]);
        grunt.log.verbose.writeln('deployed to jekyll root');
    });

    grunt.registerTask('compressdeploy','do a full compile and create zips suitable for upload to BSD tools at /page/-/donate/',function(stylename){
        if(typeof stylename ==="undefined"){
            grunt.log.writeln('Please specify a style folder to prepare: i.e. grunt build:stylename');
            return false;
        }
        grunt.config.set('copy.'+stylename, dynamiccopy(stylename) );
        grunt.config.set('compress.'+stylename, dynamiczip(stylename) );
        grunt.task.run([
            'copy:'+stylename,
            'compress:'+stylename,
            'clean:tempzip',
            'zipdone:'+stylename
        ]);
    });

    grunt.registerTask('build','do a full compile and create zips suitable for upload to BSD tools at /page/-/donate/',function(stylename){
        if(typeof stylename ==="undefined"){
            grunt.log.writeln('Please specify a style folder to prepare: i.e. grunt build:stylename');
            return false;
        }
        grunt.task.run([
            'concat',
            'jshint',
            'uglify:main',
            'sass:dev',
            'copy:jekyllcss',
            //'copy:readme',
            'compressdeploy:'+stylename
        ]);
    });

};