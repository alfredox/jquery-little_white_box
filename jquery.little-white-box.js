/* global jQuery: true*/
//
// Using the plugin pattern in: https://github.com/nitinhayaran/jquery-plugin-pattern/blob/master/jquery.plugin.pattern.js

;
(function($, window, document, undefined) {
  'use strict';

  // Create the defaults once
  var pluginName = 'littleWhiteBox',
      defaults = {
        arrowSide: 'right',  // other values: bottom, left, top
        arrowPosition: 'center', // other values: top, bottom (for left and right side), left, right (for top and bottom side)
        placeOnClick: false, // this options means that the object will be placed on the space of the click
        triggerSelector: null
      };

  // The actual plugin constructor

  function Plugin(element, options) {
    this.element = element;
    this.$el = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    // instance vars
    this.totalWidth = null ;
    this.totalHeight = null ;
    this.verticalFactor = 0.5 ;
    this.horizontalFactor = 0.5 ;
    // initialization
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.$el.hide().addClass('lwb-class') ;
      
      // adds clases for arrows (and calculates position factors) depending on side and position
      // RIGHT
      if ( this.options.arrowSide == 'right') {
        if ( this.options.arrowPosition == 'top') {
          this.$el.addClass('lwb-arrow-right').addClass('lwb-20-pct') ;
          this.verticalFactor = 0.2 ;
        }
        else if ( this.options.arrowPosition == 'bottom') {
          this.$el.addClass('lwb-arrow-right').addClass('lwb-80-pct') ;
          this.verticalFactor = 0.8 ;
        }
        else {
          this.$el.addClass('lwb-arrow-right') ;
          this.verticalFactor = 0.5 ;
        }
      }
      // BOTTOM
      else if ( this.options.arrowSide == 'bottom') {
        if ( this.options.arrowPosition == 'left') {
          this.$el.addClass('lwb-arrow-bottom').addClass('lwb-20-pct') ;
          this.horizontalFactor = 0.2 ;
        }
        else if ( this.options.arrowPosition == 'right') {
          this.$el.addClass('lwb-arrow-bottom').addClass('lwb-80-pct') ;
          this.horizontalFactor = 0.8 ;
        }
        else {
          this.$el.addClass('lwb-arrow-bottom') ;
          this.horizontalFactor = 0.5 ;
        }
      }
      // LEFT
      else if ( this.options.arrowSide == 'left') {
        if ( this.options.arrowPosition == 'top') {
          this.$el.addClass('lwb-arrow-left').addClass('lwb-20-pct') ;
          this.verticalFactor = 0.2 ;
        }
        else if ( this.options.arrowPosition == 'bottom') {
          this.$el.addClass('lwb-arrow-left').addClass('lwb-80-pct') ;
          this.verticalFactor = 0.8 ;
        }
        else {
          this.$el.addClass('lwb-arrow-left') ;
          this.verticalFactor = 0.5 ;
        }
      }
      // TOP
      else if ( this.options.arrowSide == 'top') {
        if ( this.options.arrowPosition == 'left') {
          this.$el.addClass('lwb-arrow-top').addClass('lwb-20-pct') ;
          this.horizontalFactor = 0.2 ;
        }
        else if ( this.options.arrowPosition == 'right') {
          this.$el.addClass('lwb-arrow-top').addClass('lwb-80-pct') ;
          this.horizontalFactor = 0.8 ;
        }
        else {
          this.$el.addClass('lwb-arrow-top') ;
          this.horizontalFactor = 0.5 ;
        }
      }

      this.totalWidth = this.$el.outerWidth() ;
      this.totalHeight = this.$el.outerHeight() ;

      if (!!this.options.triggerSelector) {
        $(this.options.triggerSelector).click(this.clickCallback.bind(this)) ;
      }

    },
    clickCallback: function (e) {

      if (this.$el.is(':visible')) {
        this.$el.hide() ;
      }
      else {
        
        if (this.options.placeOnClick) {
          // place exactly where click was made
          this.showOn(e.pageX, e.pageY) ;
        }
        else {
          // place on the edge of the element
          // determine the origin point (where the pointer should be), based on the targe object and the side of the arrow
          var $target = $(e.currentTarget),
              offset = $target.offset(),
              width = $target.width(),
              height = $target.height(),
              x, y ;

          if ( this.options.arrowSide == 'right') {
            x = offset.left ;
            y = offset.top + $target.outerHeight() / 2 ;
          }
          else if ( this.options.arrowSide == 'bottom') {
            x = offset.left + $target.outerWidth() / 2 ;
            y = offset.top ;
          }
          else if ( this.options.arrowSide == 'left') {
            x = offset.left + $target.outerWidth() ;
            y = offset.top + $target.outerHeight() / 2 ;
          }
          else if ( this.options.arrowSide == 'top') {
            x = offset.left + $target.outerWidth() / 2 ;
            y = offset.top + $target.outerHeight() ;
          }
    
          this.showOn(x, y ) ; // in this point calculation, let's find out if should be height for the $target.
        }
      }
      // FIXME returns false to avoid propagation of event, perhaps should be optional via and option.
      return false ;
    },
    showOn: function (x, y) {
      var left, top ;
      if ( this.options.arrowSide == 'right') {
        left = x - (this.totalWidth + 12) ;
        top = y - (this.totalHeight * this.verticalFactor) ;
      }
      else if ( this.options.arrowSide == 'bottom') {
        left = x - (this.totalWidth * this.horizontalFactor) ;
        top = y - (this.totalHeight + 12) ;
      }
      else if ( this.options.arrowSide == 'left') {
        left = x + (12) ;
        top = y - (this.totalHeight * this.verticalFactor) ;
      }
      else if ( this.options.arrowSide == 'top') {
        left = x - (this.totalWidth * this.horizontalFactor) ;
        top = y + 12 ;
      }
  
      this.$el.css({left:left, top:top}) ;
      this.$el.show() ;
    }
  };


  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function(option) {
    var args = arguments,
        result;

    this.each(function() {
      var $this = $(this),
        data = $.data(this, 'plugin_' + pluginName),
        options = typeof option === 'object' && option;
      if (!data) {
        $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
      }
      // if first argument is a string, call silimarly named function
      // this gives flexibility to call functions of the plugin e.g.
      //   - $('.dial').plugin('destroy');
      //   - $('.dial').plugin('render', $('.new-child'));
      if (typeof option === 'string') {
        result = data[option].apply(data, Array.prototype.slice.call(args, 1));
      }
    });

    // To enable plugin returns values
    return result || this;
  };

})(jQuery, window, document);