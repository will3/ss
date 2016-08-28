module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      js: {
        src: [
          'node_modules/three/build/three.js',
          'node_modules/socket.io-client/socket.io.js',
          'node_modules/jsondiffpatch/public/build/jsondiffpatch.min.js'
        ],
        dest: 'site/js',
        flatten: true,
        expand: true
      }
    },
    shell: {
      build: {
        command: 'watchify src/startclient.js -o site/js/bundle.js --debug -v'
      },
      open: {
        command: 'open http://localhost:3000'
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['copy', 'shell:open', 'shell:build']);
};
