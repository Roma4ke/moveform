jQuery(document).ready(function($){

	
	
	updatePrice();
	updateTabel();
	 $("input[type='text']").change(function() {
		var $this = $(this);
		updateTotal($this);
	});
	
	 $(".editablefield-edit").change(function() {
		updatePrice();
		
	});
	
	function updateTotal(row) {
	    
		var travelTime =  parseFloat($(row).closest('tr').find('.views-field-nothing').text());
			var maxLT =  parseFloat($(row).closest('tr').find(".field-max-loading-time input[type='text']").val());
			var minLT =  parseFloat($(row).closest('tr').find(".field-min-loading-time input[type='text']").val());
			var maxUT =  parseFloat($(row).closest('tr').find(".field-max-unloading-time input[type='text']").val());
			var minUT =  parseFloat($(row).closest('tr').find(".field-min-unloading-time input[type='text']").val());
			var pricePerHour = parseFloat($(row).closest('tr').find('.field-price-per-hour-time-table').text());
			 
			var totalMinHours = minLT + minUT + travelTime;
			var totalMaxHours = maxLT + maxUT + travelTime;	 
			var MinTotalPrice = pricePerHour*totalMinHours;
			var MaxTotalPrice = pricePerHour*totalMaxHours;
		 
			var totalHours = $(row).closest('tr').find(".views-field-expression").empty().append('<div class="total">'+totalMinHours +' - '+ totalMaxHours+'</div>');
			var maxTotalPrice = $(row).closest('tr').find(".views-field-expression-2").empty().append('<div class="total">'+MinTotalPrice +' - '+ MaxTotalPrice+'</div>');
	
	};
	
	
	function updateTabel () {
	  $('.views-table tr').each(function (i, row) {

		if( i == 0) return;
        // reference all the stuff you need first
        var $row = $(row);
		updateTotal($row);
           
	});
	};
	
	
	function updatePrice () {
	var price = 110;
	  $('.views-table tr').each(function (i, row) {
		var $row = $(row);
		
		if( i == 0) return;
        // reference all the stuff you need first
		if( i == 1) {
			price = parseFloat($($row).closest('tr').find(".field-price-per-hour-time-table").text());
			return;
			}
		
        
		$($row).closest('tr').find(".field-price-per-hour-time-table").text(price);
           
	});
	};
	
});