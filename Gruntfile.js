'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      }
    },
    jsbeautifier: {
      gruntfile: {
        src: 'Gruntfile.js',
        options: {
          config: '.jsbeautifyrc'
        }
      },
      examples: {
        src: ['examples/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      lib: {
        src: ['lib/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      test: {
        src: ['test/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },
    jscs: {
      gruntfile: {
        src: 'Gruntfile.js',
        options: {
          config: '.jscsrc',
          esnext: true,
          fix: true
        }
      },
      examples: {
        src: ['examples/**/*.js'],
        options: {
          config: '.jscsrc',
          esnext: true,
          fix: true
        }
      },
      lib: {
        src: ['lib/**/*.js'],
        options: {
          config: '.jscsrc',
          esnext: true,
          fix: true
        }
      },
      test: {
        src: ['test/**/*.js'],
        options: {
          config: '.jscsrc',
          esnext: true,
          fix: true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      examples: {
        src: ['examples/**/*.js']
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jscs', 'jshint', 'nodeunit']);
  grunt.registerTask('test', ['nodeunit']);
  grunt.registerTask('lint', ['jscs', 'jshint']);

};
