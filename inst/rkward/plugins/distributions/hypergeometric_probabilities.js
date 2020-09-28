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

function calculate() {
	setGlobals();
	echo('result <- ' + fun + 'hyper(c(' + q + '), m = ' + successes + ', n = ' + failures + ', k = ' + sampleSize);
	if (fun === 'p') {
		echo(', ' + tail);
	}
	echo(')\n');
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
	if (fun === 'p') {
		echo('rk.results (list(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative prob") + ' = result))\n');
	} else {
		echo('rk.results (list(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Probability") + ' = result))\n');
	}
}