/**
  @fileoverview main Grunt task file
**/
'use strict';

var fs = require('fs')
  , path = require('path');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //browserify
    browserify: {
      dist: {
        src: ['controller.js'],
        dest: 'dist/asq-visualization.js',
        options: {
          debug: true
        }
      },
      correctness: {
        src: ['mockups/correctness/js/correctness.js'],
        dest: 'mockups/correctness/js/correctness-bundle.js',
        options: {
          debug: true
        }
      }
    },

    //uglify
    uglify: {
      options: {
        screw_ie8 : true,
        mangle:false,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'dist/asq-visualization.min.js' : ['dist/asq-visualization.js'],
        }
      }
    },

    // less: {
    //   development: {
    //     options: {
    //       paths: ['client/less']
    //     },
    //     files: {
    //       'public/css/login.css': 'client/less/login.less',
    //       'public/css/logoAnim.css': 'client/less/logoAnim.less',
    //       'public/css/phone.css': 'client/less/phone.less',
    //       'public/css/style.css': 'client/less/style.less'
    //     }
    //   },
    //   production: {
    //     options: {
    //       paths: ['client/less'],
    //       yuicompress: true
    //     },
    //     files: {
    //       'public/css/login.css': 'client/less/login.less',
    //       'public/css/logoAnim.css': 'client/less/logoAnim.less',
    //       'public/css/phone.css': 'client/less/phone.less',
    //       'public/css/style.css': 'client/less/style.less'
    //     }
    //   }
    // },

    //parallel tasks
    concurrent: {
      compile: [/*'less', */'browserify:dist', 'browserify:correctness'],
      uglify: ['uglify'],
    },

    //watch
    watch: {
      options:{
        livereload: true
      },
      dist: {
        files: ['controller.js', 'graphs/*.js', 'utils/*.js', 'mockups/**/*.js'],
        tasks: ['concurrent:compile'],
        options: {
          spawn: false
          // interrupt: true
        },
      }/*,
      less: {
        files: ['client/less/*.less'],
        tasks: ['less:development'],
        options: {
          interrupt: true
        },
      }*/
    }
  });

  // Our custom tasks.
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [/*'maybeless', */'browserify', 'uglify']);
  grunt.registerTask('build-concurrent', ['concurrent:compile', 'concurrent:uglify']);
  grunt.registerTask('devwatch', ['build-concurrent', 'watch']);
  grunt.registerTask('deploy', ['shell:deploy']);

  // //ported from togetherjs
  // //https://github.com/mozilla/togetherjs/blob/develop/Gruntfile.js
  // grunt.registerTask('maybeless', 'Maybe compile togetherjs.less', function () {
  // var sources = grunt.file.expand(['client/less/*.less']);
  // var found = false;
  // sources.forEach(function (fn) {
  //   var source = fs.statSync(fn);
  //   var basename = path.basename(fn)
  //   var destFn = 'public/css/' + basename.substr(0, basename.length-4) + 'css';
  //   if (! fs.existsSync(destFn)) {
  //     found = true;
  //     return;
  //   }
  //   var dest = fs.statSync(destFn);
  //   if (source.mtime.getTime() > dest.mtime.getTime()) {
  //     grunt.log.writeln('Destination LESS out of date: ' + destFn.cyan);
  //     found = true;
  //   }
  // });
  // if (found) {
  //   grunt.task.run('less');
  // } else {
  //   grunt.log.writeln('No .less files need regenerating.');
  // }
  // });

  //npm tasks
  require('load-grunt-tasks')(grunt);

  //load custom tasks
  //grunt.loadTasks('./tasks');

};
