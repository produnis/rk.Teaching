// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	df,
	tail;

function setGlobals() {
	p = getString("p");
	df = getString("df");
	tail = getString("tail");
}

function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate() {
	echo('result <- (qt(p = c(' + p + '), df = ' + df + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Student's t quantiles T(%1)", df));
	header.add(i18n("Degrees of freedom"), df);
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