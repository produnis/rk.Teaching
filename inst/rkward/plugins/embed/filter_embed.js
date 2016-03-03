// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals

function preprocess(){
	// add requirements etc. here
}

function calculate(){
	// the R code to be evaluated
	var variable = getString("variable");
	if (getBoolean("filter_frame.checked")){
		var data = variable.split('[[')[0];
		var condition = getString("condition");
		echo (data + ' <- subset(' + data + ', subset=' + condition + ')\n');
	}
}

function printout(){
	// printout the results
	if (getBoolean("filter_frame.checked")){
		echo(", 'Filter' = '" + getString("condition") + "'");
	}
}
