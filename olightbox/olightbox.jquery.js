( function( $ ) {

	"use strict";

	/*
		CLASS
	 */
	var Olightbox = function(element, options) {
		var that = this;
		this.trigger = $(element);
		this.fetchUrl = this.trigger.attr("data-target") || this.trigger.attr("href");
		this.overlay = $("<div />");
		this.lightbox = $("<div />").addClass(this.options.elements.wrapper.className);
		this.contentWrapper = $("<div />").addClass(this.options.elements.contentWrapper.className);
		this.content = $("<img />");
		this.dimension = {
						width: window.innerWidth || $(window).width(),
						height: window.innerHeight || $(window).height()
						};
		this.options = $.extend({}, $.fn.olightbox.defaults, options);

	};

	Olightbox.prototype = {
		Constructor	: Olightbox,

		prepare : function() {
			var that = this;

			this.showLoader();

			this.buildContent();
			this.content.appendTo(this.contentWrapper);

			this.contentWrapper.appendTo(this.lightbox);
			this.lightbox.hide().appendTo("body");

		},

		showLoader : function() {
			this.overlay
				.addClass(this.options.elements.overlay.className)
				.hide()
				.appendTo("body");

			if(this.overlay.children("."+this.options.elements.loader.className).length === 0) {
				$("<div />")
					.addClass(this.options.elements.loader.className)
					.appendTo(this.overlay);
			}
		},

		buildContent : function() {
			var that = this,
				type = this.getContentType(this.fetchUrl);

			switch(type) {
				case "img":
					this.content.attr("src", this.fetchUrl)
						.load( function() {
							$(this).fadeIn();
							that.lightbox.css({
								left: (that.dimension.width-that.lightbox.width())/2,
								top: (that.dimension.height-that.lightbox.height())/2
							});
						});
					break;
				case "inline":
				
					break;
				default:
					break;

			}

		},

		show : function() {
			var that = this;
			
			this.prepare();
			this.overlay.show();
			this.lightbox.show();			
			
			this.bindToClose();
		},


		bindToClose : function() {
			var that = this;
			$("."+this.options.elements.overlay.className).on("click", function() {
				that.remove.apply(that);
			});

			$(document).on("keydown", function() {
				var key = event.key || event.which;
				if(key === 27) that.remove();
			});
		},

		remove	: function() {
			$("."+this.options.elements.overlay.className).remove();
			this.lightbox.remove();
		},
		
		getContentType : function(str) {
			var type = "html";

			if(this.isImage(str))
				type = "img";
			else if(str.charAt(0) === "#")
				type = "inline";

			return type;
		},

		isImage: function (str) {
			return typeof str === "string" && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i);
		}

	};

	/*
		PLUGIN
	 */
	$.fn.olightbox = function(option) {

		return this.each( function() {
			var $this = $(this),
				data = $this.data("olightbox"),
				options = $.extend({}, $.fn.olightbox.defaults, $this.data(), 
									typeof option == "object" && option);
			if(!data) $this.data("olightbox", (data = new Olightbox(this, options)));
			if( typeof option == "string") data[option]();
			else if(options.show) data.show();

		});
	};

	$.fn.olightbox.defaults = {
		"transition"	: "fadeIn",
		"trigger"		: "click",
		"show"			: true,
		'elements'		: {
			'overlay'	: {
				'className' : "olightbox-overlay"
			},
			'wrapper'	: {
				'className' : "olightbox-wrapper"
			},
			'contentWrapper' : {
				'className'	: 'olightbox-content-wrapper'
			},
			'loader' : {
				'className'	:	'olightbox-loader'
			}
		}
	};

	$.fn.olightbox.Constructor = Olightbox;
	/*
		
	 */

	$(document).on($.fn.olightbox.defaults.trigger+'.olightbox', '[data-toggle="olightbox"]', function(event) {
		$(this).olightbox();

		event.preventDefault();
	});
})(jQuery);	