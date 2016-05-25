/* global module */
module.exports = function (grunt) {
    "use strict";
    var pathContentAem = "/aem/CQFiles/wineAemApp/@JCR_ROOT/apps/wineAemApp/components/page/contentpage/clientlibs/content",
        pathStaticAem = "/aem/CQFiles/wineAemApp/@JCR_ROOT/apps/wineAemApp/static";

    grunt.initConfig({
        aws: grunt.file.readJSON("grunt-aws.json"),
        jade: {
            options: {
                data: {
                    debug: false
                },
                pretty: true,
                basedir: "dev/"
            },
            build: {
                files: [
                    {
                        cwd: "dev/pages",
                        src: ["**/*.jade", "!pieces/**"],
                        dest: "pub/html/",
                        expand: true,
                        ext: ".html"
                    }
                ]
            }
        },
        less: {
            build: {
                options: {
                    compress: true,
                    cleancss: true,
                    sourceMap: false
                },
                files: [
                    {
                        cwd: "dev/less/bundles",
                        src: ["**/*.less"],
                        dest: "pub/css/",
                        expand: true,
                        ext: ".css"
                    }
                ]
            }
        },
        prettify: {
            options: {
                indent: 4,
                "indent_char": " ",
                "condense": true,
                "unformatted": ["pre", "code"]
            },
            all: {
                expand: true,
                cwd: "pub/html",
                ext: ".html",
                src: ["**/*.html"],
                dest: "pub/html"
            }
        },
        clean: {
            imgs: ["pub/imgs", "temp/imgs", "pub/static"],
            css: ["pub/css"],
            html: ["pub/html"],
            js: ["pub/js", "temp/js"]
        },
        watch: {
            options: {
                atBegin: true
            },
            imgs: {
                files: "dev/imgs/**",
                tasks: ["imgs", "less"]
            },
            css: {
                files: "dev/less/**",
                tasks: ["less"]
            },
            html: {
                files: ["dev/layouts/**", "dev/modules/**", "dev/pages/**"],
                tasks: ["html"]
            },
            js: {
                files: ["dev/js/**/*.js", "dev/templates/**/*.hbs"],
                tasks: ["js"]
            }
        },
        connect: {
            server: {
                options: {
                    livereload:false,
                    port: 3000,
                    base: "pub"
                }
            }
        },
        copy: {
            imgs: {
                files: [
                    {
                        cwd: "dev/imgs",
                        src: ["**/*", "!sprite/**"],
                        dest: "temp/imgs/",
                        expand: true
                    }
                ]
            },
            "css-prod": {
                files: [
                    {
                        src: "pub/css/wine.css",
                        dest: pathContentAem + "/css/wine.css"
                    }
                ]
            },
            "imgs-prod": {
                files: [
                    {
                        cwd: "pub/static/images",
                        src: ["*.{png,jpg,gif}"],
                        dest: pathStaticAem + "/images/",
                        expand: true
                    }
                ]
            }
        },
        sprite: {
            all: {
                src: "dev/imgs/sprite/**/*.png",
                dest: "temp/imgs/sprite.png",
                destCss: "temp/sprite.less",
                padding: 2,
                imgPath: "/static/images/sprite.png",
                cssOpts: {variableNameTransforms: ["camelize"]}
            }
        },
        imagemin: {
            all: {
                files: [{
                    cwd: "temp/imgs",
                    src: ["**/*.{png,jpg,gif}"],
                    dest: "pub/static/images/",
                    expand: true
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: true
            },
            all: [
                "Gruntfile.js",
                "dev/js/**/*.js"
            ]
        },
        jscs: {
            options: {
                config: ".jscsrc"
            },
            all: [
                "dev/js/**/*.js"
            ]
        },
        requirejs: {
            options: {
                name: "../../bower_components/requirejs/require",
                mainConfigFile: "dev/js/config.js",
                include: "main",
                out: "pub/js/scripts.js",
                optimize: "uglify2",
                generateSourceMaps: true,
                preserveLicenseComments: false,
                uglify2: {
                    mangle: false
                }
            },
            dev: {},
            prod: {
                options: {
                    out: pathContentAem + "/js/scripts-prod.js",
                    generateSourceMaps: false,
                    uglify2: {
                        mangle: true
                    }
                }
            },
            mocks: {
                options: {
                    include: "mocks",
                    out: "pub/js/mocks.js"
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    amd: true
                },
                files: {
                    "temp/js/templates.js": "dev/templates/**/*.hbs"
                }
            }
        },
        replace: {
            js: {
                src: pathContentAem + "/js/scripts-prod.js",
                overwrite: true,
                replacements: [{
                    from: "http://localhost:3002",
                    to: ""
                }]
            }
        },
        "aws_s3": {
            options: {
                accessKeyId: "<%= aws.key %>",
                secretAccessKey: "<%= aws.secret %>",
                region: "sa-east-1",
                bucket: "cdn-br.wine.com.br",
                uploadConcurrency: 5
            },
            "upload-vivino": {
                files: [{
                    cwd: "pub/static/images/email-vivino/",
                    src: ["**/*.{png,jpg,gif}"],
                    dest: "emails/vivino/",
                    expand: true
                }]
            },
            "upload-wbeer": {
                files: [{
                    cwd: "pub/static/images/email-wbeer/",
                    src: ["**/*.{png,jpg,gif}"],
                    dest: "emails/transacionais/wbeer/img/",
                    expand: true
                }]
            },
			"upload-wine": {
                files: [{
                    cwd: "pub/static/images/email-wine/",
                    src: ["**/*.{png,jpg,gif}"],
                    dest: "emails/transacionais/wine/img/",
                    expand: true
                }]
            },
            delete: {
                files: [
                    {dest: "emails/vivino/", action: "delete"}
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-prettify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-spritesmith");
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks("grunt-text-replace");
    grunt.loadNpmTasks("grunt-aws-s3");

    // JS Tasks
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-handlebars");
    grunt.loadNpmTasks("grunt-jscs");

    grunt.registerTask("default", ["connect:server", "watch"]);
    grunt.registerTask("imgs", ["clean:imgs", "copy:imgs", "sprite:all", "imagemin:all"]);
    grunt.registerTask("css", ["clean:css", "less:build"]);
    grunt.registerTask("html", ["clean:html", "jade:build", "prettify:all"]);
    grunt.registerTask("js", ["clean:js", "jshint:all", "jscs:all", "handlebars:compile", "requirejs:dev", "requirejs:mocks"]);

    grunt.registerTask("css-prod", ["copy:css-prod"]);
    grunt.registerTask("js-prod", ["requirejs:prod", "replace:js"]);
    grunt.registerTask("imgs-prod", ["copy:imgs-prod"]);

    grunt.registerTask("build", ["imgs", "css", "html", "js"]);
    grunt.registerTask("aem", ["build", "css-prod", "js-prod", "imgs-prod"]);
    grunt.registerTask("amazon:upload-vivino", ["imgs", "aws_s3:upload-vivino"]);
    grunt.registerTask("amazon:delete", ["aws_s3:delete"]);
    grunt.registerTask("amazon:upload-wbeer", ["imgs", "aws_s3:upload-wbeer"]);
    grunt.registerTask("amazon:upload-wine", ["imgs", "aws_s3:upload-wine"]);
};
