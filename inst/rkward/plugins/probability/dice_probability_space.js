// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ndice,
	prob,
	dataframe;

function preprocess() {
	echo('require(prob)\n');
}

function setGlobals() {
	ndice = getString("ndice");
	dataframe = getString("save");
	prob = getString("prob");
}

function calculate() {
	setGlobals();
	echo('results <- rolldie(' + ndice + ', makespace=' + prob + ')\n');
	echo('for (i in 1:' + ndice + ')\n');
	echo('\t names(results)[i]= paste0(' + i18n("dice") + ', i)\n');
	echo('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Probability space of rolling dice"));
	header.add(i18n("Number of dice"), ndice);
	header.add(i18n("Probability space"), dataframe);
	header.print();
}