( function( $ ) {

	"use strict";

	/*
		CLASS
	 */
	var Olightbox = function(element, options) {
		var that = this;
		this.$element = $(element);
		this.fetchUrl = this.$element.attr("href");
		this.lightbox = $("<div />").addClass("olightbox-wrapper");
		this.contentWrapper = $("<div />").addClass("olightbox-content-wrapper");
		this.content = $("<img />");
		this.dimension = {
						width: window.innerWidth || $(window).width(),
						height: window.innerHeight || $(window).height()
						};
		console.log(this.dimension);
		this.options = $.extend({}, $.fn.olightbox.defaults, options);

	};

	Olightbox.prototype = {
		Constructor	: Olightbox,

		show : function() {
			var that = this;
			var overlay = $("<div />")
				.addClass(this.options.elements.overlay.className)
				.hide()
				.appendTo("body")
				.fadeIn();

			$("<div />")
				.addClass(this.options.elements.loader.className)
				.appendTo(overlay);
			this.content.hide().attr("src", this.fetchUrl)
				.load( function() {
					console.log("done");
					$(this).fadeIn();
					that.lightbox.css({
						"left": (that.dimension.width-that.lightbox.width())/2,
						"top": (that.dimension.height-that.lightbox.height())/2 
					});
				}).fadeIn().appendTo(this.contentWrapper);

			this.contentWrapper.appendTo(this.lightbox);
			this.lightbox.hide().appendTo("body").fadeIn();

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