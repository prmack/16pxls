/*!
 * grunt-svg2png
 * https://github.com/dbushell/grunt-svg2png
 *
 * Copyright (c) 2013 David Bushell
 * Licensed under The MIT License (MIT)
 */

'use strict';

var phantomjs = require('phantomjs'),
    path = require('path'),
    fs = require('fs'),
    os = require('os');

module.exports = function(grunt)
{
    grunt.registerMultiTask('svg2png', 'Rasterize SVG to PNG images using PhantomJS', function()
    {

        var done = this.async(),
            start = new Date(),
            completed = 0,
            files = [],
            total = 0,
            tempFile;

        // Write parameters to file
        function writeTemporaryFile() {
            tempFile = os.tmpdir().split(path.sep);

            if (!tempFile[tempFile.length - 1]) {
                tempFile.pop();
            }

            tempFile.push('rasterizing-settings.json');
            tempFile = tempFile.join(path.sep);

            fs.writeFileSync(tempFile, JSON.stringify(files));

            return tempFile;
        }

        this.data.files.forEach(function(fset)
        {
            var svg = grunt.file.expand(fset, fset.src);

            svg.forEach(function(svg)
            {
                var src = path.resolve(svg),
                    dest,
                    settings;

                if (fset.dest) {
                    dest = path.resolve(fset.dest) + '/' + path.basename(svg);
                } else {
                    dest = src;
                }

                settings = {
                    src: src,
                    dest: dest.replace(/\.svg$/i, '.png')
                };

                files.push(settings);
            });

            total = files.length;
        });

        grunt.log.subhead('Rasterizing SVG to PNG (' + files.length + ' files)...');

        var styles = {

            'bold'          : ['\x1B[1m',  '\x1B[22m'],
            'italic'        : ['\x1B[3m',  '\x1B[23m'],
            'underline'     : ['\x1B[4m',  '\x1B[24m'],
            'inverse'       : ['\x1B[7m',  '\x1B[27m'],
            'strikethrough' : ['\x1B[9m',  '\x1B[29m'],

            'white' : ['\x1B[37m', '\x1B[39m'],
            'grey'  : ['\x1B[90m', '\x1B[39m'],
            'black' : ['\x1B[30m', '\x1B[39m'],

            'blue'    : ['\x1B[34m', '\x1B[39m'],
            'cyan'    : ['\x1B[36m', '\x1B[39m'],
            'green'   : ['\x1B[32m', '\x1B[39m'],
            'magenta' : ['\x1B[35m', '\x1B[39m'],
            'red'     : ['\x1B[31m', '\x1B[39m'],
            'yellow'  : ['\x1B[33m', '\x1B[39m']

        };

        var style = function(str, format)
        {
            return styles[format][0] + str + styles[format][1];
        };

        var update = function()
        {
            if (!total) {
                return;
            }

            var str = '',
                arr = [],
                count = total,
                percent = ((100 / total) * completed).toFixed(2);

            str += style('.', 'green');

            if (completed == count) {
                str += style('\n>> ', 'green') + ((new Date() - start) / 1000).toFixed(1) + 's';
            }

            process.stdout.write(str);
        };

        var spawn = grunt.util.spawn({
            cmd: phantomjs.path,
            args: [
                    path.resolve(__dirname, 'lib/svg2png.js'),
                    writeTemporaryFile()
                ]
            },
            function(err, result, code)
            {
                grunt.log.write('\n');
                grunt.log.ok('Rasterization complete.');
                done();
            }
        );

        spawn.stdout.on('data', function(buffer)
        {
            try {
                var result = JSON.parse(buffer.toString());

                if (result.status) {
                    completed++;
                    update();
                }
            } catch (e) { }
        });

        update();
    });
};
