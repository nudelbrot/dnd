module.exports = function(grunt) {

  //require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
        },
        esversion: 6,
        reporterOutput: ""
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>.js'
        }
      }
    },
    "browserify": {
      development: {
        "transform": ["babelify"],
        src: 'src/**/*.js',
        dest: 'dist/<%= pkg.name %>.js',
        options: {
          browserifyOptions: { debug: true },
          transform: [["babelify", { "presets": ["env"] }]],
          watch: true,
          keepAlive: true,
        }
      },
      production: {
        src: 'src/**/*.js',
        dest: 'dist/<%= pkg.name %>.js',
        options: {
          browserifyOptions: { debug: false },
          transform: [["babelify", { "presets": ["env"] }]],
          plugin: [
            ["minifyify", { map: false }]
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask("default", ["browserify:development"]);
  grunt.registerTask("release", ["jshint", "qunit", "browserify:production"]);
  //grunt.registerTask('default', ['jshint', 'qunit',  'browserify', 'babel','concat', 'uglify']);
  //grunt.registerTask('default', ['jshint', 'qunit', 'concat']);

};
