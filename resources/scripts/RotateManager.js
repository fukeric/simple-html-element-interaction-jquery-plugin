(function (window, $, undefined) {
    
    var document = window.document;
    
    document.createRotateManager = (function (element) {
        return new (function RotateManager() {
            
            var context = this;
            
            var pressAngle = null;
            var moveAngle = null;
            
            var rotateHandler = $(document.createElement('div')).addClass('rotateHandler').appendTo(element);
            var degreePrinter = $(document.createElement('span')).addClass('degreePrinter').text('0').appendTo(element);

            this.angle = null;
            
            function mousePress(event) {
                event.preventDefault();
                event.stopImmediatePropagation(); 
                
                var boundBox = element.getBoundingClientRect(); 
                
                var centerX = boundBox.left + (boundBox.width / 2);
                var centerY = boundBox.top + (boundBox.height / 2);

                pressAngle = moveAngle = Math.atan2(event.pageY - centerY, event.pageX - centerX);

                $(document)
                    .bind('mousemove', mouseMove)
                    .bind('mouseup', mouseRelease)
            }

            function mouseRelease() { 
            
                context.angle = (moveAngle - pressAngle) + context.angle;
                
                $(document)
                    .unbind('mousemove', mouseMove)
                    .unbind('mouseup', mouseRelease)
            } 
            
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
            
            function mouseMove(event) {
                // 중심점 구하기
                var boundBox = element.getBoundingClientRect(); 
                
                var centerX = boundBox.left + (boundBox.width / 2);
                var centerY = boundBox.top + (boundBox.height / 2);

                var width = $(element).width();
                var height = $(element).height(); 
                
                var angle = (moveAngle - pressAngle) + context.angle;
                var degree = Math.round(angle * (180 / Math.PI)); 
                
                element.style.transform = getCurrentMatrix().setRotation(angle, [ width / 2, height / 2 ]).toCSSTransform();
                
                moveAngle = Math.atan2(event.pageY - centerY, event.pageX - centerX);
                
                degreePrinter.text(degree);
            }
            
            rotateHandler.bind('mousedown', mousePress)
        });
    });
    
})(this, jQuery);