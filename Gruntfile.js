/**
 *  This is the Gruntfile for p5.js. Grunt is a task runner/builder
 *  which is what p5.js uses to build the source code into the library
 *  and handle other housekeeping tasks.
 *
 *  There are three main tasks:
 *
 *  grunt             - This is the default task, which builds the code, tests it
 *                      using both jslint and mocha, and then minifies it.
 *
 *  grunt yui         - This will build the inline documentation for p5.js.
 *                      The generated documentation is assumed to be
 *                      served from the /reference/ folder of the p5js
 *                      website (https://github.com/processing/p5.js-website).
 *
 *  grunt test        - This rebuilds the source and runs the automated tests on
 *                     both the minified and unminified code. If you need to debug
 *                     a test suite in a browser, `grunt test --keepalive` will
 *                     start the connect server and leave it running; the tests
 *                     can then be opened at localhost:9001/test/test.html
 *
 *  grunt yui:dev     - This rebuilds the inline documentation. It also rebuilds
 *                     each time a change to the source is detected. You can preview
 *                     the reference at localhost:9001/test/test.html
 *
 *  Note: `grunt test:nobuild` will skip the build step when running the tests,
 *  and only runs the test files themselves through the linter: this can save
 *  a lot of time when authoring test specs without making any build changes.
 *
 *  And there are several secondary tasks:
 *
 *
 *  grunt watch       - This watches the source for changes and rebuilds on
 *                      every file change, running the linter and tests.
 *
 *  grunt watch:main  - This watches the source for changes and rebuilds on
 *                      every file change, but does not rebuild the docs.
 *                      It's faster than the default watch.
 *
 *  grunt watch:quick - This watches the source for changes and rebuilds
 *                      p5.js on every file change, but does not rebuild
 *                      docs, and does not perform linting, minification,
 *                      or run tests. It's faster than watch:main.
 *
 *  grunt update_json - This automates updating the bower file
 *                      to match the package.json
 *
 *  grunt karma       - This runs the performance benchmarks in
 *                      multiple real browsers on the developers local machine.
 *                      It will automatically detect which browsers are
 *                      installed from the following list (Chrome, Firefox,
 *                      Safari, Edge, IE) and run the benchmarks in all installed
 *                      browsers and report the results. Running "grunt karma"
 *                      will execute ALL the benchmarks. If you want to run a
 *                      specific benchmark you can by specifying the target e.g.
 *                      "grunt karma:random-dev". The available targets are
 *                      defined in grunt-karma.js.
 *
 *  Contributors list can be updated using all-contributors-cli:
 *  https://www.npmjs.com/package/all-contributors-cli
 *
 *  all-contributors generate - Generates new contributors list for README
 */

function getYuidocOptions() {
  var BASE_YUIDOC_OPTIONS = {
    name: '<%= pkg.name %>',
    description: '<%= pkg.description %>',
    version: '<%= pkg.version %>',
    url: '<%= pkg.homepage %>',
    options: {
      paths: ['src/', 'lib/addons/'],
      themedir: 'docs/yuidoc-p5-theme/',
      helpers: [],
      preprocessor: './docs/preprocessor.js',
      outdir: 'docs/reference/'
    }
  };

  // note dev is no longer used, prod is used to build both testing and production ready docs

  var o = {
    prod: JSON.parse(JSON.stringify(BASE_YUIDOC_OPTIONS)),
    dev: JSON.parse(JSON.stringify(BASE_YUIDOC_OPTIONS))
  };

  o.prod.options.helpers.push('docs/yuidoc-p5-theme/helpers/helpers_prod.js');
  o.dev.options.helpers.push('docs/yuidoc-p5-theme/helpers/helpers_dev.js');

  return o;
}

module.exports = function(grunt) {
  // Specify what reporter we'd like to use for Mocha
  var quietReport = process.env.TRAVIS || grunt.option('quiet');
  var reporter = quietReport ? 'spec' : 'Nyan';

  // Load karma tasks from an external file to keep this file clean
  var karmaTasks = require('./grunt-karma.js');

  // For the static server used in running tests, configure the keepalive.
  // (might not be useful at all.)
  var keepalive = false;
  if (grunt.option('keepalive')) {
    keepalive = true;
  }

  let gruntConfig = {
    // read in the package, used for knowing the current version, et al.
    pkg: grunt.file.readJSON('package.json'),

    // Configure style consistency checking for this file, the source, and the tests.
    eslint: {
      options: {
        format: 'unix',
        configFile: '.eslintrc'
      },
      build: {
        src: [
          'Gruntfile.js',
          'grunt-karma.js',
          'docs/preprocessor.js',
          'utils/**/*.js',
          'tasks/**/*.js'
        ]
      },
      fix: {
        // src: is calculated below...
        options: {
          rules: {
            'no-undef': 0,
            'no-unused-vars': 0
          },
          fix: true
        }
      },
      source: {
        src: ['src/**/*.js', 'lib/addons/p5.dom.js']
      },
      test: {
        src: [
          'bench/**/*.js',
          'test/test-docs-preprocessor/**/*.js',
          'test/node/**/*.js',
          'test/reporter/**/*.js',
          'test/unit/**/*.js'
        ]
      },
      examples: {
        options: {
          rules: {
            'no-undef': 0,
            'no-unused-vars': 0
          }
        },
        src: ['test/manual-test-examples/**/*.js']
      }
    },

    'eslint-samples': {
      options: {
        configFile: '.eslintrc',
        format: 'unix'
      },
      source: {
        src: ['src/**/*.js', 'lib/addons/p5.dom.js']
      },
      fix: {
        options: {
          fix: true
        }
      }
    },

    // Set up the watch task, used for live-reloading during development.
    // This watches both the codebase and the yuidoc theme.  Changing the
    // code touches files within the theme, so it will also recompile the
    // documentation.
    watch: {
      quick: {
        files: ['src/**/*.js', 'src/**/*.frag', 'src/**/*.vert'],
        tasks: ['browserify'],
        options: {
          livereload: true
        }
      },
      // Watch the codebase for changes
      main: {
        files: ['src/**/*.js'],
        tasks: ['newer:eslint:source', 'test'],
        options: {
          livereload: true
        }
      },
      // watch the theme for changes
      reference_build: {
        files: ['docs/yuidoc-p5-theme/**/*'],
        tasks: ['yuidoc'],
        options: {
          livereload: true,
          interrupt: true
        }
      },
      // watch the yuidoc/reference theme scripts for changes
      yuidoc_theme_build: {
        files: ['docs/yuidoc-p5-theme-src/scripts/**/*'],
        tasks: ['requirejs:yuidoc_theme']
      },
      // Watch the codebase for doc updates
      // launch with 'grunt requirejs connect watch:yui'
      yui: {
        files: [
          'src/**/*.js',
          'lib/addons/*.js',
          'src/**/*.frag',
          'src/**/*.vert'
        ],
        tasks: ['browserify', 'yuidoc:prod', 'minjson', 'uglify'],
        options: {
          livereload: true
        }
      }
    },

    // Set up node-side (non-browser) mocha tests.
    mochaTest: {
      test: {
        src: ['test/node/**/*.js'],
        options: {
          reporter: reporter
        }
      }
    },

    // Set up the mocha task, used for running the automated tests.
    mocha: {
      yui: {
        options: {
          urls: ['http://localhost:9001/test/test-reference.html'],
          reporter: reporter,
          run: false,
          log: true,
          logErrors: true,
          growlOnSuccess: false
        }
      },
      test: {
        options: {
          urls: [
            'http://localhost:9001/test/test.html',
            'http://localhost:9001/test/test-minified.html'
          ],
          reporter: reporter,
          run: true,
          log: true,
          logErrors: true,
          timeout: 100000,
          growlOnSuccess: false
        }
      }
    },

    // This is a standalone task, used to automatically update the bower.json
    // file to match the values in package.json. It is (likely) used as part
    // of the manual release strategy.
    update_json: {
      // set some task-level options
      options: {
        src: 'package.json',
        indent: '\t'
      },

      // update bower.json with data from package.json
      bower: {
        src: 'package.json', // where to read from
        dest: 'bower.json', // where to write to
        // the fields to update, as a String Grouping
        fields: 'name version description repository'
      }
    },

    // This generates the theme for the documentation from the theme source
    // files.
    requirejs: {
      yuidoc_theme: {
        options: {
          baseUrl: './docs/yuidoc-p5-theme-src/scripts/',
          mainConfigFile: './docs/yuidoc-p5-theme-src/scripts/config.js',
          name: 'main',
          out: './docs/yuidoc-p5-theme/assets/js/reference.js',
          optimize: 'none',
          generateSourceMaps: true,
          findNestedDependencies: true,
          wrap: true,
          paths: {
            jquery: 'empty:'
          }
        }
      }
    },

    // This minifies the javascript into a single file and adds a banner to the
    // front of the file.
    uglify: {
      options: {
        compress: {
          global_defs: {
            IS_MINIFIED: true
          }
        },
        banner:
          '/*! p5.js v<%= pkg.version %> <%= grunt.template.today("mmmm dd, yyyy") %> */ '
      },
      dist: {
        files: {
          'lib/p5.min.js': 'lib/p5.pre-min.js',
          'lib/addons/p5.dom.min.js': 'lib/addons/p5.dom.js'
        }
      }
    },

    // this builds the documentation for the codebase.
    yuidoc: getYuidocOptions(),

    // This runs benchmarks in multiple real browsers for developing
    // performance optimizations
    karma: karmaTasks,

    // This is a static server which is used when testing connectivity for the
    // p5 library. This avoids needing an internet connection to run the tests.
    // It serves all the files in the test directory at http://localhost:9001/
    connect: {
      server: {
        options: {
          base: './',
          port: 9001,
          keepalive: keepalive,
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(
              require('connect-modrewrite')([
                '^/assets/js/p5(\\.min)?\\.js(.*) /lib/p5$1.js$2 [L]',
                '^/assets/js/p5\\.(dom|sound)(\\.min)?\\.js(.*) /lib/addons/p5.$1$2.js$3 [L]'
              ]),
              function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', '*');
                return next();
              }
            );
            return middlewares;
          }
        }
      }
    },
    open: {
      yui: {
        path: 'http://0.0.0.0:9001/docs/reference/'
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: ['http://127.0.0.1:9001/test/test.html'],
          tunnelTimeout: 5,
          build: process.env.TRAVIS_JOB_ID,
          concurrency: 3,
          browsers: [
            { browserName: 'chrome' },
            { browserName: 'firefox', platform: 'Linux', version: '42.0' },
            { browserName: 'safari' }
          ],
          testname: 'p5.js mocha tests',
          tags: ['master']
        }
      }
    },
    minjson: {
      compile: {
        files: {
          './docs/reference/data.min.json': './docs/reference/data.json'
        }
      }
    }
  };

  // eslint fixes everything it checks:
  gruntConfig.eslint.fix.src = Object.keys(gruntConfig.eslint)
    .map(s => gruntConfig.eslint[s].src)
    .reduce((a, b) => a.concat(b), [])
    .filter(a => a);

  /* not yet
  gruntConfig['eslint-samples'].fix.src = Object.keys(
    gruntConfig['eslint-samples']
  )
    .map(s => gruntConfig['eslint-samples'][s].src)
    .reduce((a, b) => a.concat(b), [])
    .filter(a => a);
  */

  grunt.initConfig(gruntConfig);

  // Load build tasks.
  // This contains the complete build task ("browserify")
  // and the task to generate user select modules of p5
  // ("combineModules") which can be invoked directly by
  // `grunt combineModules:module_1:module_2` where core
  // is included by default in all combinations always.
  // NOTE: "module_x" is the name of it's folder in /src.
  grunt.loadTasks('tasks/build');

  // Load the external libraries used.
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('grunt-minjson');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-release-it');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-karma');

  // Create the multitasks.
  grunt.registerTask('build', [
    'browserify',
    'browserify:min',
    'uglify',
    'requirejs'
  ]);
  grunt.registerTask('lint-no-fix', [
    'yui', // required for eslint-samples
    'eslint:build',
    'eslint:source',
    'eslint:test',
    //'eslint:examples',
    'eslint-samples:source'
  ]);
  grunt.registerTask('lint-fix', ['eslint:fix']);
  grunt.registerTask('test', [
    'lint-no-fix',
    //'yuidoc:prod', // already done by lint-no-fix
    'build',
    'connect',
    'mocha',
    'mochaTest'
  ]);
  grunt.registerTask('test:nobuild', ['eslint:test', 'connect', 'mocha']);
  grunt.registerTask('yui', ['yuidoc:prod', 'minjson', 'typescript']);
  grunt.registerTask('yui:test', ['yuidoc:prod', 'connect', 'mocha:yui']);
  grunt.registerTask('yui:dev', [
    'yui:prod',
    'build',
    'connect',
    'open:yui',
    'watch:yui'
  ]);
  grunt.registerTask('yui:build', ['requirejs:yuidoc_theme', 'yui']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('saucetest', ['connect', 'saucelabs-mocha']);
};
