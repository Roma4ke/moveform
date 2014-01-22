(function ($) {

var calendar;
Drupal.behaviors.movecalc = {
  attach: function (context) {
	calendar = Drupal.settings.movecalc.calendar;
	
    for (var id in Drupal.settings.datePopup) {
	  Drupal.settings.datePopup[id].settings.changeYear	= false;
	 // Drupal.settings.datePopup[id].settings.dateFormat	= "F t, Y (l)";
	   Drupal.settings.datePopup[id].settings.changeMonth = false;
      Drupal.settings.datePopup[id].settings.beforeShowDay = checkDate;
    }
  }
	 
};

	 function checkDate(date) {		
			var day = (date.getDate().toString()).slice(-2);
			var month = ((date.getMonth() + 1).toString()).slice(-2);
			var year = date.getFullYear();			
			var date = year+'-'+month+'-'+day;	
			if(calendar[date]=='block_date')
				return [false, 'not-available', 'This date is NOT available'];
			else
				return [true, calendar[date], calendar[date]];
		
			}
			
		
	
		
})(jQuery);