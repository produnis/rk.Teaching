// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	fun,
	prob,
	tail;

function setGlobals() {
	q = getString("q");
	prob = getString("prob");
	tail = getString("tail");
	fun = getString("function");
}
function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate() {
	echo('prob <- ' + fun + 'geom(c(' + q + '), prob = ' + prob);
	if (fun === 'p') {
		echo(', ' + tail);
	}
	echo(')\n');
	if (fun === 'p') {
		echo('result <- tibble(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative Prob") + ' = prob)\n');
	} else {
		echo('result <- tibble(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Probability") + ' = prob)\n');
	}
}

function printout() {
	// Header
	if (fun === 'p') {
		header = new Header(i18n("Geometric cumulative probabilities Geom(%1)", prob));
	} else {
		header = new Header(i18n("Geometric probabilities Geom(%1)", prob));
	}
	header.add(i18n("Probability of success"), prob);
	if (fun === 'p') {
		if (tail === "lower.tail=TRUE") {
			header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
		} else {
			header.add(i18n("Accumulation tail"), i18n("Right (>)"));
		}
	}
	header.print();
	// Results
	echo('rk.print.literal(result |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
}