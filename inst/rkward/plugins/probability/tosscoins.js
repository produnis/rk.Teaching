// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ncoins, 
	ntimes, 
	freq,
	dataframe;

function preprocess(){
	echo('library(probs)\n');
}

function setGlobals() {
	ncoins = getString("ncoins");
	ntimes = getString("ntimes");
	dataframe = getString("save");
	freq = getBoolean("freq");
}

function calculate () {
	setGlobals();	
	echo('s <- tosscoin(' + ncoins + ', makespace = TRUE)\n');
	echo('result <- sim(s, ntrials = ' + ntimes + ')\n');
	if (freq) {
		echo('result <- empirical(result)\n');
		echo('names(result)[ncol(result)]=' + i18n("frequency") + '\n');
	}
	echo('for (i in 1:'+ ncoins+ ') {\n');
	echo('\t names(result)[i] = paste0(' + i18n("coin") + ', i)\n');
	echo('\t levels(result[[i]]) = c(' + i18nc("Head of a coin", "H") + ',' + i18nc("Tail of a coin", "T") + ')\n');
	echo('}\n');
	echo ('assign("' + dataframe + '", result, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Random experiment of tossing coins"));
	header.add(i18n("Number of coins"), ncoins);
	header.add(i18n("Number of times"), ntimes);
	header.add(i18n("Data frame"), dataframe);
	header.print();
}

