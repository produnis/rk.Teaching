// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	fun,
	lambda,
	tail;

function setGlobals() {
	q = getString("q");
	lambda = getString("lambda");
	tail = getString("tail");
	fun = getString("function");
}

function calculate() {
	setGlobals();
	echo('result <- ' + fun + 'pois(c(' + q + '), lambda = ' + lambda);
	if (fun === 'p') {
		echo(', ' + tail);
	}
	echo(')\n');
}

function printout() {
	// Header
	if (fun === 'p') {
		header = new Header(i18n("Poisson cumulative probabilities P(%1)", lambda));
	} else {
		header = new Header(i18n("Poisson probabilities P(%1)", lambda));
	}
	header.add(i18n("Mean"), lambda);
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