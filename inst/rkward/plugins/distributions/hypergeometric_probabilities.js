// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	fun,
	populationSize,
	successes,
	failures,
	sampleSize,
	tail;

function setGlobals() {
	q = getString("q");
	populationSize = getString("populationSize");
	successes = getString("successes");
	sampleSize = getString("sampleSize");
	failures = parseInt(populationSize) - parseInt(successes);
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
	echo('prob <- ' + fun + 'hyper(c(' + q + '), m = ' + successes + ', n = ' + failures + ', k = ' + sampleSize);
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
		header = new Header(i18n("Hypergeometric cumulative probabilities H(%1,%2,%3)", populationSize, successes, sampleSize));
	} else {
		header = new Header(i18n("Hypergeometric probabilities H(%1,%2,%3)", populationSize, successes, sampleSize));
	}
	header.add(i18n("Population size"), populationSize);
	header.add(i18n("Number of successes in population"), successes);
	header.add(i18n("Number of draws"), sampleSize);
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