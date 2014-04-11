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
      // vendor: {
      //   src: 'vendor-entry.js',
      //   dest: 'dist/js/vendor.js',
      //   options: {
      //     debug: true,
      //     shim: {
      //       jquery: { path: "node_modules/jquery/dist/jquery.js", exports: "$" }
      //     }
      //   }
      // },
      dist: {
        src: ['controller.js'],
        dest: 'dist/js/asq-visualization.js',
        options: {
          debug: true,
          shim: {
            jquery: { 
              path: "node_modules/jquery/dist/jquery.js", exports: "$" 
            },
            d3: {
              path: 'node_modules/d3/d3.js', exports: 'd3'
            }
          }
        }
      },
      mockups: {
        src: ['mockups/js/mockups.js'],
        dest: 'mockups/js/mockups-bundle.js',
        options: {
          debug: true,
          depends: { d3: 'd3', jquery : 'jquery' }
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
          'dist/js/asq-visualization.min.js' : ['dist/js/asq-visualization.js'],
        }
      }
    },

    less: {
      development: {
        options: {
          paths: ['graphs/**/*.less']
        },
        files : {
          'dist/css/asq-visualization.css' : 'graphs/**/*.less'
        }
      },
      production: {
        options: {
          paths: ['graphs/**/*.less'],
          yuicompress: true
        },
        files : {
          'dist/css/asq-visualization.min.css' : 'graphs/**/*.less'
        }
      }
    },

    //parallel tasks
    concurrent: {
      compile: ['less', 'browserify:dist', 'browserify:mockups'],
      uglify: ['uglify'],
    },

    //watch
    watch: {
      options:{
        livereload: true
      },
      dist: {
        files: ['manager.js', 'graphs/**/*.js', 'utils/*.js', 'mockups/**/*.js'],
        tasks: ['concurrent:compile'],
        options: {
          spawn: false
          // interrupt: true
        },
      },
      less: {
        files: ['graphs/**/*.less'],
        tasks: ['less:development'],
        options: {
          interrupt: true
        },
      }
    }
  });

  // Our custom tasks.
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [/*'maybeless', */'browserify', 'uglify']);
  grunt.registerTask('build-concurrent', ['concurrent:compile', 'concurrent:uglify']);
  grunt.registerTask('devwatch', ['build-concurrent', 'watch']);
  grunt.registerTask('deploy', ['shell:deploy']);

  //npm tasks
  require('load-grunt-tasks')(grunt);

};
