// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	lambda,
	tail;

function setGlobals() {
	p = getString("p");
	lambda = getString("lambda");
	tail = getString("tail");
}

function calculate() {
	setGlobals();
	echo('result <- (qpois(p = c(' + p + '), lambda = ' + lambda + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Poisson quantiles P(%1)", lambda));
	header.add(i18n("Mean"), lambda);
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