const colors = [
    '#d32f2f',
    '#512da8',
    '#0288d1',
    '#388e3c',
    '#fbc02d',
    '#e64a19',
    '#7b1fa2',
    '#1976d2',
    '#00796b',
    '#afb42b',
    '#f57c00',
    '#c2185b',
    '#303f9f',
    '#0097a7',
    '#689f38',
    '#ffa000'
];

const position = {
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    RIGHT: "right",
    TOP_RIGHT: "top-right",
    TOP_LEFT: "top-left",
    BOTTOM_LEFT: "bottom-left",  
    BOTTOM_RIGHT: "bottom-right"
}

const Annotation = {
	clear:function(){
        var $ = jQuery;
		$(".annotation-item").remove();
	},
    title:function(position, text){
        var $ = jQuery;
        let logs = [];
        logs.push("title");

        let scroll = $("body").scrollTop();

        let fontColor = "#fff9c4";
        let borderingColor = "#000a12";
        let fontSize = 75;
        let marginLeft = 40;
        let marginRight = 40;
        let marginTop = 0;
        let marginBottom = 0;
        let paddingLeft = 5;
        let paddingRight = 5;
        let paddingTop = 5;
        let paddingBottom = 5;
        let borderingWidth = 5;


        let titleTop = 0;

        let $titleFront = $('<div/>');
        $titleFront
            .addClass("annotation-item")
            .html(text)
            .css("position", "absolute")
            .css("font-size", fontSize + "px")
            .css("font-weight", "bold")
            .css("line-height", "1.1em")
            .css("color", fontColor)
            .css("z-index", 99999);

        $("body")
            .css("position", "relative");

        switch(position){
            case "bottom-left":
                $titleFront
                    .css("bottom", (scroll + marginTop + paddingTop + borderingWidth) + "px")
                    .css("left", (scroll + marginRight + paddingRight + borderingWidth) + "px")
                    .css("text-align" , "left");
                $("body")
                    .append($titleFront);
                for(var deg = 0; deg < 360; deg+=12){
                    var s = Math.sin(deg * (Math.PI / 180));
                    var c = Math.cos(deg * (Math.PI / 180));

                    var $titleBack = $("<div />");
                    $titleBack
                        .addClass("annotation-item")
                        .html(text)
                        .css("position", "absolute")
                        .css("font-size", fontSize + "px")
                        .css("font-weight", "bold")
                        .css("line-height", "1.1em")
                        .css("color", borderingColor)
                        .css("z-index", 9999)
                        .css("bottom", (scroll + marginTop + paddingTop + borderingWidth + (borderingWidth * s)) + "px")
                        .css("left", (scroll + marginRight + paddingRight + borderingWidth + (borderingWidth * c)) + "px")
                        .css("text-align" , "left");
                    $("body")
                        .append($titleBack);
                }
                break; 
            default:
                $titleFront
                    .css("top", (scroll + marginTop + paddingTop + borderingWidth) + "px")
                    .css("right", (scroll + marginRight + paddingRight + borderingWidth) + "px")
                    .css("text-align" , "right");
                $("body")
                    .append($titleFront);
                for(var deg = 0; deg < 360; deg+=12){
                    var s = Math.sin(deg * (Math.PI / 180));
                    var c = Math.cos(deg * (Math.PI / 180));

                    var $titleBack = $("<div />");
                    $titleBack
                        .addClass("annotation-item")
                        .html(text)
                        .css("position", "absolute")
                        .css("font-size", fontSize + "px")
                        .css("font-weight", "bold")
                        .css("line-height", "1.1em")
                        .css("color", borderingColor)
                        .css("z-index", 9999)
                        .css("top", (scroll + marginTop + paddingTop + borderingWidth + (borderingWidth * s)) + "px")
                        .css("right", (scroll + marginRight + paddingRight + borderingWidth + (borderingWidth * c)) + "px")
                        .css("text-align" , "right");
                    $("body")
                        .append($titleBack);
                }
                break;
        }

        return logs;
    },
    rectangle: function(target, _text, _color, _borderWidth, _radius, _padding) {
        var $ = jQuery;

        let logs = [];
        logs.push("rectangle");
        logs.push("target:" + target + ", borderWidth:" + _borderWidth + ", color:" + _color + ", radius:" + _radius + ", padding:" + _padding);

        let targetOffset, targetWidth, targetHeight, targetPaddingTop, targetPaddingBottom;
        let borderWidth = 10;
        let borderColor = "#FF0000";
        let radius = 15;
        let rectPaddingTop = 5;
        let rectPaddingBottom = 5;
        let rectPaddingLeft = 5;
        let rectPaddingRight = 5;
        let fuchidori = 2;

        if (typeof target === "string") {
            targetOffset = $(target).offset(); // padding含 margin含まない
            targetWidth = $(target).outerWidth(false); // padding含 margin含まない
            targetHeight = $(target).outerHeight(false); // padding含 margin含まない
            targetPaddingTop = parseInt($(target).css('padding-top'), 10);
            targetPaddingLeft = parseInt($(target).css('padding-left'), 10);
            targetPaddingBottom = $(target).css('padding-bottom');
        }

        if (typeof _borderWidth === "number") {
            borderWidth = _borderWidth;
        }

        if (typeof _color === "string") {
            borderColor = _color;
        }

        if (typeof _radius === "number") {
            radius = _radius;
        }

        if (typeof _padding === "number") {
            rectPaddingTop = _padding;
            rectPaddingBottom = _padding;
            rectPaddingLeft = _padding;
            rectPaddingRight = _padding;

        }else if(_padding instanceof Array){
            rectPaddingTop = _padding[1];
            rectPaddingBottom = _padding[3];
            rectPaddingLeft = _padding[0];
            rectPaddingRight = _padding[2];
        }

        let rectTop = targetOffset.top - targetPaddingTop - rectPaddingTop - borderWidth;
        let rectLeft = targetOffset.left - targetPaddingLeft - rectPaddingLeft - borderWidth;
        let rectHeight = targetHeight + rectPaddingTop + rectPaddingBottom + borderWidth;
        let rectWidth = targetWidth + rectPaddingLeft + rectPaddingRight + borderWidth;

        logs.push(rectTop + ", " + rectLeft + ", " + rectHeight + ", " + rectWidth + ", " + borderWidth);

        var $rectangleB = $('<div/>');
        $rectangleB
            .css("border", (borderWidth + fuchidori * 2) + "px solid white")
            .css("top", rectTop - fuchidori)
            .css("left", rectLeft - fuchidori)
            .css("width", rectWidth - fuchidori * 2)
            .css("height", rectHeight - fuchidori * 2)
            .css("position", "absolute")
            .css("z-index", 9999)
            .css("border-radius", radius + fuchidori)
            .addClass("annotation-item");

        // 
        var $rectangle = $('<div/>');
        $rectangle
            .css("border", borderWidth + "px solid " + borderColor)
            .css("top", rectTop)
            .css("left", rectLeft)
            .css("width", rectWidth)
            .css("height", rectHeight)
            .css("position", "absolute")
            .css("z-index", 99999)
            .css("border-radius", radius)
            .addClass("annotation-item");

        $("body")
            .css("position", "relative")
            .append($rectangleB)
            .append($rectangle);

        let rectPoint = {
            top: rectTop + borderWidth / 2,
            left: rectLeft,
            right: rectLeft + rectWidth + borderWidth + borderWidth / 2,
            bottom: rectTop + rectHeight + borderWidth + borderWidth / 2
        }

        // ----------------------------------------

        let text = null;
        let stickyPosition = "top-right";
        let stickyId = "annotation-item-sticky-" + ($(".annotation-item-sticky").size() + 1);

        if (typeof _text === "string") {
            text = _text;
        } else if (typeof _text === "object") {
            text = _text.text;
            stickyPosition = _text.position;
        }

        if (text) {
            logs.push(_text + typeof _text);
            var $sticky = $("<div/>");
            $sticky
                .addClass("annotation-item-sticky")
                .addClass("annotation-item")
                .attr("id", stickyId)
                .html(text)
                .css("font-size", 40)
                .css("line-height", 1.5)
                .css("vertical-align", "-50%")
                .css("color", "white")
                .css("padding-left", 20)
                .css("padding-right", 20)
                .css("font-weight", "bold")
                .css("background-color", borderColor)
                .css("position", "absolute")
                .css("z-index", 99999)
                .css("border-radius", 9999)
                .css("top", 0)
                .css("left", 0);

            $("body")
                .css("position", "relative")
                .append($sticky);
                

            var stickyWidth = $("#" + stickyId).outerWidth(false);
            var stickyHeight = $("#" + stickyId).outerHeight(false);

            switch (stickyPosition) {
                case "top":
                    $("#" + stickyId).css("top", rectPoint.top - stickyHeight + borderWidth / 2);
                    $("#" + stickyId).css("left", ((rectPoint.right - rectPoint.left) - stickyWidth) / 2 + rectPoint.left);
                    break;
                case "bottom":
                    $("#" + stickyId).css("top", rectPoint.bottom - borderWidth / 2);
                    $("#" + stickyId).css("left", ((rectPoint.right - rectPoint.left) - stickyWidth) / 2 + rectPoint.left);
                    break;
                case "left":
                    $("#" + stickyId).css("top", ((rectPoint.bottom - rectPoint.top) - stickyHeight) / 2 + rectPoint.top);
                    $("#" + stickyId).css("left", rectPoint.left - stickyWidth + borderWidth);
                    $("#" + stickyId).css("border-radius", "9999px " + borderWidth + "px " + borderWidth + "px 9999px");
                    break;
                case "right":
                    $("#" + stickyId).css("top", ((rectPoint.bottom - rectPoint.top) - stickyHeight) / 2 + rectPoint.top);
                    $("#" + stickyId).css("left", rectPoint.right);
                    $("#" + stickyId).css("border-radius", borderWidth + "px 9999px 9999px " + borderWidth + "px");
                    break;
                case "top-left":
                    $("#" + stickyId).css("top", rectPoint.top - stickyHeight / 2);
                    $("#" + stickyId).css("left", rectPoint.left - stickyWidth + stickyHeight / 2);
                    break;
                case "bottom-left":
                    $("#" + stickyId).css("top", rectPoint.bottom - stickyHeight / 2);
                    $("#" + stickyId).css("left", rectPoint.left - stickyWidth + stickyHeight / 2);
                    break;
                case "bottom-right":
                    $("#" + stickyId).css("top", rectPoint.bottom - stickyHeight / 2);
                    $("#" + stickyId).css("left", rectPoint.right - stickyHeight / 2);
                    break;
                default:
                    $("#" + stickyId).css("top", rectPoint.top - stickyHeight / 2);
                    $("#" + stickyId).css("left", rectPoint.right - stickyHeight / 2);
                    break;
            }
        }



        return logs;
    }
}

module.exports = {
    Annotation: Annotation,
    COLORS: colors,
    POSITION: position
}