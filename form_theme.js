
(function($)
{
	var host = "http://localhost/raimond";
	var w_formId = '#movecalc-moving-form';
	var animating;
	var password_status = '';
	Drupal.behaviors.formTheme = {
		attach: function (context, settings) {
     // any behavior is now applied once
    
		
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will 
			$("#primary_phone").mask("(999) 999-9999");
			$("#edit-zip-code-from").mask("99999");
			$("#edit-zip-code-to").mask("99999");
			
			$("#edit-additional-phone").mask("(999) 999-9999");
			
			if(Drupal.settings.validate != undefined){
			var current = $('.'+Drupal.settings.validate.this).parent().parent();
			
			if(!validateStep(current) &&	Drupal.settings.calculator != undefined){
						
				var btn = '.'+Drupal.settings.calculator.this;
				var current = $(btn).parent().parent();
				//Calculate results			
				if(Drupal.settings.calculator.step == 'Calculate >>'){
						$('#result_box').empty();
						nextstep('#edit-calculator');
						$('#result_box').append(Drupal.settings.calculator.result_box);	
						
						showMap('#map_direction',Drupal.settings.calculator.zip_from,Drupal.settings.calculator.zip_to);
						showMap('#map_direction_to_storage',Drupal.settings.calculator.zip_from,Drupal.settings.calculator.zip_storage);
						showMap('#map_direction_from_storage',Drupal.settings.calculator.zip_storage,Drupal.settings.calculator.from_storge_to);
				}
				//Confirm AJax Step 
				if(Drupal.settings.calculator.step == 'Continue to Summery'){	
						$('#summery_results').empty();
						nextstep('#edit-personal-info');						
						$('#summery_results').append(Drupal.settings.calculator.summery_info);	
						showMap('#map_direction2',Drupal.settings.calculator.zip_from,Drupal.settings.calculator.zip_to);
						showMap('#map_direction_to_storage2',Drupal.settings.calculator.zip_from,Drupal.settings.calculator.zip_storage);
						showMap('#map_direction_from_storage2',Drupal.settings.calculator.zip_storage,Drupal.settings.calculator.from_storge_to);
				}
				//Confirm AJax Step 
				if(Drupal.settings.calculator.step == 'Confirm'){	
						nextstep('#edit-summery');						 
				}
					
			}}
	
				
		$('#go-calculator-results-btn').once('next-result').click(function() {
         var date = $(this).val();
		
		 
		 nextstep($('#edit-calculator-results'));
		 
        return false;
      })
	  	$('#back-to-calc-btn').once('calendar-btn').click(function() {
     
		 prevstep($('#edit-calculator-results'));
		 
        return false;
      })
	   	$('#back-to-calendar-btn').once('calendar-btn2').click(function() {
     
		 prevstep($('#edit-personal-info'));
		 
        return false;
      })
		$('#back-to-info-btn').once('back-summery').click(function() {
        
		 prevstep('#edit-summery');
		 
        return false;
      })
	  	$('#back-to-info-details').once('back-summery').click(function() {
        
		 prevstep('#edit-calculator-results');
		 
        return false;
      })
	  //Zip code Change
	 $( ".required").once('input-element').change(function() {
		var $this = $(this);
				$("#calc-results").hide("slow");
			  var valueLength = jQuery.trim($this.val()).length;
			 // Drop error if filled
			  if (valueLength != '') {
				 $this.removeClass('error');
			  }
			  //Zip code info
			  if($this.attr( "id" ) == 'edit-zip-code-from' || $this.attr( "id" ) == 'edit-zip-code-to'){
			    $(".calc-intro").hide("slow").empty();
				var error  = '<div class="calc-error"><h1 class="calc-error_heading">Address Alert!</h1><p class="calc-intro_description">We didnt find zip code you have provided. Try another one.</p></div>';
				$.get( "http://maps.googleapis.com/maps/api/geocode/json?address="+$this.val()+'&sensor=false', function( data ) {			
				
				var counryCheck = data['results'][0]['address_components'].length - 1;
				if(data['status']=='OK' && counryCheck != "undefined" && data['results'][0]['address_components'][counryCheck]['short_name'] == 'US') {
		  
				  if( $this.attr( "id" ) == 'edit-zip-code-from')
					$("#calc-info-steps .box_info .moving-from").empty().append('<h3>Moving From:</h3><span>'+data['results'][0]['formatted_address']+'</span>').show("slow");	
				  else 
					$("#calc-info-steps .box_info .moving-to").empty().append('<h3>Moving To:</h3><span>'+data['results'][0]['formatted_address']+'</span>').show("slow");		
					
				$this.removeClass('error');
				  $(".calc-error").empty();	
					
				}
				else {
				  $(".calc-error").empty();
					$(".calc_block").append(error).show("slow");
						$this.addClass('error');	
						$this.val('');
					}
				});		  
			  }
			  // If Size of Move Change show images
			  if($this.attr( "id" ) == 'edit-size-move'){
				$("#calc-info-steps .calc-intro").hide("slow").empty();
				
				//$("#edit-extra-furnished-rooms").find('input[type=checkbox]:checked').removeAttr('checked');
				
				
				$("#calc-info-steps .box_info .move-size").empty().append(SizeOfMoveTips($this.val())).show(200);
				//$("a.move_size").fancybox();
				$("a.move_size").fancybox({
					'transitionIn'	:	'elastic',
					'transitionOut'	:	'elastic',
					'speedIn'		:	400, 
					'speedOut'		:	200, 
					'overlayShow'	:	true
				});
			  
			  }
			
			  
			   if($this.attr( "id" ) == 'edit-move-date-datepicker-popup-0'){
				$("#calc-info-steps .calc-intro").hide("slow").empty();
				$("#calc-info-steps .box_info h3.moving-date").empty().append('Move Date : <span>'+$this.val()+'</span>').show("slow");
				$("#calc-info-steps .box_info .service-type").empty().append('<h3>Type of service:</h3><span>'+$('#edit-service option:selected').text()+'</span>').show("slow");
				$("#edit-date-storage-datepicker-popup-0" ).datepicker( "option", "minDate", $this.val());
			 }
				 if($this.attr( "id" ) == 'edit-service'){
				$("#calc-info-steps .calc-intro").hide("slow").empty();
				$("#calc-info-steps .box_info .service-type" ).empty().append('<h3>Type of service:</h3>'+$('#edit-service option:selected').text()).show("slow");		  
			  }
			  
			  
			  
			  if($this.attr( "id" ) == 'edit-passowrd'){
				//checkUser($('#edit-email').val(),$this.val());		  
			  }
			  
			  
			 
	});
			
		$('#edit-service').change(function() {
		
			if($(this).val() == '3') {//Loading Help
				$("#edit-zip-code-to").attr("disabled", "disabled").addClass("disabled").removeClass("required");
				$("#edit-zip-code-from").removeAttr("disabled").removeClass("disabled").addClass("required");
				
				$("#edit-type-to").attr("disabled", "disabled").addClass("disabled").removeClass("required");
				$("#edit-type-from").removeAttr("disabled").removeClass("disabled").addClass("required");
				

			}
			else if($(this).val() == '4') {//UnLoading Help
				$("#edit-zip-code-from").attr("disabled", "disabled").addClass("disabled").removeClass("required");
				$("#edit-zip-code-to").removeAttr("disabled").removeClass("disabled").addClass("required");
				
				$("#edit-type-from").attr("disabled", "disabled").addClass("disabled").removeClass("required");
				$("#edit-type-to").removeAttr("disabled").removeClass("disabled").addClass("required");
			}
			else{	
				$("#edit-zip-code-from").removeAttr("disabled").removeClass("disabled").addClass("required");
				$("#edit-zip-code-to").removeAttr("disabled").removeClass("disabled").addClass("required");
				$("#edit-type-from").removeAttr("disabled").removeClass("disabled").addClass("required");
				$("#edit-type-to").removeAttr("disabled").removeClass("disabled").addClass("required");
			}
			
		
		});
		
		$('#edit-confirm-passowrd-signup').once('login').change(function(){
			if($(this).val() == $('#edit-passowrd-signup').val()){
					//Everything is ok!
			}else{			
				$(this).val('');
				$("#summery-alert").append("<p>Password does not match the confirm password.</p>");
			}
		
		
		});
		
		$('#edit-date-storage-datepicker-popup-0').once('login').change(function() {
		
		var storageDate = new Date($(this).val());
		var moveDate = new Date($("#edit-move-date-datepicker-popup-0" ).val());
	
            if (storageDate < moveDate ) {
					// Something Wrong
						$(this).val('');
            }
	
			
		});
			
			
	  // If Add extra rooms add images
	
	  
	  $( "#edit-extra-furnished-rooms input[type=checkbox]").once('login').click(function() {
			var room = $(this);
			var roomVal = room.val();	
			if(room[0]['checked'])
				$("#calc-info-steps .box_info .move-size").append(ShowRoom(roomVal)).show(200);
			else{
				HideRoom(room);
			}
			
			
			$(".move-size a").fancybox({
					'transitionIn'	:	'elastic',
					'transitionOut'	:	'elastic',
					'speedIn'		:	400, 
					'speedOut'		:	200, 
					'overlayShow'	:	true
				});		
		});
	
			  // If Add extra house rooms add images
	  $( "#edit-extra-house-furnished-rooms input[type=checkbox]").once('login').click(function() {
			var room = $(this);
			var roomVal = room.val();
			if(room[0]['checked'])
				$("#calc-info-steps .box_info .move-size").append(ShowRoom(roomVal)).show(200);
			else{
				HideRoom(room);
			}
			
			
			$(".move-size a").fancybox({
					'transitionIn'	:	'elastic',
					'transitionOut'	:	'elastic',
					'speedIn'		:	400, 
					'speedOut'		:	200, 
					'overlayShow'	:	true
				});		
		});
	
	  
	  $('#go-to-summery-btn').once('summery').click(function() {
         
		 $('#summery_results .result_box').remove();
		 var Name = $('#edit-first-name').val();
		 var LastName = $('#edit-last-name').val();
		 var PrimaryPhone= $('#primary_phone').val();
		 var AdditionalPhone = $('#edit-additional-phone').val();
		 var Email = $('#edit-email').val();
		 var PreferedTime = $('#edit-prefered-time option:selected').text();
		 
		 var AddressFrom = $('#edit-moving-from').val();
		 var AptFrom = $('#edit-moving-from-apt').val();
		 var ZipFrom = $('#edit-moving-from-zip').val();
		 var CityFrom = $('#edit-moving-from-city').val();
		 var StateFrom = $('#edit-moving-from-state').val();
		 
		 var AddressTo= $('#edit-moving-to').val();
		 var AptTo = $('#edit-moving-to-apt').val();
		 var ZipTo = $('#edit-moving-to-zip').val();
		 var CityTo = $('#edit-moving-to-city').val();
		 var StateTo = $('#edit-moving-to-state').val();
		 var Comments = $('#edit-comments-about-move').val();
		 
		 var CalcResults = $('.calendarBox').clone();
		 $('.result_box').find('button').remove();
		 $('#summery_results .result_box').remove();
		 $('#summery_results').append('<div class="result_box"></div>');
		 $('#summery_results .result_box').append(CalcResults);
		 
		 var SummeryHtml = '<div class="summery_info_box"><div class="three_block"><label>Personal Information::</label><p><b>'+Name+LastName+'</b></p><p>Primary Phone: '+PrimaryPhone+'</p><p>Email: '+Email+'</p></div></div>';
		 var AddressFrom = '<div class="three_block"><label>Moving From:</label><p><b>'+AddressFrom+'#'+AptFrom+','+CityFrom +','+StateFrom+' '+ZipFrom+'</b></div>';
		 var AddressTo = '<div class="three_block"><label>Moving To:</label><p><b>'+AddressTo+'#'+AptTo+','+CityTo +','+StateTo+' '+ZipTo+'</b></div><div style="clear:both;"></div>';
		 
		$('#summery_results .result_box').append(SummeryHtml).append(AddressFrom).append(AddressTo);
		$('#summery_results .calendar_date').append(PreferedTime);

		 nextstep('#edit-personal-info');
		 
		 
        return false;
      })
		

	  $('#go-to-info-btn').once('infostep').click(function() {	
	  
		   $('#edit-moving-from-zip').val(Drupal.settings.calculator.zip_from);
		 $('#edit-moving-to-zip').val(Drupal.settings.calculator.zip_to);
		 
		 $('#edit-moving-from-city').val(Drupal.settings.calculator.city_from);
		 $('#edit-moving-to-city').val(Drupal.settings.calculator.city_to);
		 
		 $('#edit-moving-from-state').val(Drupal.settings.calculator.state_from);
		 $('#edit-moving-to-state').val(Drupal.settings.calculator.state_to);
		
	
		$('#edit-personal-info input[name="movers_crew"]').val(Drupal.settings.calculator.crew);
		$('#edit-personal-info input[name="price_per_hour"]').val(Drupal.settings.calculator.price);
		$('#edit-personal-info input[name="min_time"]').val(Drupal.settings.calculator.min_time);
		$('input[name="max_time"]').val(Drupal.settings.calculator.max_time);
		$('input[name="estimated_price"]').val(Drupal.settings.calculator.est_price);
		$('input[name="truck"]').val(Drupal.settings.calculator.truck);
		$('input[name="distance"]').val(Drupal.settings.calculator.distance);
		$('input[name="duration"]').val(Drupal.settings.calculator.duration);
		$('input[name="travel_time"]').val(Drupal.settings.calculator.travel_time);
		
		
		 nextstep($('#edit-calculator-results'));	 
         return false;
	  });
			
		
			
			
			$("#request_user_login").once('login').click(function() {
		
		$(this).addClass("click-disabled");
		 var email = $("#edit-email-login").val();
		 var pasw = $("#edit-passowrd-login").val();
		 
		 //email validation
		  if(IsEmail(email) == false)	{
				$("#edit-email-login").addClass('error');
				$('#request_user_login').removeClass("click-disabled");
				showAlert("1");
				return false;
			  }	
			  else 
			$("#edit-email-login").removeClass('error');
		
		 
		 var url =  host+'/ajax/check_user_existance/'+email+'/'+pasw;	
		$(".login-alert").css("display","block");
		  $.get(url, function(data){
            // If the test returns 0 the user's session has ended so refresh the
            // page.		 
			password_status = data[1]['data'];
			var status = password_status.split(',');
			$(".login-alert").css("display","none");
			$('#request_user_login').removeClass("click-disabled");
			if (status[0] !="3"){
				showAlert(status[0]);
			}
			else {
				user_login(status);
			}
          });
		 
		 		
		 return false;
		});	
			
			
			
		$('#edit-prefered-time').qtip({
		   content: 'Please note! Only morning guaranties the exact arrival time.<br> Afternoon and evenings times given as a window and arrival will depend on our first availability.',
		   show: 'mouseover',
		   hide: 'mouseout',
		  position: {
			  corner: {
				 target: 'rightMiddle',
				 tooltip: 'leftMiddle'
			  }
		   },
		   
		   style: { 
				name: 'red',
				tip: 'leftMiddle'
			}
		});	
			
	
			
			
	}};
	
	  
	function user_login (user){
		$("#edit-email").val(user[1]);
		$("#edit-first-name").val(user[2]);
		$("#edit-last-name").val(user[3]);	
		$("#edit-passowrd-signup").val($("#edit-passowrd-login").val());	
		$("#edit-confirm-passowrd-signup").val($("#edit-passowrd-login").val());	
		$("#primary_phone").val(user[4]);
		$("#edit-additional-phone").val(user[5]);
		
		$(".user-info").addClass("dis-1");
		$(".login_block").addClass("dis-1");
		$('.time_block').hide();

	}
	
	function nextstep(current) {
	
	if(animating) return false;
	animating = true;
	
	//activate next step on progressbar using the index of next_fs
	
	
	current_fs = $(current);
	next_fs = $(current).next();
	$("#progressbar li").eq($("#movecalc-moving-form fieldset").index(next_fs)).addClass("active");
	//show the next fieldset
							next_fs.show();			
							//hide the current fieldset with style
							current_fs.animate({opacity: 0}, {
								step: function(now, mx) {
									//as the opacity of current_fs reduces to 0 - stored in "now"
									//1. scale current_fs down to 80%
									scale = 1 - (1 - now) * 0.2;
									//2. bring next_fs from the right(50%)
									left = (now * 50)+"%";
									//3. increase opacity of next_fs to 1 as it moves in
									opacity = 1 - now;
									current_fs.css({'transform': 'scale('+scale+')'});
									next_fs.css({'left': left, 'opacity': opacity});
								}, 
								duration: 800, 
								complete: function(){
									current_fs.hide();
									animating = false;
									$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
								}, 
								//this comes from the custom easing plugin
								easing: 'easeInOutBack'
								});

	return false;
  }
	function prevstep(current){
	
	if(animating) return false;
	animating = true;
	
	current_fs = $(current);
	previous_fs = $(current).prev();
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
					
					//de-activate current step on progressbar
					$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
					
					//show the previous fieldset
					previous_fs.show(); 
					//hide the current fieldset with style
					current_fs.animate({opacity: 0}, {
						step: function(now, mx) {
							//as the opacity of current_fs reduces to 0 - stored in "now"
							//1. scale previous_fs from 80% to 100%
							scale = 0.8 + (1 - now) * 0.2;
							//2. take current_fs to the right(50%) - from 0%
							left = ((1-now) * 50)+"%";
							//3. increase opacity of previous_fs to 1 as it moves in
							opacity = 1 - now;
							current_fs.css({'left': left});
							previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
						}, 
						duration: 800, 
						complete: function(){
							current_fs.hide();
							animating = false;
							$("#progressbar li").eq($("#movecalc-moving-form fieldset").index(previous_fs)).addClass("active");
						}, 
						//this comes from the custom easing plugin
						easing: 'easeInOutBack'
					});
	
	return false;
	
	}
		/*
		validates one fieldset
		and returns -1 if errors found, or 1 if not
		*/
		function validateStep(step) {
		   //if (step == w_fieldsetCount) return;
		  
		   var hasError = false;
			$(step).find('.required').each(function() {
			  var $this = $(this);
			  var valueLength = jQuery.trim($this.val()).length;
			  
			  if (valueLength == '') {
				 hasError = true;
				 $this.addClass('error');
			  }
			  else
				 $this.removeClass('error');
			  
			  
			  if($this.attr("id") == "edit-email") {
			   if(IsEmail($this.val()) == false){
				$this.addClass('error');
					  hasError = true;
				}	
				else if(Drupal.settings.validate.user_login_error){
					$this.addClass('error');
					  hasError = true;
				}
			  else{ 
				$this.removeClass('error');
					
				
				}
				
			}
		
			  
		   });
		   
		   
		   return hasError;
		}
		
		function IsEmail(email) {
		  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		  return regex.test(email);
		}
		/*
		Size of Move Tips
		*/
		
		
	
		
		function checkUser(mail,pass){
		var url =  host+'/ajax/check_user_existance/'+mail+'/'+pass;	
		$(".login-alert").css("display","block");
		  $.get(url, function(data){
            // If the test returns 0 the user's session has ended so refresh the
            // page.		 
			password_status = data[1]['data'];
			$(".login-alert").css("display","none");
			
			return password_status;
          });
		  
	  
		}
	function showMap(id,from,to){
	if(from != to) {
			$(id).gmap3({
									   getroute:{
										options:{
											origin:from,
											destination:to,
											travelMode: google.maps.DirectionsTravelMode.DRIVING,
										},
										callback: function(results){
										  if (!results) return;
										  $(this).gmap3({
											map:{
											  options:{
												zoom: 13,  
												center: [-33.879, 151.235]
											  }
											},
											directionsrenderer:{
											  container: $(document.createElement("div")).addClass("googlemap").insertAfter($("#test")),
											  options:{
												directions:results
											  } 
											}
										  });
										}
									  }			
								});
								
						}
						else{
								$(id).gmap3({
													map: {
														options: {
														  maxZoom: 14 
														}  
													 },
													 marker:{
														 address: from
													 }
													},"autofit" );
						
						}
	
	}
	function showAlert(type){
		  var alert_string;
		  switch (type) {
                    case ('1'): // P
                        alert_string = 'The e-mail address you entered is not valid. Please try again';
                        break;
                    case ('2'):
                       alert_string = 'Your email in our system, but the password you entered is not valid. Please try again.</br> <a href="password" target="_blank">Forgot password?</a>';
                        break;			
                }
		
		var alert_message = '<div id="summery-alert" ><p>'+alert_string+'</p></div>';
		$(".message-alert").empty();
		$(".message-alert").append(alert_message);
	}
	function SizeOfMoveTips(type){
	   switch (type) {
                    case ('1'):
                        addRequired();
						hideRooms();
						return '<h3>Size of Move:</h3><span>Room</span><div class="calc-intro_description"><a   class="move_size" title="Room" href="'+host+'/sites/all/modules/movecalc/images/rooms/room.jpg"><img src="'+host+'/sites/all/modules/movecalc/images/rooms/smroom.png"></a><div class="roll">Click On Image to Enlarge</div> <div class="desc">Room includes bed, mattrasses, dresser, 3-10 boxes, tv, tv-stand, table. </div>';
                        break;
                    case ('2'):
                        addRequired();
						hideRooms();
						return '<h3>Size of Move:</h3><span>Studio</span><div class="calc-intro_description"><a  class="move_size"  title="Studio" href="'+host+'/sites/all/modules/movecalc/images/rooms/studio.jpg"><img title="Studio" src="'+host+'/sites/all/modules/movecalc/images/rooms/studio.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>Studio</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Studio has 35-40 assorted size boxes, suitecases and crates.</div>';
                        break;
					case ('3'):
                      addRequired();
					  showRooms();
						return '<h3>Size of Move:</h3><span>Small 1 Bedroom Apartment</span><div class="calc-intro_description"><a  class="move_size"  title="Small 1 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/1sm.jpg"><img title="Small 1 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm1sm.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>Studio</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Studio has 35-40 assorted size boxes, suitecases and crates.</div>';
                        break;
					case ('4'):
                        addRequired();
						showRooms();
						return '<h3>Size of Move:</h3><span>Large 1 Bedroom Apartment</span><div class="calc-intro_description"><a  class="move_size"  title="Large 1 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/1lar.jpg"><img title="Large 1 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm1lar.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>Large 1 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';
                        break;
					case ('5'):
                       addRequired();
					   showRooms();
					   return '<h3>Size of Move:</h3><span>Small 2 Bedroom Apartment</span><div class="calc-intro_description"><a  class="move_size"  title="Small 2 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/2sm.jpg"><img title="Small 2 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm2sm.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>Small 2 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';
                        break;		
                    case ('6'):
						addRequired();
						showRooms();
						 return '<h3>Size of Move:</h3><span>Large 2 Bedroom Apartment</span><div class="calc-intro_description"><a  class="move_size"  title="Large 2 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/2lar.jpg"><img title="Large 2 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm2lar.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>Small 2 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';
                        break;
					case ('7'):					
                        addRequired();
						showRooms();
						return '<h3>Size of Move:</h3><span>3 Bedroom Apartment</span><div class="calc-intro_description"><a  class="move_size"  title="3 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/3bed.jpg"><img title="3 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm3bed.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>3 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';
						 break;
                   case ('8'):
						takeOfRequired();
						showHouseRooms();
						setHouseEntarence();
						//$("#calc-info-steps .box_info .move-size").append(ShowRoom('2')).show(200);
                        return '<h3>Size of Move:</h3><span>2 Bedroom House</span><div class="calc-intro_description"><a  class="move_size"  title="Large 2 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/2lar.jpg"><img title="Large 2 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm2bh.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>Small 2 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';
						 break;
					case ('9'):
                        takeOfRequired();
						showHouseRooms();
						setHouseEntarence();
						$("#calc-info-steps .box_info .move-size").append(ShowRoom('2')).show(200);
						return '<h3>Size of Move:</h3><span>3 Bedroom House</span><div class="calc-intro_description"><a  class="move_size"  title="3 Bedroom Apartment" href="'+host+'/sites/all/modules/movecalc/images/rooms/3bed.jpg"><img title="3 Bedroom Apartment" src="'+host+'/sites/all/modules/movecalc/images/rooms/sm3bed.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>3 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';
						break;
				    case ('10'):
                       takeOfRequired();
					   showHouseRooms();
					   setHouseEntarence();
					   $("#calc-info-steps .box_info .move-size").append(ShowRoom('2')).show(200);
					   return '<h3>Size of Move:</h3><span>4 Bedroom House</span><div class="calc-intro_description"><a  class="move_size"  title="3 Bedroom Apt" href="'+host+'/sites/all/modules/movecalc/images/rooms/4bed.png"><img title="3 Bedroom Apt" src="'+host+'/sites/all/modules/movecalc/images/rooms/4bed.png"></a><div class="roll">Click On Image To Enlarge</div> <div class="desc"><span>3 Bedroom Apt</span> size apartment typically consist of one large room, whichserves as the living, dining and bedroom. <br> Average Large 1 Bedroom Apt has 60-80 assorted size boxes, suitecases and crates.</div>';					
						default:
                        return '<div class="calc-intro"><h1 class="calc-intro_heading">Choose Size</h1><p class="calc-intro_description" > Please choose size of your move.</p></div>';
			  
			  }	  
	}
	
	function setHouseEntarence(){
		$("#edit-type-from").val('7').attr("disabled", "disabled").addClass("disabled");
		$("#edit-type-to").val('7');
	}
	
	function takeOfRequired(){
		//$("#edit-type-from").removeClass("required");
		//$("#edit-type-to").removeClass("required");
		
		$('#edit-calculator .three_block').removeClass("apartment");
		$('#edit-calculator .three_block').addClass("thouse");
	}
	function addRequired(){
		$("#edit-type-from").val('');
		$("#edit-type-to").val('');
		//$("#edit-type-from").addClass("required");
	//	$("#edit-type-to").addClass("required");
		$("#edit-type-from").removeAttr("disabled");
		$("#edit-type-from").removeClass("disabled");
		$('#edit-calculator .three_block').removeClass("thouse");
		$('#edit-calculator .three_block').addClass("apartment");
		
	}
	function hideRooms() {
		for(var i=1; i <5 ; i++){
			
		 $('.form-item-Extra-Furnished-Rooms-'+i).hide();
		 $('.form-item-Extra-Furnished-Rooms-'+(i)).find('input[type=checkbox]:checked').removeAttr('checked');
		
		}
		
	}
	function showRooms() {
	$('#edit-extra-furnished-rooms-1').attr('checked',true);
		for(var i=1; i <5 ; i++){			
		 $('.form-item-Extra-Furnished-Rooms-'+i).show();
		 $('.form-item-Extra-Furnished-Rooms-'+(i+1)).find('input[type=checkbox]:checked').removeAttr('checked');	
		}
	}
	function showHouseRooms() {
		for(var i=2; i <9 ; i++){			
		 $('.form-item-Extra-House-Furnished-Rooms-'+i).show();
		 $('.form-item-Extra-House-Furnished-Rooms-'+(i+1)).find('input[type=checkbox]:checked').removeAttr('checked');	
		}
	}
	
	function ShowRoom(room){
			
			var roomSize = $("#edit-size-move").val();
						 
			
			 switch (room) {		
			case ('2'): // Dinnig Room
				 return '<a  class="dinning_room" id="dinning_room" title="Dinning Room" href="'+host+'/sites/all/modules/movecalc/images/rooms/dinning.png"><img title="Dinning Room" src="'+host+'/sites/all/modules/movecalc/images/rooms/smdr.png"></a>';	
				 $('a.dinning_room').zoom({url:host+'/sites/all/modules/movecalc/images/rooms/dinning.png'});
				break; 	
			case ('3'): // Office
				 return '<a  class="office_room_'+roomSize+'"  title="Office" href="'+host+'/sites/all/modules/movecalc/images/rooms/office.png"><img title="Office" src="'+host+'/sites/all/modules/movecalc/images/rooms/smoffice.png"></a>';	
				break; 	
			case ('4'): // Extra room
				 return '<a  class="extra_room_'+roomSize+'"  title="Extra or Play room" href="'+host+'/sites/all/modules/movecalc/images/rooms/extraroom.png"><img title="Extra room" src="'+host+'/sites/all/modules/movecalc/images/rooms/smextraroom.png"></a>';	
				break; 	
			case ('5'): // Basement
				 return '<a  class="basement_room"  title="Basement or Storage" href="'+host+'/sites/all/modules/movecalc/images/rooms/basement.png"><img title="Basement" src="'+host+'/sites/all/modules/movecalc/images/rooms/smbasement.png"></a>';	
				break; 	
			case ('6'): // Garage
				 return '<a  class="garage_room"  title="Garage" href="'+host+'/sites/all/modules/movecalc/images/rooms/garage.png"><img title="Basement" src="'+host+'/sites/all/modules/movecalc/images/rooms/garage.png"></a>';	
				break; 	
			case ('7'): // Patio
				 return '<a  class="patio_room"  title="Patio" href="'+host+'/sites/all/modules/movecalc/images/rooms/smpatio.png"><img title="Basement" src="'+host+'/sites/all/modules/movecalc/images/rooms/smpatio.png"></a>';	
				break; 	
			case ('8'): // Play 
				 return '<a  class="play_room"  title="Play room" href="'+host+'/sites/all/modules/movecalc/images/rooms/playroom.png"><img title="Basement" src="'+host+'/sites/all/modules/movecalc/images/rooms/playroom.png"></a>';	
				break; 	
			 }			
	}
	function HideRoom(room){
		var roomVal = room.val();
		var roomSize = $("#edit-size-move").val();
		 switch (roomVal) {		
			case ('2'): // Dinnig Room
				$('.dinning_room').remove();	
				break; 	
			case ('3'): // Dinnig Room
				$('.office_room_'+roomSize).remove();	
				break; 	
			case ('4'): // Dinnig Room
				$('.extra_room_'+roomSize).remove();	
				break; 	
			case ('5'): // Dinnig Room
				$('.basement_room').remove();	
				break; 	
			case ('6'): // Dinnig Room
				$('.garage_room').remove();	
				break; 	
			case ('7'): // Dinnig Room
				$('.patio_room').remove();	
				break; 	
			case ('8'): // Dinnig Room
				$('.play_room').remove();	
				break; 	
			 }
		
	}
	
			var images = new Array()
			function preload() {
				for (i = 0; i < preload.arguments.length; i++) {
					images[i] = new Image()
					images[i].src = preload.arguments[i]
				}
			}
			preload(
				host+'/sites/all/modules/movecalc/images/rooms/smroom.png',
				host+'/sites/all/modules/movecalc/images/rooms/sm1sm.png',				
				host+'/sites/all/modules/movecalc/images/rooms/sm2sm.png',
				host+'/sites/all/modules/movecalc/images/rooms/sm2lar.png',
				host+'/sites/all/modules/movecalc/images/rooms/sm1lar.png',
				host+'/sites/all/modules/movecalc/images/rooms/sm3bed.png',
				host+'/sites/all/modules/movecalc/images/rooms/smoffice.png',
				host+'/sites/all/modules/movecalc/images/rooms/smextraroom.png',
				host+'/sites/all/modules/movecalc/images/rooms/smbasement.png',
				host+'/sites/all/modules/movecalc/images/rooms/smdr.png',	
				host+'/sites/all/modules/movecalc/images/rooms/garage.png',	
				host+'/sites/all/modules/movecalc/images/rooms/smpatio.png',	
				host+'/sites/all/modules/movecalc/images/rooms/playroom.png'
			)
	
	
}(jQuery));