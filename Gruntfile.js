module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch : {
            styles : {
                files: ['css/*.less'],
                tasks: ['less', 'cssmin']
            },
            scripts: {
                files: ['scripts/*.js'],
                tasks: ['jshint', 'uglify']
            }
        },
        less : {
            development: {
                options : {
                    paths: ['css/*.css']
                },
                files : {
                    'dt.css': 'css/dt.less',
                    'admin_2017.css': 'css/admin_2017.less'
                }
            }

        },
        jshint: {
            all: [
                'Gruntfile.js',
                'scripts/*.js',
            ]
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: ['scripts/dt2016.js'],
                dest: 'dt2016.min.js'
            }
        },
        cssmin : {
            options : {

            },
            target: {
                files : {
                    'dt.min.css' : 'dt.css',
                    'admin_2017.min.css' : 'admin_2017.css',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-notify');
    grunt.registerTask('default', ['watch']);

};