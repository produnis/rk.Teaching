// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var	functionType,
	min,
	max,
	density,
	label,
	ylabel,
	n;

function setGlobals() {
	functionType = getString("function");
}

function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function printout() {
	doPrintout(true);
}

function preview() {
	if (typeof (preprocess) != "undefined") preprocess();
	if (typeof (calculate) != "undefined") calculate();
	doPrintout(false);
}

// Continuous distributions
function setContParameters() {
	if (functionType === "d") {
		density = true;
		label = "density";
		ylabel = "Probability density";
	} else {
		density = false;
		label = "distribution";
		ylabel = "Cumulative probability";
	}
	if (getBoolean("range.checked")) {
		min = getString("min");
		max = getString("max");
	}
}

// Discrete distributions
function setDistParameters() {
	if (functionType === "d") {
		density = true;
		label = "probability";
		ylabel = "Probability";
	} else {
		density = false;
		label = "distribution";
		ylabel = "Cumulative probability";
	}
}

function doPrintout(full) {
	getParameters();
	if (full) {
		doHeader();
		echo('\n');
		echo('rk.graph.on ()\n');
	}
	echo('try ({\n');
	printIndentedUnlessEmpty("\t", getString("plotoptions.code.preprocess"), '', '\n');
	doFunCall();
	echo(' + xlab("x") + ylab("' + ylabel + '")' + getString("plotoptions.code.calculate") + '\n');
	echo('print(p)\n');
	echo('})\n');
	if (full) {
		echo('rk.graph.off ()\n');
	}
}