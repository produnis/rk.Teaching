// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var ncoins,
	prob,
	dataframe;


function preprocess() {
	echo('require(prob)\n');
}

function setGlobals() {
	ncoins = getString("ncoins");
	dataframe = getString("save");
	prob = getString("prob");
}

function calculate() {
	setGlobals();
	echo('results <- tosscoin(' + ncoins + ', makespace=' + prob + ')\n');
	echo('for (i in 1:' + ncoins + ') {\n');
	echo('\t names(results)[i]= paste0(' + i18n("coin") + ', i)\n');
	echo('\t levels(results[[i]])=c(' + i18n("H", "Head of a coin") + ',' + i18n("T", "Tail of a coin") + ')\n');
	echo('}\n');
	echo('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Probability space of tossing coins"));
	header.add(i18n("Number of coins"), ncoins);
	header.add(i18n("Probability space"), dataframe);
	header.print();
}