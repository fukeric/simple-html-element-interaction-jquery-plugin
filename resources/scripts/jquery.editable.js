(function(window, $){
    
    var document = window.document;
    
    var defaults = {
        draggable : true,
        resizable : true,
        rotatable : true,
    };
        
    $.fn.editable = function (options) {
        
        options = $.extend({}, defaults, options);

        return this.each(function () {
            
            var element = this; 
            var rotateManager = { angle: 0 };
            
            if(options.draggable) {
                document.createDragManager(element);
            }
            
            if(options.rotatable) {
                rotateManager = document.createRotateManager( element);
            }
            
            if(options.resizable) {
                document.createResizeManager(rotateManager, element);
            }
        });
    }
        
        
})(this, jQuery);