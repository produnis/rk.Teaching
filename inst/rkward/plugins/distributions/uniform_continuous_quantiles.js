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

function calculate() {
	setGlobals();
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
echo('rk.results (list(' + i18n("Cumulative prob") + ' = c(' + p + '), ' + i18n("Quantile") + ' = result))\n');
}