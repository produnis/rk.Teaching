// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ndice,
	prob,
	dataframe;

function preprocess() {
	echo('library(probs)\n');
}

function setGlobals() {
	ndice = getString("ndice");
	dataframe = getString("save");
	prob = getString("prob");
}

function calculate() {
	setGlobals();
	echo('result <- rolldie(' + ndice + ', makespace=' + prob + ')\n');
	echo('assign("' + dataframe + '", result, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Probability space of rolling dice"));
	header.add(i18n("Number of dice"), ndice);
	header.add(i18n("Probability space"), dataframe);
	header.print();
}