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
	echo('prob <- ' + fun + 'binom(c(' + q + '), size = ' + size + ', prob = ' + prob);
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
	echo('rk.print.literal(result |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
}