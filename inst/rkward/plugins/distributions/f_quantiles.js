// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
	df1,
	df2,
	tail;

function setGlobals() {
	p = getString("p");
	df1 = getString("df1");
	df2 = getString("df2");
	tail = getString("tail");
}

function calculate() {
	setGlobals();
	echo('result <- (qf(p = c(' + p + '), df1 = ' + df1 + ', df2 = ' + df2 + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Fisher-Snedecor F quantiles F(%1,%2)", df1, df2));
	header.add(i18n("Numerator degrees of freedom"), df1);
	header.add(i18n("Denominator degrees of freedom"), df2);
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