<?php

/*
  Admin Funtcion
*/

function movecalc_show_total($form,&$form_state){
	
	$form['movecalc_show_total'] = array(
		'#title' => t('Request Form Settings'),
		'#type' => 'checkboxes',
		'#default_value' => variable_get('movecalc_show_total'),
		'#options' => array (
		 '1' => t('Show Total Price'),
		 ),
	
	);
	$form['movecalc_regular_info_right_sidebar'] = array(
		'#title' => t('Regular info in right sidebar of moving form.'),
		'#type' => 'textarea',
		'#default_value' => variable_get('movecalc_regular_info_right_sidebar'),
	
	);
		$form['movecalc_storage_info_right_sidebar'] = array(
		'#title' => t('Storage info in right sidebar of moving form.'),
		'#type' => 'textarea',
		'#default_value' => variable_get('movecalc_storage_info_right_sidebar'),
	
	);
	$form['movecalc_size_room_text'] = array(
		'#title' => t('Size Of Move : Room (description)'),
		'#type' => 'textarea',
		'#default_value' => variable_get('movecalc_size_room_text'),
	
	);
	
	return(system_settings_form($form));


}

function  movecalc_calendar_page_callback(){
	
	 drupal_add_library('system', 'drupal.ajax');
    drupal_add_library('system', 'jquery.form');
	
	$popup_form = '
	<ul class="children" id="type_popup">
             <li class="'._movecalc_get_type_name(1).'"><a href="#" value="1" id="'._movecalc_get_type_name(1).'">'._movecalc_get_type_name(1).'</a></li>
             <li class="'._movecalc_get_type_name(2).'"><a href="#" value="2"  id="'._movecalc_get_type_name(2).'">'._movecalc_get_type_name(2).'</a></li>
			<li class="'._movecalc_get_type_name(3).'"><a href="#" value="3" id="'._movecalc_get_type_name(3).'">'._movecalc_get_type_name(3).'</a></li>
			<li class="'._movecalc_get_type_name(4).'"><a href="#" value="4" id="'._movecalc_get_type_name(4).'">'._movecalc_get_type_name(4).'</a></li>
			<li class="'._movecalc_get_type_name(5).'"><a href="#" value="5" id="'._movecalc_get_type_name(5).'">'._movecalc_get_type_name(5).'</a></li>
			<li class="'._movecalc_get_type_name(6).'"><a href="#" value="6" id="'._movecalc_get_type_name(6).'">Block This Day</a></li>
	</ul>';
	
	
	$current = date("Y");
	$next_year = date('Y', strtotime('+1 year'));
	_movecalc_init_calendar($next_year);
	
	$calendars = '<h1 class="calendar">'.$current.'</h1>'._movecalc_render_calendar($current).'<h1 class="calendar">'.$next_year.'</h1>'._movecalc_render_calendar($next_year);
	$output = $calendars.$popup_form;
	
	return $output;
}

function _movecalc_render_calendar($year){
		/* draw table */
	$year_calendar = '';
	for($month = 1; $month <=12; $month++){	
	$month_name  = date("F", mktime(0, 0, 0, $month, 10));	
	$calendar = 
	'<table class="cal">
	<caption>'.$month_name .' '.$year.'</caption>
	<thead> <tr>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
          <th>Sun</th>
        </tr>
      </thead>
	<tbody>';
	
	
	/* days and weeks vars now ... */
	//$running_day = date('w',mktime(0,0,0,$month,1,$year));
	$running_day = date('N',mktime(0,0,0,$month,1,$year))-1;
	$days_in_month = date('t',mktime(0,0,0,$month,1,$year));
	$days_in_this_week = 1;
	$day_counter = 0;
	$dates_array = array();

	/* row for week one */
	$calendar.= '<tr class="calendar-row">';

	/* print "blank" days until the first of the current week */
	for($x = 0; $x < $running_day; $x++):
		$calendar.= '<td class="calendar-day-np"> </td>';
		$days_in_this_week++;
	endfor;

	/* keep going with days.... */
	for($list_day = 1; $list_day <= $days_in_month; $list_day++):
		$calendar.= '<td class="calendar-day">';
			/* add in the day number */
			$date = $year.'-'.$month.'-'.$list_day;
			$peak = _movecalc_get_peak_type($date);
			$calendar.= '<a href="#" title="'.$peak.'" value="'.$date.'" class="day-number '.$peak.'">'.$list_day.'</a>';

			
		$calendar.= '</td>';
		if($running_day == 6):
			$calendar.= '</tr>';
			if(($day_counter+1) != $days_in_month):
				$calendar.= '<tr class="calendar-row">';
			endif;
			$running_day = -1;
			$days_in_this_week = 0;
		endif;
		$days_in_this_week++; $running_day++; $day_counter++;
	endfor;

	/* finish the rest of the days in the week */
	if($days_in_this_week < 8):
		for($x = 1; $x <= (8 - $days_in_this_week); $x++):
			$calendar.= '<td class="calendar-day-np"> </td>';
		endfor;
	endif;

	/* final row */
	$calendar.= '</tr>';

	/* end the table */
	$calendar.= '</table>';
	
	/* all done, return result */
	$year_calendar = $year_calendar.$calendar;
	}
	
	return $year_calendar;
}
	function _movecalc_init_calendar($year) {
	
	//INIT Table price for Year
	for($month = 1; $month <= 12 ; $month++){
	
		// days and weeks vars now ... 
		$running_day = date('w',mktime(0,0,0,$month,1,$year));
		$days_in_month = date('t',mktime(0,0,0,$month,1,$year));
		$days_in_this_week = 1;
		$day_counter = 0;
		$dates_array = array();
	
		for($day=1;$day <= $days_in_month; $day++){
			$date = $year.'-'.$month.'-'.$day;
			
			$peak_type = movecalc_peak_date($date);		
			$record = movecalc_get_calendar_type($date);	
				
			if($record === FALSE) {
			$record = new StdClass();
			$record->date = $date;
			$record->price_type = $peak_type;	
			
			movecalc_set_calendar_type($record);		
			}
			else
				return;
			
			
		}
		
	
	}

}
 /*** 
 *    Calendar Helpful Funtcion
**/

function movecalc_peak_date($mydate) {
	$peak = 1;
	$month = date("n",strtotime($mydate));
	$day = date('d',strtotime($mydate));
	$dw = date( "w", strtotime($mydate));
	

	if($dw == 0) { //if sunday
		$peak = 4;
	}elseif($dw == 5 || $dw == 6 || $day == 30 || $day == 31 || $day == 29 || $day == 28 ) { //if friday or saturday
	    $peak = 3;
	}else
	  $peak = 2;
	 
	return $peak;
}


function movecalc_set_calendar_type($record){
	// sanity check
	if(!is_object($record)){
		return watchdog('movecalc','We could not update calendar_type',array(),WATCHDOG_ERROR);
	}
	
	// INSERT/ UPDATE into price_calendar ('date','price_type') VALUES ('date','price_type')
	$query = db_merge('price_calendar')
		->key(array('date'=>$record->date))
		->fields((array) $record);
		
	$query->execute();

}
/*
1| Discount
2| Regular
3| Peak
4| Preseason&Sunday
5| Seaonals&Holiday
*/