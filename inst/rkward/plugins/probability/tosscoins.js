// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ncoins, 
ntimes, 
freq,
dataframe;

function preprocess(){
	echo('require(prob)\n');
}

function setGlobals() {
	ncoins = getString("ncoins");
	ntimes = getString("ntimes");
	dataframe = getString("save");
	freq = getBoolean("freq");
}

function calculate () {
	setGlobals();	
	echo('s <- tosscoin(' + ncoins + ', makespace=TRUE)\n');
	echo('results <- sim(s, ntrials=' + ntimes + ')\n');
	if (freq) {
		echo('results <- empirical(results)\n');
		echo('names(results)[ncol(results)]=' + i18n("frequency") + '\n');
	}
	echo('for (i in 1:'+ ncoins+ ') {\n');
	echo('\t names(results)[i]= paste0(' + i18n("coin") + ', i)\n');
	echo('\t levels(results[[i]])=c(' + i18n("H", "Head of a coin") + ',' + i18n("T", "Tail of a coin") + ')\n');
	echo('}\n');
	echo ('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Random experiment of tossing coins"));
	header.add(i18n("Number of coins"), ncoins);
	header.add(i18n("Number of times"), ntimes);
	header.add(i18n("Data frame"), dataframe);
	header.print();
}

