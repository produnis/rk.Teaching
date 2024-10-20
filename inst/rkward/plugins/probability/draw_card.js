// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ncards, 
	freq,
	dataframe;

function preprocess(){
	echo('library(probs)\n');
}

function setGlobals() {
	ncards = getString("ncards");
	dataframe = getString("save");
	freq = getBoolean("freq");
}

function calculate () {
	setGlobals();	
	echo('s <- cards(makespace = TRUE)\n');
	echo('result <- sim(s, ntrials = ' + ncards + ')\n');
	if (freq) {
		echo('result <- empirical(result)\n');
		echo('names(result)[ncol(result)] = ' + i18n("frequency") + '\n');
	}
	echo ('assign("' + dataframe + '", result, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Random experiment of drawing cards"));
	header.add(i18n("Number of cards"), ncards);
	header.add(i18n("Data frame"), dataframe);
	header.print();
}

