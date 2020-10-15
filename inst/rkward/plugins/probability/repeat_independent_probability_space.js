// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var sourceDataframe, 
nrep, 
targetDataframe;

function preprocess(){
	echo('library(rkTeaching)\n');
}

function setGlobals() {
	sourceDataframe = getString("dataframe");
	targetDataframe= getString("save");
	nrep = getString("nrep");
}

function calculate () {
	setGlobals();	
	echo('results <- repeat.probspace(' + sourceDataframe + ',' + nrep + ')\n');
	echo ('assign("' + targetDataframe + '", results, .GlobalEnv)\n');
}


function printout () {// Header
	header = new Header(i18n("Repetition of a probability space"));
	header.add(i18n("Source probability space"), sourceDataframe);
	header.add(i18n("Generated probability space"), targetDataframe);
	header.print();
}
