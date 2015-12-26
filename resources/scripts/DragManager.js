(function (window, $, undefined) {
    
    var document = window.document;
    
    document.createDragManager = function (element) {
        return new (function DragManager() {
            
            var moveEvent = null;
            
            // 마우스 누르면 이벤트장착
            function mousePress(event) {
                
                moveEvent = event;

                $(document)
                    .bind('mousemove', mouseMove)
                    .bind('mouseup', mouseRelease)
            }

            // 마우스 떼면 이벤트해제
            function mouseRelease() {
                $(document)
                    .unbind('mousemove', mouseMove)
                    .unbind('mouseup', mouseRelease)
            }

            function mouseMove(event) {
                var left = parseInt(element.style.left, 10) || 0; // 젤첨엔 포지션값이 없을거라... 대체값 0 추가
                var top = parseInt(element.style.top, 10) || 0; // 젤첨엔 포지션값이 없을거라... 대체값 0 추가

                // ((현재이벤트 - 이전이벤트) = 움직인거리)
                var moveX = event.pageX - moveEvent.pageX;
                var moveY = event.pageY - moveEvent.pageY;

                // 움직인거리 + 현재엘리멘트 위치에 더함
                element.style.left = (left + moveX) + 'px'; 
                element.style.top = (top + moveY) +'px';

                moveEvent = event;
            }

            $(element)
                .css('position', 'absolute')
                .bind('mousedown', mousePress)

        });
    }
    
})(this, jQuery);