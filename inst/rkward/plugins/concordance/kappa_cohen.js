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
	echo('table <- xtabs(~' + xName + '+' + yName + ', data=' + dataframe + ')\n');
	echo('results <- cohen.kappa(table)\n');
}

function printout() {
	header = new Header(i18n("Cohen\'s kappa coefficient of %1 and %2", xName, yName));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Variables"), xName + ", " + yName);
	header.print();

	echo('rk.results (list(');
	echo(i18n("Kappa") + ' = results$kappa, ');
	echo(i18n("Weighted kappa") + ' = results$weighted.kappa');
	echo('))\n');
}