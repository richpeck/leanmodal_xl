///////////////////////////////////////
// 
// LeanmodalXL
//
///////////////////////////////////////

(function( $ ){        
        
   $.fn.leanModal = function(options) {

		//Defaults
		var defaults = {
			overlay: 0.5,
			overlay_color: "#000",
			closeButton: null,
			delay: null,
			drag: ".modal_title",
			removeModal: null,
			autoLoad: null,
			ajax: false
		};

		//Definitions
		var xhr;
		var plugin = this;
		var options = $.extend(defaults, options);

		//Init
		plugin.init = function() {

			if(options.autoLoad){
	     		$.extend(options, {modal_id: $(this)});
				create();
			}else{
				return this.each(function() {
					$(this).click(function(e) {
						e.preventDefault();
						var href = $(this).attr("href");
						var image = CheckImg(href);

						var random = Math.floor(Math.random()*90000) + 10000;
						var extras = (options.ajax || image) ? {modal_id: "#modal_" + random, ajax: href.replace(/\/$/, '')} : {modal_id: href};

						$.extend(options, extras);
						create();
					});
				}); 
			}
		}

		//////////////////
		//    Actions   //
		//////////////////

		//Build
		var create = function() {
			if(options.ajax){

				//Loading
				load();

				//Image
				switch (true) {
					case CheckImg(options.ajax):
						append("img", options.modal_id.substring(1), options.ajax);
						show();
						break;
					default:
						fetch(options.ajax, function(data){
							append("modal", options.modal_id.substring(1), options.ajax, data);
							show();
						}, function(xhr, text_status, error_thrown){
							load();
							alert("Sorry, there was an error!");
						});
						break;
				}

			}else{
				show();
			}
		}

		//Ajax
		var fetch = function(link, success, error) {
			xhr = 
			$.ajax({
				url: link,
				success: function(data) { success(data); },
				error: function(data)   { error(data); }
			});
		}

		//Overlay
		var olay = function(modal_id, removeModal, closeButton, ajax) {
			var overlay = document.createElement("div");
			    overlay.setAttribute("id", "lean_overlay");

			document.body.appendChild(overlay);
			overlay.onclick = function() { close(modal_id, removeModal, $(closeButton), ajax); return false; };
		}

		//Show
		var show = function() {

			/* Vars */
			var id 			= options.modal_id
			var removeModal = options.removeModal
			var closeButton = options.closeButton
			var drag 		= options.drag
			var ajax 		= options.ajax
			var opacity 	= options.overlay
			var color 		= options.overlay_color

			/* Overlay */
			olay(id, removeModal, closeButton, ajax);

			/* Elements */
			var modal 		= $(id);
			var overlay 	= $("#lean_overlay");

			/* Display */
			var disp    	= display.bind(null, overlay, color, opacity, modal, drag);

			/* Options */
            if (closeButton) {
				$(closeButton).css("z-index", "900");
				$(closeButton).on("click", function (e) {
					e.preventDefault();
					close(id, removeModal, $(closeButton));
					return false;
				});
			}

			/* Load */
			if (ajax) {
				modal.waitUntilExists(function() {
					load();
					disp();
				})
			} else { disp(); }
		}

		//Close
		var close = function(modal, removeModal, closeButton, ajax) {

			/* Ajax */
			if(ajax){
				if (xhr) { xhr.abort(); }
				load(true);
			}
		
			/* Overlay */
			$("#lean_overlay").fadeOut(150, function(){
				$(this).remove();
				if(closeButton) {
					closeButton.off("click");
					closeButton.removeAttr('style');
				}
			});
            
            /* Modal */
			$(modal).fadeOut(150, function(){
				if (removeModal) {
					$(this).remove();
				 }
			});
			
        }

		//Go
		plugin.init();
   }; 
		

	//////////////////
	// Dependencies //
	//////////////////

	//Image?
	var CheckImg   = function(url) { if(url) { return(url.match(/\.(jpeg|jpg|gif|png)/) != null); }}
	
	//Create
	var append 	   = function(type, id, src, data) {

		//Definitions
		var style = element = type;
		
		if (type == "modal") {
			var style = "ajax";
			var element = "div";
		}

		//Element
	    var el = document.createElement(element);
			el.setAttribute("id", id);
			el.setAttribute("src", src);
			el.className = 'modal ' + style;

		//Ajax
		if (data) { el.innerHTML = data; }

		//Append
		document.body.appendChild(el);
	}

	//Show
	var display = function(overlay, color, opacity, modal, drag)    {

		/* Styling */
		overlay.css({
			"display": "block",
			"background": color,
			opacity: 0
		});
		modal.css({
			"display": "block",
			"position": "fixed",
			"opacity": 0,
			"z-index": 10200,
			"left": 0,
			"right": 0,
			"top": 0,
			"bottom": 0,
			"margin": "auto"
		});

		/* Init */
		overlay.fadeTo(150, opacity);
		modal.fadeTo(200, 1);
		if(drag.length > 0) { modal.draggable({ handle: drag }); }

	}
	
	//Ajax Load
	var load  = function(close)	{
		if (close) { $(document).ajax_load({close: true});  } else {  $(document).ajax_load(); }
	}

})( jQuery );