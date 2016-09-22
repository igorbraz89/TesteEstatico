/* global module*/
/*jshint esversion: 6*/
module.exports = function (grunt) {
    "use strict";

    var pathFaesaDev = "dev";
    var faesaJsFiles = pathFaesaDev + "/dev-resources/js/**/*.js";

    var createConfig = {
        requirejs: function (basePath) {
            var options = {
                baseUrl: basePath + "/dev-resources/js/",
                name: "main",
                out: basePath + "/dev-resources/build/scripts.js",
                optmize: "uglify2",
                generateSourceMaps: false,
                preserveLicenseComments: false
            };
            return {
                "options": options
            };
        },
        jshint: function (basePath) {
            var options = {
                jshintrc: true,
                esversion: 6
            };
            return {
                "options": options,
                "src": [
                    "Gruntfile.js",
                    basePath + "/dev-resources/js/**/*.js"
                ]
            };
        },
        jscs: function (basePath) {
            var options = {
                config: ".jscsrc"
            };
            return {
                "options": options,
                "src": [
                    basePath + "/dev-resources/js/**/*.js"
                ]
            };
        }
    };

    var configBuilder = function (configName) {
        return {
            "faesa-dev": createConfig[configName](pathFaesaDev)
        };
    };

    grunt.initConfig({
        requirejs: configBuilder("requirejs"),
        jshint: configBuilder("jshint"),
        jscs: configBuilder("jscs"),
        clean: [
            pathFaesaDev + "/dev-resources/build/",
        ],
        watch: {
            options: {
                atBegin: true
            },
            "js-faesa": {
                files: [faesaJsFiles],
                tasks: ["jscs:faesa-dev", "jshint:faesa-dev", "requirejs:faesa-dev"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-jscs");

    grunt.registerTask("default", [
        "jscs:faesa-dev",
        "jshint:faesa-dev",
        "requirejs:faesa-dev",
    ]);
    grunt.registerTask("dev", "default");
};