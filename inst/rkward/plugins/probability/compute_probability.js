// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var probSpace, 
	event, 
	conditioned, 
	condition;

function preprocess(){
	echo('library(tidyverse)\n');
	echo('library(broom)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
	echo('library(probs)\n');
}

function setGlobals() {
	probSpace = getString("probSpace");
	event = getString("event");
	conditioned = getBoolean("conditioned.state")
	condition = getString("condition")
}

function calculate () {
	setGlobals();	
	echo('result <- Prob(' + probSpace + ', event=' + event);
	if (conditioned)
		echo(', given= ' + condition );
	echo(')\n');
		
}

function printout () {
		// Header
		header = new Header(i18n("Compute probability"));
		header.add(i18n("Probability space"), probSpace);
		header.print();
	
	echo ('rk.print.literal(tibble(' + i18n("Event") + ' = \'' + event + '\'');
	if (conditioned)
		echo(', ' + i18n("Condition") + ' = \'' + condition + '\'');
	echo(', ' + i18n("Probability") + ' = result) |>\n')
	echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
}
