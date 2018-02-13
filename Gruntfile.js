module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean : ['.DS_Store', '**/.DS_Store'],
    svg2png: {
      all : {
        files : [{
            src : ['img/svg/*.svg'],
            dest : 'img/png'
        }]
      }
    },
    pngmin : {
      compile : {
        options : '.png',
        force : true
      },
      files: [
        {
          src : 'img/png/*.png',
          dest : 'img/png'
        }
      ]
    }
  });

  grunt.registerTask('default');
  
  // Load Tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-pngmin');
  grunt.loadNpmTasks('grunt-svg-to-png');
}
