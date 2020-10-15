// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var probSpace, 
event, 
conditioned, 
condition;

function preprocess(){
	echo('library(prob)\n');
}

function setGlobals() {
	probSpace = getString("probSpace");
	event = getString("event");
	conditioned = getBoolean("conditioned.state")
	condition = getString("condition")
}

function calculate () {
	setGlobals();	
	echo('results <- Prob(' + probSpace + ', event=' + event);
	if (conditioned)
		echo(', given= ' + condition );
	echo(')\n');
		
}

function printout () {
		// Header
		header = new Header(i18n("Compute probability"));
		header.add(i18n("Probability space"), probSpace);
		header.print();
	
	echo ('rk.results(list(' + i18n("Event") + ' = \'' + event + '\'');
	if (conditioned)
		echo(', ' + i18n("Condition") + ' = \'' + condition + '\'');
	echo(', ' + i18n("Probability") + ' = results))\n');
}
