// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var prob, 
	dataframe;

function preprocess(){
	echo('library(probs)\n');
}

function setGlobals() {
	dataframe = getString("save");
	prob = getString("prob");
}


function calculate() {
	setGlobals();
	echo('result <- cards(makespace = ' + prob + ')\n');
	echo ('assign("' + dataframe + '", result, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Probability space of drawing a card"));
	header.add(i18n("Probability space"), dataframe);
	header.print();
}


