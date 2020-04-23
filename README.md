# Nepali Multi Date Picker
A simple yet powerful date picker based in Nepali calendar. Supports both single date selections and multiple date selection. Can be used inline with form input. Multiple date selection can be done by pressing Shift or Control / Command key.

## Getting Started

### Installing

Include these files

```
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<link  href="/path/to/nepali-date-picker.css" rel="stylesheet">
<script src="/path/to/nepali-date-picker.js"></script>
```

### Usage

Initialize with $.fn.nepaliDatePicker method.

```
<input class="datepicker">
$('.datepicker').nepaliDatePicker();
```

## Options

You can choose single date selection or multi date selection. By default it is multi-date selection.
If you want to use single date selection then add ".single" class in your input field.
```
<input class="datepicker single">
```

### Additional Options
In multi date selection mode, selected date can be displayed in 3 different ways.
* If only 1 day is selected, then it will show selected date as value in input field.
* If more than 1 day is selected, then following message will be shown in input field:
  ````
  * dates selected
  ````
* To show multiple dates as value, use ````data-show_all_dates="true"```` in input field.


## Authors

* **Sanil Shakya** - (https://www.sanil.com.np)


## License

See the <a href="https://github.com/sonill/Nepali-Multi-Date-Picker/blob/master/LICENSE">License file</a> for details
