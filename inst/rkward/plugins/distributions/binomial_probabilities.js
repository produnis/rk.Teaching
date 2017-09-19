// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	fun,
	size,
	prob,
	tail;

function setGlobals() {
	q = getString("q");
	size = getString("size");
	prob = getString("prob");
	tail = getString("tail");
	fun = getString("function");
}

function calculate() {
	setGlobals();
	// q = 'c(' + getString("q").replace(/[, ]+/g, ", ") + ')';
	echo('result <- ' + fun + 'binom(c(' + q + '), size = ' + size + ', prob = ' + prob);
	if (fun === 'p') {
		echo(', ' + tail);
	}
	echo(')\n');
}

function printout() {
	// Header
	if (fun === 'p') {
		header = new Header(i18n("Binomial cumulative probabilities B(%1,%2)", size, prob));
	} else {
		header = new Header(i18n("Binomial probabilities B(%1,%2)", size, prob));
	}
	header.add(i18n("Number of trials"), size);
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