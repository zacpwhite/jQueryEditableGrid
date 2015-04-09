#jQuery Editable Grid
jQuery Editable Grid is a lightweight, powerful, and easy-to-use plugin that allows any valid HTML table to be edited inline in grid format. This plugin is Bootstrap compatible and requires jQuery >= 1.6.

##Overview
This plugin will allow any HTML table to be rendered as an editable grid. By default, this plugin allows editing in the form of simple text boxes, but supports checkboxes and select lists as well. The save event will return a JSON array of dirty rows only. 

##Usage
This plugin relies on data- attributes to enable editing on td elements and only requires a single line of JavaScript to be enabled on a table.

###Basic Example:
```html
<table id='myTable'>
	<thead>
		<tr>
			<th>Column 1</th>
			<th>Column 2</th>
			<th>Column 3</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td data-editable='true'>Data 1</td>
			<td data-editable='true'>Data 2</td>
			<td data-editable='true'>Data 3</td>
		</tr>
	</tbody>
</table>
```
```javascript
<script src="~/Scripts/jquery-editablegrid.js"></script>
<script type='text/javascript'>
	$('#myTable').editableGrid();
</script>
```

##Options
###data- Options
**tr's support the following attributes:**
+ **data-key='YOUR_KEY_NAME'** - (Optional) - Set the name of the Primary Key property to be returned from the save event.
+ **data-value='YOUR_KEY_VALUE'** - (Optional) - Set the value of the Primary Key property.
+ **data-type='(number|string)'** - (Optional) - Set the data type of the Primary Key value.

**td's support the following attributes:**
+ **data-editable='true'** - (Required) - Set the field as editable.
+ **data-property='DATA_PROPERTY_NAME'** - (Optional) - Set the data property name to be returned from the save event. Defaults to the column heading if not provided.
+ **data-type='(number|boolean|string)'** - (Optional) - Set the data type. Defaults to string if not provided.
+ **data-object-type='(text|checkbox|select)'** - (Optional) -Set the editor to be used. Defaults to text if not provided.
	- If the object-type is set to 'select', the list of options must be provided in the options object that is passed to the library during object creation (See the Select Object Options section and example below).

###Object Creation Options
**On object creation, the following properties can be set:**
+ **'save' : function(callback){}** - (Optional) - Capture the data returned from the save event.
	- Data returned here is in the form of a JSON array
	- e.g. [{'PrimaryKey' : 1, 'Make' : 'Honda', 'Model' : 'Civic', 'Year' : 2015, 'Available' : true }]
+ **'edit' : function(){}** - (Optional) - Capture the edit event.
+ **'cancel' : function(){}** - (Optional) - Capture the cancel event.
+ **'disableControls' : (true|false)** - (Optional) - Disables the built-in Edit, Cancel and Save buttons.
+ **'disableBootstrapClasses' : (true|false)** - (Optional) - Disables controls from rendering using built-in Bootstrap styles. By default, the plugin utilizes Bootstrap classes
+ **'columns': []** - (Required for Select Columns) - Provide column specific details for object-type='select' columns.

###Select Object Options
**When using an object-type='select' column, the following properties can be set in the columns option:**
+ **'name' : 'DATA_PROPERTY_NAME'** - (Required) - Set the column name to associate the properties. Typically the same as the data-property attribute.
+ **'values' : [ARRAY]** - (Required) - Set the list of values to build the select list.
+ **'text' : 'TEXT_PROPERTY_NAME'** - (Optional) - Set the text property of the array to be displayed in the select list.
	- Applies to multi-dimensional arrays only
+ **'value' : 'VALUE_PROPERTY_NAME'** - (Optional) - Set the value property of the array to be selected in the select list.
	- Applies to multi-dimensional arrays only

##Advanced Example
```html
<table id='cars'>
	<thead>
		<tr>
			<th>Make</th>
			<th>Model</th>
			<th>Year</th>
			<th>Available</th>
		</tr>
	</thead>
	<tbody>
		<tr data-key='PrimaryKey' data-value='1' data-type='number'>
			<td data-editable='true' data-property='Make' data-type='string' data-object-type='select'>Honda</td>
			<td data-editable='true' data-property='Model' data-type='string' data-object-type='string'>Civic</td>
			<td data-editable='true' data-property='Year' data-type='number' data-object-type='select'>2015</td>
			<td data-editable='true' data-property='Available' data-type='boolean' data-object-type='checkbox'>True</td>
		</tr>
	</tbody>
</table>
```

```javascript
<script type='text/javascript'>
	$(document).ready(function(){
		$('#cars').editableGrid({
			'columns' : [
				{
					'name' : 'Make', //Column name to associate to properties - typically the same as the data-property name
					'values' : ['Chevy', 'Dodge', 'Ford', 'Honda', 'Toyota'] //Array of options to display in the select list
				},
				{
					'name' : 'Year',
					'value' : [{'Display' : 'Twenty Fifteen', 'Value' : 2015}, {'Display' : 'Twenty Fourteen', 'Value' : 2014}],
					'text' : 'Display', //Set the text property of the array which will be displayed in the select list
					'value' : 'Value' //Set the value property of the array which will provide the selected value
				}
			],
			'save' : function(data) {
				alert(data);
			},
			'edit' : function() {
				alert('Edit Button Pressed');
			},
			'cancel' : function() {
				alert('Cancel Button Pressed');
			},
			'disableControls' : false,
			'disableBootstrapClasses' : false
		});
	});
</script>
```

##Events
Events can be captured by setting property inline during object creation or by triggering the event directly through variable binding.

### Inline Event Handling
```javascript
<script type='text/javascript'>
	$(document).ready(function(){
		$('#myTable').editableGrid({
			'save' : function(data) {
				alert(data);
			},
			'edit' : function() {
				alert('Edit Button Pressed');
			},
			'cancel' : function() {
				alert('Cancel Button Pressed');
			}
		});
	});
</script>
```

###Direct Event Triggering
```html
<table id='myTable'>
	<thead>
		<tr>
			<th>Column 1</th>
			<th>Column 2</th>
			<th>Column 3</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td data-editable='true'>Data 1</td>
			<td data-editable='true'>Data 2</td>
			<td data-editable='true'>Data 3</td>
		</tr>
	</tbody>
</table>
<button type="button" id='editButton'>Edit</button>
<button type="button" id='cancelButton'>Cancel</button>
<button type="button" id='saveButton'>Save</button>
```
```javascript
<script type='text/javascript'>
	$(document).ready(function(){
		var grid = $('#myTable').editableGrid();

		$('editButton').click(function(){
			grid.edit();
			return false;
		});

		$('cancelButton').click(function(){
			grid.cancel();
			return false;
		});

		//Data can be returned from the save event through callback or inline

		//Inline
		$('saveButton').click(function(){
			var data = grid.save();
			alert(data);
			return false;
		});

		//Callback
		$('saveButton').click(function(){
			grid.save(function(data){
				alert(data);
				return false;
			});
		});
	});
</script>
```
