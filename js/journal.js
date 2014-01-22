jQuery(document).ready(function($){
  

     var jobs = Drupal.settings.movejournal.pageArray,
	  jobs_length  = jobs.length,
	  truck_number = 4,
	  show_days =2,
	   body    = $('body'),
        doc     = $(document),
        height  = $(window).height(),
        width   = $(window).width(),
        main    = true,
        //pos     = (width>1024) ? -100:(height-(width*.75))*.5;
        pos     = (height-(width*.75))*.5;
        css     = (width>height) ? {'width':width,'height':width*.75,'marginTop':pos+'px','marginLeft':'0px'}:{'width':height/.75,'height':height,'marginTop':'0px','marginLeft':(width-(height/.75))*.5+'px'};
		 body.empty();
    	
		var dropdiv =".truck_1,.truck_2,.truck_3,.truck_4";

		$.post(jobs['path']+'/ajax/home.htm',function(data){
			  body.empty().html(data);
			  
			 
							  
			  
			$('.journal-wrapper').css({'width':width + 'px'});
			//$(dropdiv).css({'width':((width - 80)/(truck_number*show_days) - 4) + 'px'});
			
			  $('.date h3').prepend(jobs['prev_link']).append(jobs['date']).append(jobs['next_link']);
			  $('.home_menu').append(jobs['dashboard']);
			
			
			
				
			  jQuery.each(jobs,function(i,job){
					
					var actual_time = job['actual_start'];
					var pos = $('.time_column li:contains("'+actual_time+'")').position();
					if(pos)
						var work_position = pos['top'] - 100;
					var $li = $('<li>');
					var mtime = job['max_move_time'];
					var truck = job['truck'];
					var column = '.truck_'+truck;
					
					$(column+' h3').html('<span>'+job['movers']+'</span>'+'<div class="truck_name">'+job['truck_name']+'</div>');
					
					$(column).append(job['work']);
				
					$('#'+job['work_id']).tinyscrollbar();
									
                });
				   
				
				
					$( ".datepicker" ).datepicker({
				  showOn: "button",
				  buttonImage: "../sites/all/modules/movecalc/images/calendar.png",
				  buttonImageOnly: true,			  
				  onClose: function( selectedDate ) {
					var id = $(this).parent().parent().parent().parent().parent().attr('id');
				  					  if(selectedDate != jobs['date_raw'])
									  {		 
									   $.confirm({
											'title'		: 'Change Date Confirmation',
											'message'	: 'You are shure you want to change the date! Continue?',
											'buttons'	: {
												'Yes'	: {
													'class'	: 'blue',
													'action': function(){
														update_date(id,selectedDate);
														$('#'+id).hide();
													}
												},
												'No'	: {
													'class'	: 'gray',
													'action': function(){}	// Nothing to do in this case. You can as well omit the action property.
												}
											}
										});
									  }
									  
				  }
				});
				$( ".datepicker" ).datepicker( "setDate",jobs['date_raw'] );
							
				
			$('#checkDrug').change(function() {
				if($(this).is(":checked")) {
					$(".draggable").draggable();
					$(dropdiv).droppable({ accept: ".draggable", 
				   drop: function(event, ui) {
						   $(this).removeClass("border").removeClass("over");
					 var dropped = ui.draggable;
					var droppedOn = $(this);
					$(dropped).detach().css({top: 0,left: 0}).appendTo(droppedOn); 
						var id = $(dropped).attr('id');
						var truck = $(this).attr('id');
					 update_truck(id,truck);
					 
						}, 
				  over: function(event, elem) {
						  $(this).addClass("over");
						 
				  }
						,
						  out: function(event, elem) {
							$(this).removeClass("over");
						  }
							 });
				$(dropdiv).sortable();
				}
				else {
					$(".draggable").draggable( "destroy" );
					$(dropdiv).droppable( "destroy" );
					$(dropdiv).sortable("destroy");
					}				
           
			});	

			//Ñhoose dates and scale
			var currentDaysScale = 1;
			$(".date-picker li").click(function() {
			
			var days = $(this).prevAll();
			var value = $(this).attr('value');	
			var days_number = $(this).prevAll().length;
			
			if(days_number > currentDaysScale){
				$(this).addClass("active");
				$(this).prevAll().addClass("active");
				setDayBorder(days_number);
				scaleDays(days_number,"UP");
				$('.truck_column h3').css({"font-size":'6px'});
			}
			else {
			
				$(this).nextAll().removeClass("active");
				setDayBorder(days_number);
				scaleDays(days_number,"DOWN");
				$('.truck_column h3').css({"font-size":'12px'});
			}
			
			currentDaysScale = days_number;
								 
			});
			
			
			
		
		});
		
		function scaleDays(days,scale){
			var work_width = $(".work_wrapper").width() - 80;
			var width = work_width / days;
			 
			$(".truck_column").css({'width':width});
					
			if(scale == "UP"){		
				for (var i = 2; i <= days; i++){			
					$('.truck_column.day'+i).css({'left':width*(i-1)});		
				}
			}
			else{
				for (var i = 2; i <= 7; i++){			
					$('.truck_column.day'+i).css({'left':width*(i-1)});		
				}
			}
		
		}
		
	
		function setDayBorder(day){
				var width = 38*day;
				 $(".date-picker .pick-border").css({'width':width + 'px'});		
		}
		
		
		
		
		
		
		
		
		
	function update_truck(id,truck){
		var url =  'http://localhost/raimond/ajax/truck_update/'+id+'/'+truck;
		var ajax = new Drupal.ajax(false, '#somen-link', {url :url});
		ajax.eventResponse(ajax, {});	
	
	};
	function update_date(id,date){
		
		var url =  'http://localhost/raimond/ajax/date_update/'+id+'/'+date;
		var ajax = new Drupal.ajax(false, '#somen-link', {url :url});
		ajax.eventResponse(ajax, {});	
	
	};
	function sort_work(column) {
	
		var work_list = $(column).children(".work").get();
		
		 work_list.sort(function(a,b) {
			return $(a).find(".start_time").attr('value') -  $(b).find(".start_time").attr('value');
		 
		 });
	 var vaadf = work_list;
		 
	/*	
		var points = [40,100,1,5,25,10];
points.sort(function(a,b){return a-b});
		
		
			$start_time = $(this).find(".start_time").attr('value');
			if($start_time == 2){  // 9AM - 12PM
				var prev = $(this).prev();
				$(this).css('top',"20px");
				
			
			}
			if($start_time == 3 ) { // 11AM - 4PM 
				$(this).css('top',"100px");
			}
			// "this" is the current element in the loop
			});
		
	*/
	}

		
 
    // --------------------------------------------------- //
    // --------------- Start Make Some FUN ---------------- //
    // --------------------------------------------------- //

     
	
});