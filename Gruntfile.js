module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    sass: {
      dist: {
        files: {
          "public/css/main.css": ["src/main.scss"],
        },
      },
    },
    watch: {
      css: {
        files: ["**/*.scss"],
        tasks: ["sass"],
      },
    },
  });
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  // A very basic default watch task that compiles scss
  grunt.registerTask("default", ["watch"]);
};
