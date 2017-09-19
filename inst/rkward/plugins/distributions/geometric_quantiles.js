// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	prob,
	tail;

function setGlobals() {
	p = getString("p");
	prob = getString("prob");
	tail = getString("tail");
}

function calculate() {
	setGlobals();
	echo('result <- (qgeom(p = c(' + p + '), prob = ' + prob + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Geometric quantiles B(%1)", prob));
	header.add(i18n("Probability of success"), prob);
	if (tail === "lower.tail=TRUE") {
		header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
	} else {
		header.add(i18n("Accumulation tail"), i18n("Right (>)"));
	}
	header.print();
	// Result
	echo('rk.results (list(' + i18n("Cumulative prob") + ' = c(' + p + '), ' + i18n("Quantile") + ' = result))\n');
}