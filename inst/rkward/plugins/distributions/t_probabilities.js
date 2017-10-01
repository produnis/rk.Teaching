// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	df,
	tail,
	plot;

function setGlobals() {
	q = getString("q");
	df = getString("df");
	tail = getString("tail");
	plot = getBoolean("plot");
}

function calculate() {
	setGlobals();
	echo('result <- (pt(q = c(' + q + '), df = ' + df + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Student's t cumulative probabilities T(%1)", df));
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
	if (plot) {
		if (tail == "lower.tail=TRUE") {
			echo('x <- seq(-4,' + q + '[1], length.out= 100)\n');
		} else {
			echo('x <- seq(' + q + '[1], 4, length.out= 100)\n');
		}
		echo('y <- dt(x,' + df + ')\n');
		echo('rk.graph.on()\n');
		echo('try ({\n');
		echo('p <- qplot(x=c(-4,4), geom="blank") + geom_area(aes(x=c(x[1],x,x[100]), c(0,y,0)), fill=I("#FF9999"), alpha=0.5) + stat_function(fun=dt, colour="#FF5555", args=list(df=' + df + ')) + xlab(expression(italic("X"))) + ylab(expression(paste(' + i18n("Density") + ', " ", italic(f(x))))) + scale_x_continuous(breaks=c(0,' + q + '[1]))');
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