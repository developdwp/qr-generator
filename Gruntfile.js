/*
 * QRious

 */

'use strict';

module.exports = function(grunt) {
  var commonjs = require('rollup-plugin-commonjs');
  var nodeResolve = require('rollup-plugin-node-resolve');
  var uglify = require('rollup-plugin-uglify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: [ 'dist/**' ]
    },

    eslint: {
      target: [
        'index.js',
        'src/**/*.js'
      ]
    },

    rollup: {
      umdDevelopment: {
        options: {
          format: 'umd',
          moduleId: 'qrious',
          moduleName: 'QRious',
          sourceMap: true,
          sourceMapRelativePaths: true,
          banner: [
            '/*',
            ' * QRious v<%= pkg.version %>',

            ' */'
          ].join('\n'),
          plugins: function() {
            return [
              nodeResolve(),
              commonjs()
            ];
          }
        },
        files: {
          'dist/qrious.js': 'src/QRious.js'
        }
      },
      umdProduction: {
        options: {
          format: 'umd',
          moduleId: 'qrious',
          moduleName: 'QRious',
          sourceMap: true,
          sourceMapRelativePaths: true,
          banner: [
            '/*! QRious v<%= pkg.version %> | (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> | GPL v3 License',
            'Based on jsqrencode | (C) 2010 tz@execpc.com | GPL v3 License',
            '*/'
          ].join('\n'),
          plugins: function() {
            return [
              nodeResolve(),
              commonjs(),
              uglify({
                output: {
                  comments: function(node, comment) {
                    return comment.type === 'comment2' && /^\!/.test(comment.value);
                  }
                }
              })
            ];
          }
        },
        files: {
          'dist/qrious.min.js': 'src/QRious.js'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [ 'ci' ]);
  grunt.registerTask('build', [ 'eslint', 'clean:build', 'rollup' ]);
  grunt.registerTask('ci', [ 'eslint', 'clean', 'rollup' ]);
  grunt.registerTask('test', [ 'eslint' ]);
};
