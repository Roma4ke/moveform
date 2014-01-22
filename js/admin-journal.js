jQuery(document).ready(function($){
  
	var host = "http://localhost/raimond";
		var edit_mode = false;
	var edit_mode_parent;
     var jobs = Drupal.settings.movejournal.pageArray,   
	  jobs_length  = jobs.length,
	  month_menu = Drupal.settings.movejournal.pageArray['month_work_count'];
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
		// Init the Page
		$.post(jobs['path']+'/ajax/admin.htm',function(data){
			  body.empty().html(data);
			  
		
			
			  
			$('.journal-wrapper').css({'width':width + 'px'});
			$(dropdiv).css({'width':((width - 115)/4 - 4) + 'px'});
			  $('.date h3').prepend(jobs['prev_link']).append(jobs['date']).append(jobs['next_link']);
			  $('.home_menu').append(jobs['dashboard']);
			
			
			
				
			  jQuery.each(jobs,function(i,job){
					
					//var actual_time = job['actual_start'];
					//var pos = $('.time_column li:contains("'+actual_time+'")').position();
					//if(pos)
						var work_position = pos['top'] - 100;
					var $li = $('<li>');
				//	var mtime = job['max_move_time'];
				//	var truck = job['truck'];
				//	var column = '.truck_'+truck;
					
			
					
					$('.main_journal').append(job['work']);
				
									
                });
				 
				
				 
					 $('#Grid').mixitup({
					
					// LET'S USE A SIMPLE FADE FOR THIS DEMO					
					effects: ['fade'],									
					// AS WE ARE USING TOGGLING, IT IS NECCESSARY TO LIST ALL INDIVIDUAL CATEGORIES ON LOAD	
					//multiFilter: true,					
					showOnLoad: 'month_'+ jobs['current_month'],			
					onMixEnd: function(){
						
						// RE-INSTANTIATE UI-SORTABLE ON DECK, AS CLICK HANDLERS MAY BE DESTROYED DURING MIX
						$('.work .menu').click(function() {
					 var parent = $(this).parent().parent();			 
					 if(!edit_mode){		 
					 parent.removeClass('adj').addClass('work_edit');
					 edit_mode_parent = parent;
					 edit_mode	= true;
					 $('html,body').animate({scrollTop: parent.offset().top},'slow');
					 }
					 else {
						 if(parent.attr('id') != edit_mode_parent.attr('id')){
							edit_mode_parent.removeClass('work_edit');	 
							edit_mode_parent.addClass('adj');
							 parent.removeClass('adj').addClass('work_edit');
							 edit_mode_parent = parent;
							edit_mode	= true;
							$('html,body').animate({scrollTop: parent.offset().top},'slow');
						 }
						else{
						 parent.removeClass('work_edit');	 
						 parent.addClass('adj');
						  edit_mode	= false;				  
					  }
					 }
					
				  });
					}
					});
				
				
				
				
				//Update Month 	Menu  
		  jQuery.each(month_menu,function(i,month){	 
				$('.month_menu li.month_'+(i+1)+' span').append(month);
				
				if((i+1) == jobs['current_month']){
					$('.month_menu .anim150').empty().append($('.month_menu li.month_'+(i+1)).html());
					}

			});
			
					var $filters = $('.journal_menu').find('li'),
					dimensions = {
						month: 'month_'+ jobs['current_month'], // Create string for first dimension
						status: 'all' // Create string for second dimension
					};
					
					 $filters.click(function(){
					var $t = $(this),
						dimension = $t.attr('data-dimension'),
						filter = $t.attr('data-filter'),
						filterString = dimensions[dimension];
						
					if(filter == 'all'){
						// If "all"
						if($t.hasClass('active')){
							// if unchecked, check "all" and uncheck all other active filters
							$t.addClass('active').siblings().removeClass('active');
							// Replace entire string with "all"
							filterString = 'all';	
						} else {
							// Uncheck
							$t.removeClass('active');
							// Emtpy string
							filterString = '';
						}
					} else {
						// Else, uncheck "all"
						$t.siblings('[data-filter="all"]').removeClass('active');
						$t.siblings().removeClass('active');
						$t.addClass('active');
						// Remove "all" from string
						filterString = '';
						filterString = filterString == '' ? filter : filterString+' '+filter;
						
					};
					
					// Set demension with filterString
					dimensions[dimension] = filterString;
					
					$('#Grid').mixitup('filter',[dimensions.month, dimensions.status])			
				});
					
				// Open work for editing
				$('.work .menu').click(function() {
					 var parent = $(this).parent().parent();			 
					 if(!edit_mode){		 
					 parent.removeClass('adj').addClass('work_edit');
					 edit_mode_parent = parent;
					 edit_mode	= true;
					 $('html,body').animate({scrollTop: parent.offset().top},'slow');
					 }
					 else {
						 if(parent.attr('id') != edit_mode_parent.attr('id')){
							edit_mode_parent.removeClass('work_edit');	 
							edit_mode_parent.addClass('adj');
							 parent.removeClass('adj').addClass('work_edit');
							 edit_mode_parent = parent;
							edit_mode	= true;
							$('html,body').animate({scrollTop: parent.offset().top},'slow');
						 }
						else{
						 parent.removeClass('work_edit');	 
						 parent.addClass('adj');
						  edit_mode	= false;				  
					  }
					 }
					
				  });
				  
				  $('.month_menu li').click(function(){
				
					$('.month_menu .anim150').empty().append($(this).html());
					
				  });
				  
				  
				  var time_opt = '<select><option value="1">Any</option><option value="2">Morning 9AM</option><option value="3">Noon 12PM - 4PM</option><option value="4">Afternoon 3PM-7PM</option></select>'
					$( ".datepicker" ).datepicker({
				  showOn: "button",
				  buttonImage: "http://raimondsmove.us/sites/all/modules/movecalc/images/calendar.png",
				  buttonImageOnly: true,	
				  onClose: function( selectedDate ) {
					var id = $(this).parent().parent().parent().parent().attr('id');
					
				  					  if(selectedDate != jobs['date_raw'])
									  {		 
									  if(selectedDate == '') selectedDate = "same date";
									   $.confirm({
											'title'		: 'Change Date Confirmation',
											'message'	: 'You are shure you want to change the date on '+selectedDate+' and '+time_opt+' prefered time ! Continue?',
											'buttons'	: {
												'Yes'	: {
													'class'	: 'blue',
													'action': function(){
														if(selectedDate != "same date")
															{
															var time = $("#confirmBox select option:selected").val(),
															 time_text = $("#confirmBox select option:selected").text();
															update_date(id,selectedDate,time);
															$('#'+id+' .start_time span').empty().append(time_text);
															$('#'+id).hide();
															}
														else
															{	
															var time = $("#confirmBox select option:selected").val(),
															time_text = $("#confirmBox select option:selected").text();
															$('#'+id+' .start_time span').empty().append(time_text);
															update_time(id,time);
															}
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

		
		});
		
	
		
	function update_truck(id,truck){
		var url =  host+'/ajax/truck_update/'+id+'/'+truck;
		var ajax = new Drupal.ajax(false, '#somen-link', {url :url});
		ajax.eventResponse(ajax, {});	
	
	};
	function update_date(id,date,time){
		var url =  host+'/ajax/date_update/'+id+'/'+date+'/'+time;
		var ajax = new Drupal.ajax(false, '#somen-link', {url :url});
		ajax.eventResponse(ajax, {});	
	
	};
	function update_time(id,time){
		var url =  host+'/ajax/time_update/'+id+'/'+time;
		var ajax = new Drupal.ajax(false, '#somen-link', {url :url});
		ajax.eventResponse(ajax, {});	
	
	};

		
 
    // --------------------------------------------------- //
    // --------------- Start Make Some FUN ---------------- //
    // --------------------------------------------------- //

     
	
});