// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")

// globals
var x,
	xName,
	y,
	yName,
	dataframe;

function setGlobalVars() {
	x = getString("x");
	xName = getString("x.shortname");
	y = getString("y");
	yName = getString("y.shortname");
	dataframe = getDataframe(x);
}

function preprocess() {
	setGlobalVars();
	echo('require(psych)\n');
}

function calculate() {
	echo('results <- ICC(as.matrix(na.omit(' + dataframe + '[,c("' + xName + '","' + yName + '")])))\n');
}

function printout() {
	header = new Header(i18n("Intraclass correlation of %1 and %2", xName, yName));
	header.add(i18n("Variables"), xName + ", " + yName);
	header.print();

	echo('rk.results (list(');
	echo(i18n("Type") + ' = results$results$type, ');
	echo(i18n("ICC") + ' = results$results$ICC, ');
	echo(i18n("F statistic") + ' = results$results$F, ');
	echo(i18n("p-value") + ' = results$results$p');
	echo('))\n');
}