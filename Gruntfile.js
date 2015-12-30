module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            front: {
                options: {
                    yuicompress: true,
                },
                files: {
                    'www/css/main-<%= pkg.version %>.css': [
                        'less/main.less'
                    ]
                }
            },
        },
        watch: {
            app: {
                files: 'less/*.less',
                tasks: ['less:front']
            }
        },
        connect: {
            hq: {
                options: {
                    port: 8080,
                    base: '.'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');

    //grunt.registerTask('default', ['clean', 'less', 'uglify', 'setPHPConstant']);gr
    grunt.registerTask('default', ['less']);
};
