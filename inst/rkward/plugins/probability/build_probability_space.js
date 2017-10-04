// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var sourceDataframe, 
freq, 
targetDataframe;

function preprocess(){
	echo('require(prob)\n');
}

function setGlobals() {
	sourceDataframe = getString("dataframe");
	targetDataframe= getString("save");
	freq = getString("freq");
}

function calculate () {
	setGlobals();	
	if (getBoolean("setFreq.state")) {
		echo('freq <- ' + freq + '\n');
		echo('' + freq + '<- NULL\n');
		echo('results <- marginal(probspace(' +  sourceDataframe + ', probs=freq/sum(freq)))\n');
	} else {
		echo('results <- empirical(' + sourceDataframe + ')\n');
	}
	echo('names(results)[ncol(results)]="probs"\n');
	echo ('assign("' + targetDataframe + '", results, .GlobalEnv)\n');
}


function printout () {// Header
	header = new Header(i18n("Construction of a probability space"));
	header.add(i18n("Data frame"), sourceDataframe);
	header.add(i18n("Probability space"), targetDataframe);
	header.print();
}
