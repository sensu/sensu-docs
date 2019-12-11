const sass = require('node-sass');

var CONTENT_PATH_PREFIX = "content/";

// define the grunt function for cli
module.exports = function(grunt) {
  grunt.initConfig({
    concurrent: {
      options: {
        logConcurrentOutput: true,
      },
      target: ['hugo-server', 'watch'],
    },
    env : {
      options : {
        add : {
          HUGO_VERSION : '0.56.1'
        }
      },
      dev : {}
    },
    pkg: grunt.file.readJSON('package.json'),
    postcss: {
      develop: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')(),
            require('cssnano')(),
          ],
        },
        src: ['static/stylesheets/sensu.css', 'static/stylesheets/offline.css'],
      },
      dist: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')(),
            require('cssnano')(),
          ],
        },
        src: 'static/stylesheets/sensu.css',
      },
    },
    sass:  {
      develop: {
        files: {
          'static/stylesheets/sensu.css': 'static/stylesheets/scss/main.scss',
          'static/stylesheets/offline.css': 'static/stylesheets/scss/offline.scss',
        },
        options: {
          implementation: sass,
          sourceMap: true,
        }
      },
      dist: {
        files: {
          'static/stylesheets/sensu.css': 'static/stylesheets/scss/main.scss',
        },
        options: {
          implementation: sass,
          sourceMap: false,
        },
      },
    },
    watch: {
      css: {
        files: ['static/stylesheets/**/*.scss'],
        tasks: ['sass:develop', 'postcss:develop'],
      },
    },
  })

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');

  grunt.registerTask("hugo-build", function() {
    const done = this.async();
    const args = process.argv.slice(3).filter(a => a !== '--color'); // fetch given arguments
    const toml = require('toml');
    const config = toml.parse(grunt.file.read('config.toml'));
    const latestSensuGo = config.params.products.sensu_go.latest;

    // Move latest Sensu version to /latest
    grunt.log.writeln(`Moving content/sensu-go/${latestSensuGo} → content/sensu-go/latest`);
    grunt.file.copy(`content/sensu-go/${latestSensuGo}`, 'content/sensu-go/latest');
    grunt.file.delete(`content/sensu-go/${latestSensuGo}`);

    grunt.log.writeln("Running hugo build");
    grunt.util.spawn({
        cmd: "hugo",
        args: [...args],
      },
      function(error, result, code) {
        // Restore directories
        grunt.log.writeln('Restoring moved directories...');
        grunt.log.writeln(`Moving content/sensu-go/latest → content/sensu-go/${latestSensuGo}`);
        grunt.file.copy('content/sensu-go/latest', `content/sensu-go/${latestSensuGo}`);
        grunt.file.delete('content/sensu-go/latest');

        if (code == 0) {
          grunt.log.ok("Successfully built site");
        } else {
          grunt.fail.fatal(error);
        }
        done();
      });
  });

  grunt.registerTask("hugo-server", function() {
    const done = this.async();
    const args = process.argv.slice(3).filter(a => a !== '--color'); // fetch given arguments

    grunt.log.writeln("Running Hugo server");
    grunt.util.spawn({
      cmd: "hugo",
      args: ["server", "--disableFastRender", ...args], // pass arguments down
      opts: {stdio: 'inherit'}
    },
      function(error, result, code) {
        if (code == 0) {
          grunt.log.ok("Thanks for using Hugo!");
        } else {
          grunt.fail.fatal(error);
        }
        done();
      });
  });

  grunt.registerTask("print-hugo-version", function() {
    const done = this.async();
    grunt.util.spawn({
      cmd: "hugo",
      args: ["version"],
      opts: {stdio: 'inherit'}
    },
      function(error, result, code) {
        if (code == 0) {
        } else {
          grunt.fail.fatal(error);
        }
        done();
      });
  });

  grunt.registerTask("default", ["env", "hugo-version", "sass:dist", "postcss:dist", "hugo-build",]);
  grunt.registerTask("server", ["env", "hugo-version", "sass:develop", "postcss:develop", "concurrent:target"]);
  grunt.registerTask("hugo-version", ["env", "print-hugo-version",]);
};
