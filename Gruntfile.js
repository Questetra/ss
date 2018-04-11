module.exports = function(grunt) {
    grunt.registerTask('default', 'My "default" task description.', function() {
        grunt.log.writeln('現在、"default"タスクを実行中…');

        var items = [];
        var md = "";
        grunt.file.recurse('manual', function(abspath, rootdir, subdir, filename) {
            grunt.log.writeln(abspath, rootdir, subdir, filename);

            var m = filename.match(/((M[0-9][0-9][0-9])-([0-9].*?))\.[png|gif|jpg]/);
            var code = m[1];
            var num = m[3];

            grunt.log.writeln(m);

            var item = {
                id: filename.toLowerCase(),
                code: code,
                number: num,
                url: 'https://questetra.github.io/ss/manual/' + filename
            }

            items.push(item);
            md += "\n- " + '[' + code + '](https://questetra.github.io/ss/manual/' + filename + ' "' + code + '") : '  + filename;
        })
        grunt.file.write('list.json', JSON.stringify(items, null, 2));


        grunt.file.write('list.md', md);
    });




};