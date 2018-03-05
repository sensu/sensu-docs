var yaml = require("js-yaml");
var S = require("string");

var CONTENT_PATH_PREFIX = "content/";

// define the grunt function for cli
module.exports = function(grunt) {

    grunt.registerTask("hugo-build", function() {
        const done = this.async();

        grunt.log.writeln("Running hugo build");
        grunt.util.spawn({
            cmd: "hugo",
        },
            function(error, result, code) {
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

        grunt.log.writeln("Running Hugo server");
        grunt.util.spawn({
            cmd: "hugo",
            args: ["server"],
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

    // define the actual lunr-index task for cli
    grunt.registerTask("lunr-index", function() {

        grunt.log.writeln("Build pages index");

        // makes an array of the names of all the files
        var indexPages = function() {
            var pagesIndex = [];
            // go through the folders recursively
            grunt.file.recurse(CONTENT_PATH_PREFIX, function(abspath, rootdir, subdir, filename) {
                grunt.verbose.writeln("Parse file:", abspath);

                // push adds the processed file to the array of pages
                pagesIndex.push(processFile(abspath, filename));
            });
            return pagesIndex;
        };

        // call the appropriate process for if it's a content file (md) or html page
        var processFile = function(abspath, filename) {
            var pageIndex;
            if (S(filename).endsWith(".html")) {
                pageIndex = processHTMLFile(abspath, filename);
            } else if (S(filename).endsWith(".md")) {
                pageIndex = processMDFile(abspath, filename);
            }
            return pageIndex;
        };

        // process html
        var processHTMLFile = function(abspath, filename) {
            // read the file contents
            var content = grunt.file.read(abspath);
            // the page name will be the filename, minus html
            var pageName = S(filename).chompRight(".html").s;
            // create the path to the file, minus everything before the path prefix
            var href = "/" + S(abspath)
                .chompLeft(CONTENT_PATH_PREFIX).s;
            grunt.log.writeln("PageName (html)" + pageName);
            return {
                // return an object containing these values
                title: pageName,
                href: href,
                // remove any tags and punctuation from the page
                content: S(content).trim().stripTags().stripPunctuation().s
            };
        };

        // process md
        var processMDFile = function(abspath, filename) {
            // read the file contents
            var content = grunt.file.read(abspath);
            var pageIndex;
            // first separate the Front Matter from the content and parse it
            content = content.split("---");
            var frontMatter;
            try {
                frontMatter = yaml.load(content[1].trim());
            } catch (e) {
                grunt.log.writeln("Front matter failed: " + e.message);
            }

            // create the path to the file, minus everything before the path prefix
            var href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(".md").s;
            // href for index.md files stops at the folder name
            if (filename === "index.md") {
                href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
            }

            href = "/" + href

            grunt.log.writeln("PageName (html)" + frontMatter.title);

            // build Lunr index for this page
            pageIndex = {
                title: frontMatter.title,
                tags: frontMatter.tags,
                product: frontMatter.product,
                version: frontMatter.version,
                location: href,
                display_name: frontMatter.product + " " + frontMatter.version + ": " + frontMatter.title,
                content: S(content[2]).trim().stripTags().stripPunctuation().s
            };
            return pageIndex;
        };
        grunt.file.write("static/js/lunr/PagesIndex.json", JSON.stringify(indexPages()));
        grunt.log.ok("Lunr index built");
    });

    grunt.registerTask("default", ["lunr-index", "hugo-build",]);
};
