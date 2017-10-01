// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	df,
	tail,
	max;

function setGlobals() {
	q = getString("q");
	df = getString("df");
	tail = getString("tail");
	plot = getBoolean("plot");
	max = parseFloat(df) + 4 * Math.sqrt(2 * parseFloat(df));
}

function calculate() {
	setGlobals();
	echo('result <- (pchisq(q = c(' + q + '), df = ' + df + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Chi-square cumulative probabilities T(%1)", df));
	header.add(i18n("Degrees of freedom"), df);
	if (tail === "lower.tail=TRUE") {
		header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
	} else {
		header.add(i18n("Accumulation tail"), i18n("Right (>)"));
	}
	header.print();
	// Results
	echo('rk.results (list(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative prob") + ' = result))\n');
	// Plot
	if (getBoolean("plot")) {
		if (tail == "lower.tail=TRUE") {
			echo('x <- seq(0,' + q + '[1], length.out= 100)\n');
		} else {
			echo('x <- seq(' + q + '[1],' + max + ', length.out= 100)\n');
		}
		echo('y <- dchisq(x,' + df + ')\n');
		echo('rk.graph.on()\n');
		echo('try ({\n');
		echo('p <- qplot(x=c(0, ' + max + '), geom="blank") + geom_area(aes(x=c(x[1],x,x[100]), c(0,y,0)), fill=I("#FF9999"), alpha=0.5) + stat_function(fun=dchisq, colour="#FF5555", args=list(df=' + df + ')) + xlab(expression(italic("X"))) + ylab(expression(paste(' + i18n("Density") + ', " ", italic(f(x))))) + scale_x_continuous(breaks=c(' + q + '[1]))');
		if (tail == "lower.tail=TRUE") {
			echo(' + labs(title=paste("P(X<",' + q + '[1], ")=", round(result[1],4)))\n');
		} else {
			echo(' + labs(title=paste("P(X>",' + q + '[1], ")=", round(result[1],4)))\n');
		}
		echo('print(p)\n');
		echo('})\n');
		echo('rk.graph.off()\n');
	}
}