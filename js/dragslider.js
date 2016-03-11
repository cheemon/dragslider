(function ($) {
    var MOUSEWHEEL = 'mousewheel';
    var distance = 0,
        wheel = 40,
        start = 0,
        axisX = 0;
    var _this;
    if ("onmousewheel" in document) {
        MOUSEWHEEL = "mousewheel"
    } else {
        MOUSEWHEEL = "DOMMouseScroll"
    }
    var ScreenShots = function (element, options) {
        _this = this;
        this.element = $(element);
        this.options = options;
        this.$ul = this.element.find('ul'),
            this.$scroll = $('<div class="screenshots-scroll"><div></div></div>'),
            this.$scrollDiv = this.$scroll.find("div");
        this.ratio = (this.$ul.find('img').size() * (options.width + options.space) - options.space) / options.wrapWidth;
        if (this.ratio < 1) {
            this.$scroll.hide();
        }
        if (!this.element.find("img").size()) {
            this.element.hide();
        }
        if (this.$ul.size()) {
            var imgsize = this.$ul.find('img').size();
            var ulWidth = imgsize * (options.width + options.space);
            var percent = options.wrapWidth / (ulWidth - options.space);
            this.$ul.css({width: ulWidth + "px", left: 0});
            this.$ul.find('li').css({
                width: options.width + "px",
                height: options.height + "px",
                "margin-right": options.space + 'px'
            });
            this.$scrollDiv.css({width: 100 * percent + "%", left: "0px"});
            this.element.css({width: options.wrapWidth + "px", display: "block"}).addClass("screenshots-container");
            this.$scroll.appendTo(this.$ul.parent());


            //滚动条拖动
            this.$scrollDiv.on("mousedown", (function (e) {
                _this.mouseDownEvent(e);
            }));
            //滚动事件
            this.element.on(MOUSEWHEEL, function (e) {
                _this.scrollEvent(e);
            });


        }


    };
    ScreenShots.prototype = {
        construtor: ScreenShots,
        mouseDownEvent: function (e) {
            start = e.pageX;
            axisX = _this.$scrollDiv.offset().left;
            $(document).bind("mousemove", _this.mouseMoveEvent);
            $(document).bind("mouseup", _this.mouseUpEvent);
        },
        mouseMoveEvent: function (e) {
            (e || window.event).preventDefault();
            var nowDistance = 0;
            if (_this.ratio >= 1) {
                nowDistance = Math.min(_this.$scroll.width() - _this.$scrollDiv.width(), Math.max(0, axisX + (e.pageX - start))),
                    distance = nowDistance * _this.ratio;
                _this.$ul.css('left', -distance);
                _this.$scrollDiv.css('left', nowDistance);
            }
        },
        mouseUpEvent: function (e) {
            $(document).unbind("mousemove", _this.mouseMoveEvent);
            $(document).unbind("mouseup", _this.mouseUpEvent);
            $(_this.$scrollDiv).unbind("mouseup", _this.mouseUpEvent);
        },
        scrollEvent: function (e) {
            var e = e || window.event;
            e.preventDefault();
            if (_this.ratio >= 1) {

                var event = e || e.event,
                    delta = event.originalEvent.wheelDelta ?
                    event.originalEvent.wheelDelta / 120 : -event.originalEvent.detail / 3;
                distance -= delta * wheel,
                    distance = Math.min(_this.$ul.width() - _this.options.wrapWidth - _this.options.space, Math.max(0, distance)),
                    _this.$scrollDiv.css('left', distance / _this.ratio),
                    _this.$ul.css('left', -distance);


            }
        }
    };

    $.fn.screenshots = function (option) {
        return this.each(function () {
            var $this = $(this),
                options = typeof option === 'object' && option;

            new ScreenShots(this, $.extend({}, $.fn.screenshots.defaults, options));

        });
    };
    $.fn.screenshots.Constructor = ScreenShots;
    $.fn.screenshots.defaults = {
        width: 259,//图片宽度
        height: 460,//图片高度
        space: 20,//图片之间的距离
        wrapWidth: 1010//所有图片父容器的宽度
    };

})(jQuery);