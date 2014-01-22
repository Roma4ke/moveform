jQuery(document).ready(function($){

    
	var clicked_day;    
	var selected_day;
	
	function deselect() {
	   $("#type_popup").slideFadeToggle(function() { 
		   clicked_day.removeClass("selected"); 
		   clicked_day.css({"position":"static"});
		});    
		  $(".modal-backdrop").remove();
		  $('#type_popup').css({'z-index':-5});
	   
	}
		
	$(function() {
		$(".calendar-day a").live('click', function() {
			if($(this).hasClass("selected")) {
				  $(this).removeClass("selected");                  
			} else {
				$(this).addClass("selected");
				var position = $(this).position();
				$(this).css({"position":"absolute","z-index":1000, "left": position.left +'px', "top": position.top+'px'});
				clicked_day = $(this);
				
				$('body').append('<div class="modal-backdrop fade in"></div>');
				$( "#type_popup").css( {"left": (position.left+13) +'px', "top": (position.top-4)+'px' });
				$("#type_popup").css({'z-index':15});
				
				$("#type_popup").slideFadeToggle(function() { 
				
				});
			}
			return false;
		});

	});

	$.fn.slideFadeToggle = function(easing, callback) {
		
		return this.animate({ opacity: 'toggle', height: 'toggle' }, "fast", easing, callback);
	};
	
	$(".modal-backdrop").live('click',function(e) {
	
		deselect() ;
		e.preventDefault();
	});
	
	
	
	$("#type_popup a").live('click',function(e) {
		var type = $(this).attr("value");
		var date = clicked_day.attr("value");
		var old_name = clicked_day.attr("title");
		var type_name = $(this).attr("id");
		//*RUN ajaX FUNCTION
		clicked_day.removeClass(old_name).addClass(type_name);
		
		ajax_update_calendar(date,type);
		deselect() ;
		
		
		
		
		event.preventDefault();
	});
   
   function ajax_update_calendar(date,type){
   
		var url =  'http://localhost/raimond/ajax/calendar_update/'+date+'/'+type;
		var ajax = new Drupal.ajax(false, '#somen-link', {url :url});
		ajax.eventResponse(ajax, {});	
	
	};
	
});