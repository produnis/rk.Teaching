// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var deck, 
ncards, 
freq,
dataframe;

function preprocess(){
	echo('require(prob)\n');
	echo('require(rkTeaching)\n');
}

function setGlobals() {
	ncards = getString("ncards");
	dataframe = getString("save");
	freq = getBoolean("freq");
}

function calculate () {
	setGlobals();	
	echo('s <- cards(type="' + deck + '", makespace=TRUE)\n');
	echo('results <- sim(s, ntrials=' + ncards + ')\n');
	if (freq) {
		echo('results <- empirical(results)\n');
		echo('names(results)[ncol(results)]=' + i18n("frequency") + '\n');
	}
	echo ('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Random experiment of drawing cards"));
	header.add(i18n("Number of cards"), ncards);
	header.add(i18n("Data frame"), dataframe);
	header.print();
}

