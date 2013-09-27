
(function($)
{

	var w_formId = '#movecalc-moving-form';
	Drupal.behaviors.formTheme = {
		attach:function() {
		
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will 
			if(Drupal.settings.calculator != undefined){
			
			    
				
				var date = Drupal.settings.calculator.date;
				var btn = '.'+Drupal.settings.calculator.this;
				//Calculate results
				if(Drupal.settings.calculator.step == 'Calculate >>'){
				
					current_fs = $(btn).parent().parent();
					next_fs = $(btn).parent().parent().next();
					
					   if(!validateStep('#edit-calculator')){					
							//activate next step on progressbar using the index of next_fs
							$("#progressbar li").eq($("#msform fieldset").index(next_fs)).addClass("active");
							
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
								}, 
								//this comes from the custom easing plugin
								easing: 'easeInOutBack'
								})
						}				
					}
				if(Drupal.settings.calculator.step == '<< Back to Calculator'){
					current_fs = $(btn).parent().parent();
					previous_fs = $(btn).parent().parent().prev();
					
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
						}, 
						//this comes from the custom easing plugin
						easing: 'easeInOutBack'
					});
			
				}
					
			}
					
	
			
		
					
			
		}
		
	};
	
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