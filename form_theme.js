
(function($)
{

	var w_formId = '#movecalc-moving-form';
	var animating;
	Drupal.behaviors.formTheme = {
		attach: function (context, settings) {
     // any behavior is now applied once
    
		
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will 
			if(Drupal.settings.validate != undefined){
			var current = $('.'+Drupal.settings.validate.this).parent().parent();
				validateStep(current);
			}
			if(Drupal.settings.calculator != undefined){
						
				var date = Drupal.settings.calculator.date;
				var btn = '.'+Drupal.settings.calculator.this;
				var current = $(btn).parent().parent();
				//Calculate results			
				if(Drupal.settings.calculator.step == 'Calculate >>'){
						nextstep('#edit-calculator');
								 
					}
				//Back to steps
				if(Drupal.settings.calculator.step ==  ('<< Back to Calculator' || '<< Back to Calendar')){
									
					prevstep(current);
			
				}
				//Confirm AJax Step 
				if(Drupal.settings.calculator.step == 'Confirm'){
				
								 nextstep('#edit-summery');
								 
					}
					
			}
	
				
		$('#go-calculator-results-btn').once('next-result').click(function() {
         var date = $(this).val();
		 $('#edit-moving-from-zip').val(Drupal.settings.calculator.zip_to);
		 $('#edit-moving-to-zip').val(Drupal.settings.calculator.zip_from);
		 
		 $('#edit-moving-from-city').val(Drupal.settings.calculator.city_from);
		 $('#edit-moving-to-city').val(Drupal.settings.calculator.city_to);
		 
		 $('#edit-moving-from-state').val(Drupal.settings.calculator.state_from);
		 $('#edit-moving-to-state').val(Drupal.settings.calculator.state_to);
		
		 
		 
		 nextstep('#edit-calculator-results');
		 
        return false;
      })
	  	$('#back-to-calendar-btn').once('calendar-btn').click(function() {
        
		 prevstep('#edit-personal-info');
		 
        return false;
      })
		$('#back-to-info-btn').once('back-summery').click(function() {
        
		 prevstep('#edit-summery');
		 
        return false;
      })
	 $( ".required").once('input-element').change(function() {
		var $this = $(this);
		$("#calc-results" ).hide();
			  var valueLength = jQuery.trim($this.val()).length;
			
			  if (valueLength != '') {
				 $this.removeClass('error');
			  }
			  if($this.attr( "id" ) == 'edit-zip-code-from' || $this.attr( "id" ) == 'edit-zip-code-to'){
			    $("#calc-results").empty();
			     var error = "<span class='title'>Address Alert!</span><p>Zip code you have provided does not exist.</p>";
				$.get( "http://maps.googleapis.com/maps/api/geocode/json?address="+$this.val()+'&sensor=true', function( data ) {			
				
				if(data['status']=='OK' && (data['results'][0]['address_components'][3]['short_name'] == 'US' || data['results'][0]['address_components'][4]['short_name'] == 'US')){
				  if( $this.attr( "id" ) == 'edit-zip-code-from')
					$("#calc-results" ).append("Moving From : "+data['results'][0]['formatted_address']).show("slow").delay( 1000 ).hide(2000);	
				  else 
					$("#calc-results" ).append("Moving To: "+data['results'][0]['formatted_address']).show("slow").delay( 1000 ).hide(2000);	
					
				$this.removeClass('error');
						}
				else {
					$("#calc-results" ).append(error).show("slow").delay( 1000 ).hide(2000);
						$this.addClass('error');	
						$this.val('');
					}
				});		  
			  }
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
					
			
	}};
	
	
	function nextstep(current) {
	
	if(animating) return false;
	animating = true;
	
	current_fs = $(current);
	next_fs = $(current).next();
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
		   });
		   
		   
		   return hasError;
		}
	
	
	
}(jQuery));