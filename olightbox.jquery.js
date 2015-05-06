( function( $ ) {

	"use strict";

	/*
		CLASS
	 */
	var Olightbox = function(element, options) {
		var that = this;
		this.options = $.extend({}, $.fn.olightbox.defaults, options);

		this.trigger = $(element);
		this.fetchUrl = this.trigger.attr("data-target") || this.trigger.attr("href");
		this.overlay = $("<div />");
		this.lightbox = $("<div />").addClass(this.options.elements.wrapper.className);
		this.contentWrapper = $("<div />").addClass(this.options.elements.contentWrapper.className);
		this.content = null;
		this.dimension = {
						width: window.innerWidth || $(window).width(),
						height: window.innerHeight || $(window).height()
						};

	};

	Olightbox.prototype = {
		Constructor	: Olightbox,

		prepare : function() {
			var that = this,
				deferred = $.Deferred();

			this.showLoader();
			$.when(this.buildContent()).then( function() {
				that.bindToClose();
				deferred.resolve();
			});

			return deferred.promise();
		},

		showLoader : function() {
			this.overlay
				.addClass(this.options.elements.overlay.className)
				.hide()
				.appendTo("body")
				.fadeIn();

			if(this.overlay.children("."+this.options.elements.loader.className).length === 0) {
				$("<div />")
					.addClass(this.options.elements.loader.className)
					.appendTo(this.overlay);
			}
		},

		buildContent : function() {
			var that = this,
				url = this.fetchUrl,
				type = this.getContentType(this.fetchUrl),
				deferred = $.Deferred();

			this.content = $("<div />");


			switch(type) {
				case "img":
					this.content = $("<img />").attr("src", this.fetchUrl);
					url = null;
					this.lightbox.css("overflow", "hidden");
					that.content.css({
						// "max-width" : that.dimension.width-40,
						"max-height": that.dimension.height-40
					});

					break;
				case "inline":
					url = " "+this.fetchUrl;
					break;
				default:
					break;

			}
			this.content.load(url, function(data, status, xhr) {
				if(type !== "img" && status === "error") {
					data = that.options.errorMessage;
					that.lightbox.css({
						width: '20%',
						height: '20%'
					});
					that.content.html(data);
					that.lightbox.addClass(that.options.elements.error.className);			
				}

				that.lightbox.hide().appendTo("body");
				that.content.appendTo(that.contentWrapper);
				that.contentWrapper.appendTo(that.lightbox);


				var left = (that.dimension.width-that.lightbox.width())/2,
					top = (that.dimension.height-that.lightbox.height())/2;
				left = (left < 0) ? 0 : left;
				top = (top < 0) ? 0 : top;

				that.lightbox.css({
					left: left,
					top: top
				});
				$(that.content).children().show();

				deferred.resolve();
			});

			return deferred.promise();
		},

		show : function() {
			var that = this;
			$.when(this.prepare()).then( function() {
				that.lightbox.fadeIn(that.options.transitionSpeed);
			});
		},


		bindToClose : function() {
			var that = this;
			$("."+this.options.elements.overlay.className).on("click", function() {
				that.remove.apply(that);
			});

			$(document).on("keydown", function(event) {
				var key = event.key || event.which;
				if(key === 27) that.remove();
			});
		},

		remove	: function() {
			var that = this;
			$("."+this.options.elements.overlay.className).remove();
			this.lightbox
				.fadeOut(this.options.transitionSpeed, function() {
					$(this).empty().remove();
					that.contentWrapper.empty();
//					that.content.empty();
				});

			

			$("body").css("overflow", "");
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
		'transition'	: 'fadeIn',
		'transitionSpeed': 500,
		'trigger'		: 'click',
		'show'			: true,
		'errorMessage'	: "Error!<br>Content not found.",
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
			},
			'error' : {
				'className' :	'olightbox-error'
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
