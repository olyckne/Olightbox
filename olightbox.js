( function( $ ) {

	"use strict";

	/*
		CLASS
	 */
	var Olightbox = function(element, options) {
		var that = this;
		this.$element = $(element);
		this.fetchUrl = this.$element.attr("href");
		this.overlay = $("<div />");
		this.lightbox = $("<div />").addClass("olightbox-wrapper");
		this.contentWrapper = $("<div />").addClass("olightbox-content-wrapper");
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
			
			if(this.isImage(this.fetchUrl)) {
				this.content.attr("src", this.fetchUrl)
					.load( function() {
						$(this).fadeIn();
						that.lightbox.css({
							left: (that.dimension.width-that.lightbox.width())/2,
							top: (that.dimension.height-that.lightbox.height())/2
						});
					});
			}
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
			console.log("remove");
			console.log(this);
			$("."+this.options.elements.overlay.className).remove();
			this.lightbox.remove();
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
		var $this = $(this),
			target = $this.attr("data-target") || $this.attr("href"),
			option = {target: target};


		$this.olightbox(option);

		event.preventDefault();
	});
})(jQuery);	