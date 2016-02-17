(function($){
    $.fn.screenshots=function(width,height,space,wrapWidth,top){
        var $this=$(this),
            $ul=$this.find('ul'),
            $scroll=$('<div class="screenshots-scroll"><div></div></div>'),
            $scrollDiv = $scroll.find("div");

        var MOUSEWHEEL='mousewheel';
        var distance=0,
            wheel=40,
            ratio=($ul.find('img').size()*(width+space)-space)/wrapWidth,
            start= 0,
            axisX=0;
        if("onmousewheel" in document){
            MOUSEWHEEL='mousewheel';
        }else{
            MOUSEWHEEL='DOMMouseScroll';
        }
        function mouseDownEvent(e){
            start= e.pageX;
            axisX=$scrollDiv.offset().left;
            $(document).bind("mousemove",mouseMoveEvent);
            $(document).bind("mouseup", mouseUpEvent);
        }
        function mouseMoveEvent(e){
            (e||window.event).preventDefault();
            var nowDistance=0;
            if(ratio>=1){
                nowDistance= Math.min($scroll.width() - $scrollDiv.width(),Math.max(0,axisX+(e.pageX-start))),
                distance =nowDistance * ratio;
                $ul.css('left', -distance);
                $scrollDiv.css('left', nowDistance);
             }
        }
        function mouseUpEvent(e){
              $(document).unbind("mousemove", mouseMoveEvent),
                $(document).unbind("mouseup", mouseUpEvent),
                $scrollDiv.unbind("mouseup", mouseUpEvent);
        }
        function scrollEvent(e) {
            if(ratio>=1){
                var event=e|| e.event,
                delta = event.originalEvent.wheelDelta ?
                event.originalEvent.wheelDelta / 120 : -event.originalEvent.detail / 3;
                distance -= delta * wheel,
                distance = Math.min($ul.width()-wrapWidth-space, Math.max(0, distance)),
                $scrollDiv.css('left', distance /ratio),
                $ul.css('left', -distance);

                e.preventDefault();
            }
        }
            if($ul.size()){
                var imgsize=$ul.find('img').size();
                var ulWidth=imgsize*(width+space);
                var percent=wrapWidth/(ulWidth-space);
                var scrollLeft=0;
                console.log('a'+percent);
                $ul.css({width:ulWidth+"px",left:0});
                $ul.find('li').css({width:width+"px",height:height+"px","margin-right":space+'px'});
                $scrollDiv.css({width:100*percent+"%",left:"0px"});
                $this.css({width: wrapWidth+"px",display: "block"}).addClass("screenshots-container");
                $scroll.appendTo($ul.parent());

                //滚动条拖动
                $scrollDiv.on("mousedown",function(e){
                    mouseDownEvent(e);
                });
                //滚动事件
                $this.on(MOUSEWHEEL,function(e){
                    var e = e || window.event;
                    e.preventDefault && e.preventDefault();
                    scrollEvent(e);
                });

            }

    }
})(jQuery);