module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean : ['.DS_Store', '**/.DS_Store']
  });

  grunt.registerTask('default');

  // Load Tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
}
