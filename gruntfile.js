module.exports = function(grunt) {

    var conf = grunt.file.readJSON('package.json');

    // comment banner
    var comment = [
        '/**',
        conf.name + ' v' + conf.version + ' | ' + grunt.template.today("yyyy-mm-dd"),
        conf.description,
        'by ' + conf.author,
        conf.license
    ].join('\n* ') + '\n**/';

    var config = {

        pkg: grunt.file.readJSON('package.json'),

        clean: {

            'dest': 'js/*',

            'temp': 'src/*.tmp'

        },

        copy: {

            dist: {

                src: 'src/startup.js',
                dest: 'src/startup.js.tmp',
                options: {
                    process: function (content, srcpath) {
                        
                        content = content.replace('${version}', conf.version);

                        return content;

                    }

                }

            }
            
        },

        concat: {

            dist: {
                
                files: {
                    'js/startup.js': ['src/startup.js.tmp', 'src/domready.js']
                }
                

            }

        },

        jshint: {

            build: {

                options: grunt.file.readJSON('.jshintrc'),
                expand: true,
                src: ['src/startup.js.tmp']

            }

        },

        uglify: {

            original: {

                options: {
                    mangle: true,
                    banner: comment + '\n'
                },
                files: {
                    'js/startup.min.js' : 'js/startup.js'
                }

            }

        }

    };

    // load npm's
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['clean:dest', 'copy:dist', 'jshint', 'concat', 'clean:temp', 'uglify']);

    grunt.initConfig(config);

};