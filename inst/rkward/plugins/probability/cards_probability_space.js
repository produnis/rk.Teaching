// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var deck, 
prob, 
dataframe;

function preprocess(){
	echo('require(prob)\n');
	echo('require(rk.Teaching)\n');
}

function setGlobals() {
	deck = getString("deck");
	dataframe = getString("save");
	prob = getString("prob");
}


function calculate() {
	setGlobals();
	echo('results <- cards(type="' + deck + '", makespace=' + prob + ')\n');
	echo ('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Probability space of drawing a card"));
	header.add(i18n("Type of deck"), deck);
	header.add(i18n("Probability space"), dataframe);
	header.print();
}


