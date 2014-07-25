'use strict';

module.exports = function (grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  // Project configuration.
  grunt.initConfig({
    concurrent: {
      dev: ['nodemon','watch'],
      options: {logConcurrentOutput: true}
    },
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
    typescript: {
      base: {
        src: ['server.ts'],
        dest: 'server.js',
        options: {sourcemap: true, module: 'commonjs'} //module: 'amd'/'common'
      }
    },
    watch: {
      files: '**/*.ts',
      tasks: ['typescript'],
      options: {livereload: true}
    }
  });

  // Default task.
  grunt.registerTask('default', ['concurrent']);
};
