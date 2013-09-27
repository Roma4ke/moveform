(function ($) {
var dates_not_allowed = {
          '2014-01-01': 1,
          '2013-12-25': 1
          //'2013-08-29': 1,
          //'2013-08-30': 1,
          //'2013-08-31': 1
    };

Drupal.behaviors.movecalc = {
  attach: function (context) {
    for (var id in Drupal.settings.datePopup) {
      Drupal.settings.datePopup[id].settings.beforeShowDay = checkDate;
    }
  }
	 
};

	 function checkDate(date) {
		  function addZero(no) {
					 if (no < 10){
						return "0" + no;
					 }  else {
						return no; 
					 }
				}		
			var day = ('0' + date.getDate().toString()).slice(-2);
			var month = ('0' + (date.getMonth() + 1).toString()).slice(-2);
			var week = date.getDay();
			var year = date.getFullYear();
			
			var date_str = [
				 addZero(date.getFullYear()),
				 addZero(date.getMonth() + 1),
				 addZero(date.getDate())      
			].join('-');
		
			if (dates_not_allowed[date_str]) {
				return [false, 'not-available', 'This date is NOT available'];
			} else {
				var cur_rate = peakDates(week,day);
				if (cur_rate == 1) return [true, 'peak-rate', 'Peak Rates'];
				if (cur_rate == 2) return [true, 'seasonal-rate', 'Seasonal Rates'];
				return [true, 'regular-rate', 'Regular Rates'];
			}
		}
		
		function peakDates(dw,day){
		 var peak = 0;
		if(dw == 0) { //if sunday
		  peak = 1;
		}else if(dw == 5 || dw == 6 || day == 30 || day == 31 || day == 29 || day == 28 || day == 1) { //if friday or saturday
		  peak = 2;
		}else
		  peak = 0;
		
		  return peak;
		}
})(jQuery);