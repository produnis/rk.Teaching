// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	size,
	prob,
	tail;

function setGlobals() {
	p = getString("p");
	size = getString("size");
	prob = getString("prob");
	tail = getString("tail");
}

function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate() {
	echo('result <- qbinom(p = c(' + p + '), size = ' + size + ', prob = ' + prob + ', ' + tail + ')\n');
}

function printout() {
	// Header
	header = new Header(i18n("Binomial quantiles B(%1,%2)", size, prob));
	header.add(i18n("Number of trials"), size);
	header.add(i18n("Probability of success"), prob);
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