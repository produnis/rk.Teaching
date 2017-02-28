// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../jscripts/common_functions.js")

function preprocess() {
	if (getBoolean("filterFrame.checked")) {
		echo("true");
	};
}

function calculate() {
    var variable = getString("variable");
    if (getBoolean("filterFrame.checked")) {
        var data = variable.split('[[')[0];
        var condition = getString("condition");
        echo(data + ' <- subset(' + data + ', subset=' + condition + ')\n');
    }
}

function printout() {
    if (getBoolean("filterFrame.checked")) {
        //echo(", 'Filter' = '" + getString("condition") + "'");
        echo(getString("condition"));
    }
}
