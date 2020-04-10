(function ( $ ) {

	var $body = $('body');

    var converter = new DateConverter();
    converter.setCurrentDate();

    $('form').attr('autocomplete','off');
    
    $.fn.advancedNepaliDatePicker = function( options  ) {

        var inline_datepicker = 0;
        var $inline_selector = '';
    
        var this_year = converter.getNepaliYear();
        var this_month = converter.getNepaliMonth();
        var start_year = 2000;
        var end_year = 2098;
        var $days_container = '';
        var $year_select = '';
        var $month_select = '';
        var user_selected_dates = [];
        var last_captured_date = '';

        var hidden_field_name = '';

        // give calendar a unique id

        var cal_no = 1;
        $(this).each(function(){

            $(this).attr('data-cal_id', 'cal-' + cal_no);
            cal_no++;

            // this will run once only in startup
            // generate hidden fields if not inline date picker

            var hidden_inputs = '';

            if( !$(this).hasClass('andp-inline') ){

                // generate hidden input field with name similar to main selector input
                hidden_field_name = $(this).data('name');
                cal_id = $(this).data('cal_id');

                // if there is value, then use it
                $('span.badge-date', this).each(function(){

                    hidden_inputs += '<input type="hidden" class="hidden-andp-dates dynamic" name="' + hidden_field_name + '[]" data-cal_id="' + cal_id + '" value="' + $(this).text() + '">';
    
                })

                $('#new-ads-form').append(hidden_inputs);

            }

        }) 
        // end each loop


        $(this).click(function(){

            user_selected_dates = [];
            hidden_field_name = $(this).data('name');


            // remove previous instance of calendar
            $(".andp-datepicker-container").remove();

            if( $(this).hasClass('andp-inline') ){
                inline_datepicker = 1;
                $inline_selector = $(this);
    
                $('.andp-info').show();
            }
            else{
                inline_datepicker = 0;
                $('.andp-info').hide();
            }
            

            cal_id = $(this).data('cal_id');

            // initiate calendar ui
            init( cal_id );

            // calendar layout and position in dom
            var elem_pos = $(this).offset();
            var elem_height = $(this).outerHeight();

            // var right_offset = $('body').width() - elem_pos.left - $(this).innerWidth()-2;

            $('.andp-datepicker-container').addClass('open').css({'top': elem_pos.top + elem_height, 'left': elem_pos.left });


            if( inline_datepicker ){

                // inline calendar
                selected_date = $(this).val();
                select_date(selected_date );
                // just_select_dates(selected_date);

                user_selected_dates.push(selected_date);

                // switch calendar to selected month and year
                if( selected_date.length > 0 ){
                    older_date_ar = selected_date.split('-');
                    $month_select.val(older_date_ar[1]).change();
                    $year_select.val(older_date_ar[0]).change();
                }
                
            }
            else{
                // multi select calendar

                var $hidden_publish_dates = $('input.hidden-andp-dates[data-cal_id="' + cal_id + '"]');
                var total_hidden_dates = $hidden_publish_dates.length;

                if( total_hidden_dates > 0){

                    // select all dates in calendar ui
                    $hidden_publish_dates.each(function(){
                        selected_date = $(this).val();
                        select_date( selected_date );
                    })

                    // last selected date
                    older_date = $('input.hidden-andp-dates[data-cal_id="' + cal_id + '"]:last-child').val();

                    // switch calendar to last month and year of selected date
                    if( older_date.length > 0 ){
                        older_date_ar = older_date.split('-');

                        $month_select.val(older_date_ar[1]).change();
                        $year_select.val(older_date_ar[0]).change();
                    }
                }
                
            }
    
        })

        function init(cal_id){

            var template = '<div class="andp-datepicker-container" data-cal_id="' + cal_id +  '" >';
            template += '<div class = "andp-header">';
            template += '<button type = "button"  class = "andp-prev andp-change-months"> < </button>';
            template += '<select class = "andp-month-select"> </select>';
            template += '<select class = "andp-year-select"> </select>';
            template += '<button type = "button" class = "andp-next andp-change-months"> > </button> ';
            template += '</div>';
            template += '<div class="andp-body">';
            template += '<div class = "andp-days-names"> <div> SUN </div> <div> MON </div> <div> TUE </div> <div> WED </div> <div> THU </div> <div> FRI </div> <div> SAT </div> </div>';
            template += '<div class = "andp-days-numbers"> </div>';
            
            if( !inline_datepicker ){
                template += '<div class="andp-info" style="display:none"><i class="mdi mdi-information text-primary"></i> Try <strong>Ctrl</strong> or <strong>Shift</strong> key </div>';
            }
            template += '<div class="andp-action-btns">';   
            template += '<button type="button" id="apply-date" data-cal_id="' + cal_id +  '">Apply</button>';
            template += '</div>';
            template += '</div>';
            template += '</div>';
            
            $body.append(template);

            $year_select = $('.andp-year-select');
            $month_select = $('.andp-month-select');
            $days_container = $('.andp-days-numbers');
            
            // add month into month select
            append_html = '<option value = "1" ' + (('1' == this_month) ? 'selected' : ' ') + ' > Baisakh </option>';
            append_html += '<option value = "2" ' + (('2' == this_month) ? 'selected' : '') + ' > Jestha </option>';
            append_html += '<option value = "3" ' + (('3' == this_month) ? 'selected' : '') + ' > Asar </option>';
            append_html += '<option value = "4" ' + (('4' == this_month) ? 'selected' : '') + ' > Shrawan </option>';
            append_html += '<option value = "5" ' + (('5' == this_month) ? 'selected' : '') + ' > Bhadra </option>';
            append_html += '<option value = "6" ' + (('6' == this_month) ? 'selected' : '') + ' > Ashoj </option>';
            append_html += '<option value = "7" ' + (('7' == this_month) ? 'selected' : '') + ' > Kartik </option>';
            append_html += '<option value = "8" ' + (('8' == this_month) ? 'selected' : '') + ' > Mangsir </option>';
            append_html += '<option value = "9" ' + (('9' == this_month) ? 'selected' : '') + ' > Poush </option>';
            append_html += '<option value = "10" ' + (('10' == this_month) ? 'selected' : '') + ' > Magh </option> ';
            append_html += '<option value = "11" ' + (('11' == this_month) ? 'selected' : '') + ' > Falgun </option>';
            append_html += '<option value = "12" ' + (('12' == this_month) ? 'selected' : '') + ' > Chaitra </option>';

            
            $month_select.append(append_html);


            // add year into year select
            for( i = start_year; i <= end_year; i++){
                append_html = '<option value="' + i + '"';
                if(i == this_year){
                    append_html += ' selected';
                }
                append_html += '>'+ i + '</option>';
                $year_select.append(append_html);
            }

            generate_days();


            $('.andp-month-select, .andp-year-select').change(function(){
                generate_days();
            });


        }

        function generate_days(){

            month = $month_select.val();
            year = $year_select.val();

            $days_container.html('');

            var selected_date_obj = new DateConverter();
            selected_date_obj.setNepaliDate(year, month,1);
            
            var month_start_day = selected_date_obj.getDay();
            var total_days_in_selected_month = getDaysInMonth(year, month);

            var y=1;
            append_html = '';
            var j = 1;
            var k = parseInt(month_start_day) - 2;
            var l = 1;
            for(i = 1; i <= 42; i++){

                last_month = parseInt(month) - 1;
                last_year = parseInt(year);

                if(last_month < 1){
                    last_month = 12;
                    last_year = last_year - 1 ;

                    if( last_year < start_year){
                        last_year = start_year;
                        last_month = 1;
                    }

                }

                next_month = parseInt(month) + 1;
                next_year = parseInt(year);

                var total_days_in_last_month = getDaysInMonth(last_year, last_month);

                if( y == 1){
                    append_html += '<div class="andp-column">';
                }
                
                if( i < month_start_day ){
                    append_html += '<div class="old-dates"> ' +  parseInt(total_days_in_last_month - k ) + ' </div>';
                    k = k-1;
                }
                else{
                    if( j <= total_days_in_selected_month ){

                        proper_date = year + '-' + month + '-' + j;

                        var ar_index = user_selected_dates.indexOf(proper_date);

                        
                        append_html += '<div class="day ' + (( ar_index >= 0  ) ? ' selected' : '') + '" data-date="' +  proper_date + '">' + j + '</div>';
                        j++;
                    }
                    else{
                        append_html += '<div  class="old-dates"> ' +  l + '</div>';
                        l++;
                    }
                }

                if( y == 7){
                append_html += '</div>';
                    y = 0;
                }

                // if( j > total_days_in_selected_month){
                //     break;
                // }

                
                y++;
            
            }
            
            $days_container.append(append_html);
        }

        function getDaysInMonth(year, month){
            var converter = new DateConverter();
            
            if( year < start_year || year > end_year ) return;
            if( month < 1 || month > 12 ) return;
            
            var year = year - start_year;
            var month = month -1;
        
            return converter.nepaliMonths[year][month];
        
        }

        function get_days_difference(date_1, date_2){

            date_1 = date_1.split('-');
            date_2 = date_2.split('-');

            var converter = new DateConverter();
            converter.setNepaliDate( date_1[0],date_1[1], date_1[2] );
            return converter.getNepaliDateDifference( date_2[0],date_2[1], date_2[2] );
        }

        function find_older_date(date_1, date_2){
            date_1 = date_1.split('-');
            date_2 = date_2.split('-');

            var converter = new DateConverter();
            converter.setNepaliDate(date_1[0],date_1[1], date_1[2]);
            var date_1_eng = [converter.getEnglishYear(), converter.getEnglishMonth(), converter.getEnglishDate()];

            converter.setNepaliDate(date_2[0],date_2[1], date_2[2]);
            var date_2_eng = [converter.getEnglishYear(), converter.getEnglishMonth(), converter.getEnglishDate()];

            var firstDate = new Date(date_1_eng[0],date_1_eng[1], date_1_eng[2]);
            var secondDate = new Date(date_2_eng[0],date_2_eng[1], date_2_eng[2]);

            if( firstDate > secondDate ){
                return 1;
            }
            else{
                return false;
            }
        }

        function get_next_day(date_1){
            date_1 = date_1.split('-');

            year =  parseInt(date_1[0]);
            month = parseInt(date_1[1]);

            var days_in_month = parseInt(getDaysInMonth( year, month ));

            day = parseInt(date_1[2]) + 1;
            if( day > days_in_month){
                day = 1;
                month = month +1;
                
                if( month > 12){
                    month = 1;
                    year = year + 1;
                }
            }

            return year + '-' + month + '-' + day;
        }

        function select_date(selected_date, cal_id, force_select=0){

            var ar_index = user_selected_dates.indexOf(selected_date);
            var $this = $('.andp-column .day[data-date="' + selected_date + '"]');

            if( force_select ){
                $this.addClass('selected');
            }
            else{

                if( ar_index < 0  ){
                    // date does not exist
                    user_selected_dates.push(selected_date);
                    $this.addClass('selected');
                }
                else{
                    // date already added
                    user_selected_dates.splice(ar_index, 1);
                    $this.removeClass('selected');
                    
                }
            }
        }


        // change months
        $body.on('click', '.andp-change-months', function(event){
            // show next month
            selected_month = parseInt($month_select.val()) ;
            selected_year = parseInt($year_select.val());

            if( $(this).hasClass('andp-next')){
                selected_month = selected_month + 1;
                if( selected_month > 12){
                    selected_month = 1;
                    selected_year = selected_year + 1;

                    if( selected_year > end_year){
                        selected_year = end_year;
                        selected_month = 12;
                    }
                }
            }
            else{
                selected_month = selected_month - 1;
                if( selected_month < 1){
                    selected_month = 12;
                    selected_year = selected_year - 1;

                    if( selected_year < start_year){
                        selected_year = start_year;
                        selected_month = 1;
                    }
                }
            }
            

            $month_select.val( selected_month ).change();
            $year_select.val( selected_year ).change();

        });
        
        // if clicked in days when datepicker is open
        $body.on('click', '.andp-days-numbers .day', function(event){
            
            selected_day = $(this).text();
            selected_date = $(this).data('date'); 

            // disable shift or ctrl key on inline_datepicker

            if( inline_datepicker ){
                user_selected_dates = [];
                $('.andp-column .day').removeClass('selected');
                select_date(selected_date );

                $('.andp-info').hide();
            }
            else{

                if (event.shiftKey) {

                    var total_captured_dates = user_selected_dates.length;

                    if( total_captured_dates > 0){
                        selected_date = $(this).data('date'); 
                        last_captured_date =  user_selected_dates[total_captured_dates-1];

                        // get older date
                        var smaller_date = (find_older_date( selected_date, last_captured_date)) ? last_captured_date :  selected_date;
                        var next_date = smaller_date;

                        var days_difference = get_days_difference(selected_date, last_captured_date);

                        // reset all caputured dates
                        user_selected_dates = [];
                        $('.andp-column .day').removeClass('selected');

                        select_date(next_date );

                        for( i = 1; i <= days_difference; i++){

                            next_date = get_next_day(next_date);
                            select_date(next_date );
                        }
                        
                    }
                } 
                else  if (event.ctrlKey || event.metaKey) {
                    select_date(selected_date );
                }
                else{
                    user_selected_dates = [];
                    $('.andp-column .day').removeClass('selected');
                    select_date(selected_date );

                    $('.andp-info').show();
                    
                }

            }

            

        })

        // close datepicker when clicked outside
        $(document).on('click', function (e) {

            var container = $(".andp-datepicker-container, .dsi-datepicker");

            // if the target of the click isn't the container nor a descendant of the container
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $(".andp-datepicker-container").remove();
            }

        });


        // insert/update date only if appy-date button was clicked
        $(document).on('click', '#apply-date', function(){

            cal_id = $(this).data('cal_id');

            // do not proceed if no date was selected
            if( user_selected_dates.length < 1 ) {
                $(".andp-datepicker-container").hide();
                return;
            }

            // some date were selected, proceed

            append_html = '';
            hidden_inputs = '';
            for( i = 0; i <= user_selected_dates.length-1; i++){
                
                if( inline_datepicker ){
                    $inline_selector.attr( 'value',  user_selected_dates[i] );
                    $('#sel-date').attr( 'value',  user_selected_dates[i] );
                }
                else{
                    append_html += '<span class="badge badge-dark badge-date">' + user_selected_dates[i] + '</span>';
                    hidden_inputs += '<input type="hidden" class="hidden-andp-dates dynamic" name="' + hidden_field_name + '[]" data-cal_id="' + cal_id + '" value="' + user_selected_dates[i] + '">';

                    $('.dsi-datepicker[data-cal_id="' + cal_id + '"]').html(append_html);
                    $('.hidden-andp-dates[data-cal_id="' + cal_id + '"]').remove();
                    $('#new-ads-form').append(hidden_inputs);
                }
            }


            $(".andp-datepicker-container").remove();
        })

    };


	function DateConverter(){
		this.englishMonths = [31, 28, 31, 30, 31, 30,31, 31, 30, 31, 30, 31];
		this.englishLeapMonths = [31, 29, 31, 30, 31, 30,31, 31, 30, 31, 30, 31];
	
		this.nepaliMonths = [
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],  //2000
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],  //2001
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ], // 2002
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ], // 2003
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ], // 2004
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ], // 2005
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ], // 2006
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ], // 2006
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31 ], // 2007
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ], // 2008
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ], // 2009
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ], // 2010
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],
			[ 31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],  //2071
			[ 31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],  //2072
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31 ],  //2073
			[ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ], // 2076
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31 ],
			[ 31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30 ],
			[ 31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30 ],
			[ 30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],  //2090
			[ 31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30 ],
			[ 30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30 ],
			[ 30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30 ],
			[ 31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30 ],
			[ 31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31 ],
			[ 31, 31, 32, 31, 31, 31, 30, 29, 29, 30, 30, 30 ]   //2099
			];
			
		this.setCurrentDate = function(){
			var d = new Date();
			this.setEnglishDate(d.getFullYear(), d.getMonth()+1, d.getDate());
		};
	
	
		//English to Nepali date conversion
	
		this.setEnglishDate = function(year, month, date){
			if(!this.isEnglishRange(year,month,date))
					throw new Exception("Invalid date format.");
	
			this.englishYear = year;
			this.englishMonth = month;
			this.englishDate = date;
	
			//Setting nepali reference to 2000/1/1 with english date 1943/4/14
			this.nepaliYear = 2000;
			this.nepaliMonth = 1;
			this.nepaliDate = 1;
	
			var difference = this.getEnglishDateDifference(1943, 4, 14);
	
			//Getting nepali year untill the difference remains less than 365
			var index = 0;
			while( difference >= this.nepaliYearDays(index) ){
				this.nepaliYear++;
				difference = difference - this.nepaliYearDays(index);
				index++;
			}
	
			//Getting nepali month untill the difference remains less than 31
			var i = 0;
			while(difference >= this.nepaliMonths[index][i]){
				difference = difference - this.nepaliMonths[index][i];
				this.nepaliMonth++;
				i++;
			}
	
			//Remaning days is the date;
			this.nepaliDate = this.nepaliDate + difference;
	
			this.getDay();
	
		};
	
		this.toEnglishString = function(format){
			if (typeof(format)==='undefined')
				format="-";
			return this.englishYear+format+this.englishMonth+format+this.englishDate;
		};
	
		this.getEnglishDateDifference = function(year, month, date){
	
			//Getting difference from the current date with the date provided
			var difference = this.countTotalEnglishDays(this.englishYear, this.englishMonth, this.englishDate) - this.countTotalEnglishDays(year, month, date);
			return (difference < 0 ? -difference : difference );
	
		};
		
		this.countTotalEnglishDays = function(year, month, date){
			var totalDays = year * 365 + date;
	
			for(var i=0; i < month-1; i++)
				totalDays = totalDays + this.englishMonths[i];
	
			totalDays = totalDays +this.countleap(year, month);
			return totalDays;
		};
				
		this.countleap = function(year, month)
		{
			if (month <= 2)
				year--;
	
			return (Math.floor(year/4)-Math.floor(year/100)+Math.floor(year/400));
		};
	
		this.isEnglishRange = function(year, month, date)
		{
			if(year < 1944 || year > 2042)
				return false;
	
			if(month < 1 || month > 12)
				return false;
	
			if(date < 1 || date > 31)
				return false;
	
			return true;
		};
		
		this.isLeapYear = function(year){
			if(year%4 === 0){
			return (year%100 === 0) ? (year%400 === 0) : true;                
			}
			else
			return false;
		};
		
		
		//Nepali to English conversion
		
		this.setNepaliDate = function(year, month, date){
			if(!this.isNepaliRange(year,month,date))
				throw new Exception("Invalid date format.");
	
			this.nepaliYear = year;
			this.nepaliMonth = month;
			this.nepaliDate = date;
	
			//Setting english reference to 1944/1/1 with nepali date 2000/9/17
			this.englishYear = 1944;
			this.englishMonth = 1;
			this.englishDate = 1;
	
			var difference = this.getNepaliDateDifference(2000, 9, 17);
	
			//Getting english year untill the difference remains less than 365
			while( difference >= (this.isLeapYear(this.englishYear) ? 366 : 365)){
				difference = difference - (this.isLeapYear(this.englishYear) ? 366 : 365);
				this.englishYear++;
			}
	
			//Getting english month untill the difference remains less than 31
			var monthDays = this.isLeapYear(this.englishYear) ? this.englishLeapMonths : this.englishMonths;
			var i = 0;
			while( difference >= monthDays[i]){
				this.englishMonth++;
				difference = difference - monthDays[i];
				i++;
			}
	
			//Remaning days is the date;
			this.englishDate = this.englishDate + difference;
	
			this.getDay();
	
		};
	
		this.toNepaliString = function(format){
			if (typeof(format)==='undefined')
				format="-";
			return this.nepaliYear+format+this.nepaliMonth+format+this.nepaliDate;
		};
	
		this.getNepaliDateDifference = function(year, month, date){
	
			//Getting difference from the current date with the date provided
			var difference = this.countTotalNepaliDays(this.nepaliYear, this.nepaliMonth, this.nepaliDate) - this.countTotalNepaliDays(year, month, date);
			return (difference < 0 ? -difference : difference );
	
		};
	
		this.countTotalNepaliDays = function(year, month, date){
			var total = 0;
			if(year < 2000)
					return 0;
	
			total = total + (date-1);
	
			var yearIndex = year - 2000;
			for(var i=0; i < month-1; i++)
				total = total + this.nepaliMonths[yearIndex][i];
	
			for(var i=0;i < yearIndex; i++)
				total = total + this.nepaliYearDays(i);
	
			return total;
		};
		
		this.nepaliYearDays = function(index)
		{
			var total = 0;
	
			for(var i = 0 ; i < 12; i++)
				total += this.nepaliMonths[index][i];
	
			return total;
		};
	
		this.isNepaliRange = function(year, month, date){
			if(year < 2000 || year > 2098)
				return false;
	
			if(month < 1 || month > 12)
				return false;
	
			if(date < 1 || date > this.nepaliMonths[year-2000][month-1])
				return false;
	
			return true;
		};
	
		
		//Class Regular methods
		
		this.getDay = function(){
	
			//Reference date 1943/4/14 Wednesday 
			var difference = this.getEnglishDateDifference(1943, 4, 14);
			this.weekDay = ((3 + (difference%7) ) % 7 ) + 1;
			return this.weekDay;
			
		};
	
		this.getEnglishYear = function(){ return this.englishYear; };
		
		this.getEnglishMonth = function(){ return this.englishMonth; };
		
		this.getEnglishDate = function(){ return this.englishDate; };
		
		this.getNepaliYear = function(){ return this.nepaliYear; };
		
		this.getNepaliMonth = function(){ return this.nepaliMonth; };
		
		this.getNepaliDate = function(){ return this.nepaliDate; };
	}
 
}( jQuery ));