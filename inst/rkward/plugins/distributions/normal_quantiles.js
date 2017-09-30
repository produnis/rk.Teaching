// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	mean,
	sd,
	tail;


function setGlobals() {
	p = getString("p");
	mean = getString("mean");
	sd = getString("sd");
	tail = getString("tail");
}

function calculate() {
	setGlobals();
	echo('result <- (qnorm(p = c(' + p + '), mean = ' + mean + ', sd = ' + sd + ', ' + tail + '))\n');
}

function printout() {
// Header
header = new Header(i18n("Normal quantiles N(%1,%2)", mean, sd));
header.add(i18n("Mean"), mean);
header.add(i18n("Standard deviation"), sd);
if (tail === "lower.tail=TRUE") {
	header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
} else {
	header.add(i18n("Accumulation tail"), i18n("Right (>)"));
}
header.print();
// Result
echo('rk.results (list(' + i18n("Cumulative prob") + ' = c(' + p + '), ' + i18n("Quantile") + ' = result))\n');
}