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

function calculate() {
	setGlobals();
	echo('result <- ' + fun + 'geom(c(' + q + '), prob = ' + prob);
	if (fun === 'p') {
		echo(', ' + tail);
	}
	echo(')\n');
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
	if (fun === 'p') {
		echo('rk.results (list(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative prob") + ' = result))\n');
	} else {
		echo('rk.results (list(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Probability") + ' = result))\n');
	}
}