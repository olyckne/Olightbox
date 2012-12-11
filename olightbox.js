( function( $ ) {

	"use strict";

	/*
		CLASS
	 */
	var Olightbox = function(element, options) {
		this.$element = $(element);
		this.fetchUrl = this.$element.attr("href");
		this.lightbox = $("<div />").addClass("olightbox-wrapper");
		this.contentWrapper = $("<div />").addClass("olightbox-content-wrapper");
		this.content = $("<img />");
		this.dimension = {
						width: window.innerWidth || $(window).width(),
						height: window.innerHeight || $(window).height()
						};

		this.options = $.extend({}, $.fn.olightbox.defaults, options);

		$(".overlay").on("click", this.remove);
	};

	Olightbox.prototype = {
		Constructor	: Olightbox,

		show : function() {
			var that = this;
			var overlay = $("<div />")
				.addClass("olightbox-overlay")
				.hide()
				.appendTo("body")
				.fadeIn();

			$("<div />")
				.addClass("olightbox-loader")
				.css({"position" : "relative", "top": "50%"})
				.appendTo(overlay);
			this.content.hide().attr("src", this.fetchUrl)
				.load( function() {
					$(this).fadeIn();
					that.contentWrapper.css({
						"left": (that.dimension.width-that.contentWrapper.width())/2,
						"top": (that.dimension.height-that.contentWrapper.height())/2 
					});
				}).appendTo(this.contentWrapper);

			this.contentWrapper.appendTo(this.lightbox);
			this.lightbox.hide().appendTo("body").fadeIn();
		},


		remove	: function() {

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
			console.log(option);

			if(!data) $this.data("olightbox", (data = new Olightbox(this, options)));
			if( typeof option == "string") data[option]();


		});
	};

	$.fn.olightbox.defaults = {
		"transition"	: "fadeIn",
		"trigger"		: "click"
	};

	$.fn.olightbox.Constructor = Olightbox;
	/*
		
	 */

	$(document).on('click', '.olightbox', function(event) {
		var $this = $(this);
		$this.olightbox("show");

		event.preventDefault();
	});
})(jQuery);	