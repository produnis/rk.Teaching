// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var classes, breaks, classesheader;

function makeCodes () {
	classesheader = ', "Grouping method" = "';
	var variable = getString("variable");
	var breaksmethod = getString("breaksFunction");
	if (breaksmethod == "num") {
		breaks = 'pretty(range(na.omit(' + variable + ')),' + getString("breaks_num") + ')';
		classesheader += 'Approximately ' + getString("breaks_num") + ' intervals"';
	} else if (breaksmethod == "vec") {
		breaks = 'c(' +  getString("breaks_vec") + ')';
		classesheader += 'Defined by the user: ' + getString ("breaks_vec") + '"';
	} else {
		breaks = 'pretty(range(na.omit(' + variable + ')), nclass.' + breaksmethod + '(' +  variable + '))';
		classesheader += breaksmethod + '"';
	};
	classes = ', breaks=' + breaks;
	if (getBoolean("rightclosed")) {
		classes += ', right=TRUE';
	}
	else {
		classes += ', right=FALSE';
	}
}

function prueba() {
	echo("hola");
}

function preprocess(){
	// add requirements etc. here
	makeCodes();
	echo(breaks);
}

function calculate(){
	// the R code to be evaluated
	echo(classes);
}

function printout(){
	// printout the results
	echo(classesheader);
}

