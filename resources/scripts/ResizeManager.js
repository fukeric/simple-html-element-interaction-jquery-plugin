(function (window, $, undefined) {
    
    var document = window.document;
    
    document.createResizeManager = function (rotateManager, element) {
        return new (function ResizeManager (){
            
            var topRightHandler     = $(document.createElement('div')).addClass('resizeHandler topRightHandler').appendTo(element);
            var topCenterHandler    = $(document.createElement('div')).addClass('resizeHandler topCenterHandler').appendTo(element);
            var topLeftHandler      = $(document.createElement('div')).addClass('resizeHandler topLeftHandler').appendTo(element);
            
            var centerRightHandler  = $(document.createElement('div')).addClass('resizeHandler centerRightHandler').appendTo(element);
            var centerLeftHandler   = $(document.createElement('div')).addClass('resizeHandler centerLeftHandler').appendTo(element);
            
            var bottomRightHandler  = $(document.createElement('div')).addClass('resizeHandler bottomRightHandler').appendTo(element);
            var bottomCenterHandler = $(document.createElement('div')).addClass('resizeHandler bottomCenterHandler').appendTo(element);
            var bottomLeftHandler   = $(document.createElement('div')).addClass('resizeHandler bottomLeftHandler').appendTo(element);
            
            var widthPrinter        = $(document.createElement('span')).addClass('widthPrinter').appendTo(element).text($(element).width());
            var heightPrinter       = $(document.createElement('span')).addClass('heightPrinter').appendTo(element).text($(element).height());
            
            var moveEvent;
            var resizeHandler;
            
            function getCurrentMatrix() {
                var computedStyle = window.getComputedStyle(element, null);

                var currentMatrix = computedStyle.getPropertyValue("-webkit-transform") ||
                                    computedStyle.getPropertyValue("-moz-transform") ||
                                    computedStyle.getPropertyValue("-ms-transform") ||
                                    computedStyle.getPropertyValue("-o-transform") ||
                                    computedStyle.getPropertyValue("transform") ||
                                    null;
                
                currentMatrix = String(currentMatrix)
                        .replace('matrix(', '').replace(')', '').replace(' ', '');
                
                currentMatrix = currentMatrix.split(',');
            
                return Matrix([
                    parseFloat(currentMatrix[0], 10) || 1,
                    parseFloat(currentMatrix[1], 10) || 0,
                    parseFloat(currentMatrix[2], 10) || 0,
                    parseFloat(currentMatrix[3], 10) || 1,
                    parseFloat(currentMatrix[4], 10) || 0,
                    parseFloat(currentMatrix[5], 10) || 0,
                ])
            }

            // 마우스 누르면 이벤트장착
            function mousePress(event) {
                event.preventDefault(); // 드래그, 클릭, 등등 하위이벤트 들을 무시함 
                event.stopImmediatePropagation();
                
                moveEvent = event;
                resizeHandler = event.target;

                $(document)
                    .bind('mousemove', mouseMove)
                    .bind('mouseup', mouseRelease)
            }

            function mouseRelease() {

                $(document)
                    .unbind('mousemove', mouseMove)
                    .unbind('mouseup', mouseRelease)
            }

            function mouseMove(event) {
                
                var angle = rotateManager.angle; 

                var moveX = event.pageX - moveEvent.pageX; 
                var moveY = event.pageY - moveEvent.pageY;

                var deltaX = Math.round(moveX * Math.cos(angle) + moveY * Math.sin(angle));
                var deltaY = Math.round(moveY * Math.cos(angle) - moveX * Math.sin(angle)); 
                
                var newWidth = $(element).width();
                var newHeight = $(element).height();
                
                var currentMatrix = getCurrentMatrix()
                
                if(topLeftHandler.is(resizeHandler)) {
                    newWidth -= deltaX;
                    newHeight -= deltaY;
                
                    currentMatrix = currentMatrix.translate(deltaX, deltaY);
                }
                else if(topCenterHandler.is(resizeHandler)) { 
                    newHeight -= deltaY;
                
                    currentMatrix = currentMatrix.translate(0, deltaY);
                }
                else if(topRightHandler.is(resizeHandler)) {
                    newWidth += deltaX;
                    newHeight -= deltaY;
                
                    currentMatrix = currentMatrix.translate(0, deltaY);
                }
                else if(centerRightHandler.is(resizeHandler)) {
                    newWidth += deltaX;
                }
                else if(centerLeftHandler.is(resizeHandler)) {
                    newWidth -= deltaX;
                    
                    currentMatrix = currentMatrix.translate(deltaX, 0);
                }
                else if(bottomRightHandler.is(resizeHandler)) {
                    newWidth += deltaX;
                    newHeight += deltaY;
                }
                else if(bottomCenterHandler.is(resizeHandler)) {
                    newHeight += deltaY;
                }
                else if(bottomLeftHandler.is(resizeHandler)) {
                    newWidth -= deltaX;
                    newHeight += deltaY; 
                    
                    currentMatrix = currentMatrix.translate(deltaX, 0);
                }
                
                moveEvent = event; 
                
                if (newWidth < 20 || newHeight < 20) {
                    return;
                }
                
                element.style.width = newWidth + 'px';
                element.style.height = newHeight + 'px'; 
                
                widthPrinter.text(newWidth);
                heightPrinter.text(newHeight);

                element.style.transform = currentMatrix.toCSSTransform();
            }
            
            topRightHandler.bind('mousedown', mousePress)
            topCenterHandler.bind('mousedown', mousePress)
            topLeftHandler.bind('mousedown', mousePress)
            
            centerLeftHandler.bind('mousedown', mousePress)
            centerRightHandler.bind('mousedown', mousePress)
            
            bottomRightHandler.bind('mousedown', mousePress)
            bottomCenterHandler.bind('mousedown', mousePress)
            bottomLeftHandler.bind('mousedown', mousePress)
        });
    }
    
})(this, jQuery);