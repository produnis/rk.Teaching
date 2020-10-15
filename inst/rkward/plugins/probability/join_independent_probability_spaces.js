// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var spaces,
	save;

function preprocess() {
	echo('library(rkTeaching)\n');
}

function setGlobals() {
	spaces = getList("spaces");
	save = getString("save");
}

function calculate() {
	setGlobals();
	echo('result <- combine.probspace(' + spaces + ')\n');
	echo('assign("' + save + '", result, .GlobalEnv)\n');
}

function printout() { // Header
	header = new Header(i18n("Join of independent probability spaces"));
	header.add(i18n("Source probability spaces"), spaces.join(", "));
	header.add(i18n("Join probability space"), save);
	header.print();
}