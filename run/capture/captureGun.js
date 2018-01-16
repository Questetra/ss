module.exports = {
    addTrigger: function(msg, sec) {
        var $ = jQuery;

        var $btn = $('<button />')
            .attr('type', 'button')
            .html('Ready')
            .attr('id', 'capture-trigger-btn');

        var $trigger = $('<div />');

        var dispMsg = msg;
        var bgColor = "rgba(0,0,0,0.5)";
        var fontColor = "white";
        if (typeof sec === "number") {
            dispMsg += " : Timer " + sec + "sec";
            bgColor = "rgba(255,165,0,0.5)";
            fontColor = "white";
        }

        let scroll = $(window).scrollTop();

        $trigger
            .addClass("capture-trigger-item")
            .addClass("capture-trigger-item-wrapper")
            .css("position", "absolute")
            .css("top", (scroll + 2 ) + "px")
            .css("right", "2px")
            .css("backgroundColor", bgColor)
            .css("borderRadius", "2px")
            .css("textAlign", "right")
            .css("padding", "2px")
            .css("z-index", 99999)
            .append('<div id="capture-trigger-watcher" style="color:' + fontColor + ';">' + dispMsg + '</div>')
            .append($btn);
            

        $('body')
            .css("position", "relative")
            .append($trigger);

        $('#capture-trigger-btn').on('click', function() {
            $(this).remove();
            if (typeof sec === "number") {
                $(".capture-trigger-item-wrapper").css("backgroundColor", 'rgba(255,0,0,0.5)')
                setTimeout(function() {
                    $(".capture-trigger-item-wrapper").css("backgroundColor", 'red')
                }, (sec - 1) * 1000);
                setTimeout(function() {
                    $("#capture-trigger-watcher").html("go");
                }, sec * 1000);
            } else {
                $("#capture-trigger-watcher").html("go");
            }

        });

        return;
    },
    removeTrigger: function() {
        var $ = jQuery;
        $(".capture-trigger-item").remove();
        return;
    },
    waitUntil: function(client) {
        var watcherText = client.getText('#capture-trigger-watcher');
        return client.getText('#capture-trigger-watcher').should.eventually.be.equal('go');
    }
};