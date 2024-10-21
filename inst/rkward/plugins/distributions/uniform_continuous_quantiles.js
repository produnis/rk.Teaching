// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	min,
	max,
	tail;

function setGlobals() {
	p = getString("p");
	min = getString("min");
	max = getString("max");
	tail = getString("tail");
}

function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate() {
	echo('result <- (qunif(p = c(' + p + '), min = ' + min + ', max = ' + max + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Continuous uniform quantiles U(%1,%2)", min, max));
	header.add(i18n("Minimum"), min);
	header.add(i18n("Maximum"), max);
	if (tail === "lower.tail=TRUE") {
		header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
	} else {
		header.add(i18n("Accumulation tail"), i18n("Right (>)"));
	}
	header.print();
	// Result
	echo('rk.print.literal(tibble(' + i18n("Cumulative prob") + ' = c(' + p + '), ' + i18n("Quantile") + ' = result) |>\n');
	echo('\tkable("html", align = "c", escape = F) |>\n');
	echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
	echo(')\n'); 
}