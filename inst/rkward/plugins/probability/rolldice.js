// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ndice, 
ntimes,
freq, 
dataframe;

function preprocess(){
	echo('library(prob)\n');
}

function setGlobals() {
	ncoins = getString("ndice");
	ntimes = getString("ntimes");
	dataframe = getString("save");
	freq = getBoolean("freq");
}

function calculate () {
	setGlobals();
	ndice = getString("ndice");
	ntimes = getString("ntimes");
	dataframe= getString("save");
	echo('s <- rolldie(' + ndice + ', makespace=TRUE)\n');
	echo('results <- sim(s, ntrials=' + ntimes + ')\n');
	if (getBoolean("freq")) {
		echo('results <- empirical(results)\n');
		echo('names(results)[ncol(results)]=' + i18n("frequency") + '\n');
	}
	echo('for (i in 1:'+ ndice+ ')\n');
	echo('\t names(results)[i]= paste0(' + i18n("dice") + ', i)\n');
	echo ('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Random experiment of rolling dice"));
	header.add(i18n("Number of dice"), ndice);
	header.add(i18n("Number of times"), ntimes);
	header.add(i18n("Data frame"), dataframe);
	header.print();
}

