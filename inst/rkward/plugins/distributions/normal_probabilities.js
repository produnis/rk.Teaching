// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	mean,
	sd,
	tail,
	plot;

function setGlobals() {
	q = getString("q");
	mean = getString("mean");
	sd = getString("sd");
	tail = getString("tail");
	plot = getBoolean("plot");
}

function preprocess() {
	setGlobals();
	echo('require(ggplot2)\n');
}

function calculate() {
	echo('result <- (pnorm(q = c(' + q + '), mean = ' + mean + ', sd = ' + sd + ', ' + tail + '))\n');
}

function printout() {
	// Header
	header = new Header(i18n("Normal cumulative probabilities N(%1,%2)", mean, sd));	
	header.add(i18n("Mean"), mean);
	header.add(i18n("Standard deviation"), sd);
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
			echo('x <- seq(' + mean + '-3*' + sd + ',' + q + '[1], length.out= 100)\n');
		} else {
			echo('x <- seq(' + q + '[1],' + mean + '+3*' + sd + ', length.out= 100)\n');
		}
		echo('y <- dnorm(x,' + mean + ',' + sd + ')\n');
		echo('rk.graph.on()\n');
		echo('try ({\n');
		echo('p <- qplot(x=c(' + mean + '-3*' + sd + ',' + mean + '+3*' + sd + '), geom="blank") + geom_area(aes(x=c(x[1],x,x[100]), c(0,y,0)), fill=I("#FF9999"), alpha=0.5) + stat_function(fun=dnorm, colour="#FF5555", args=list(mean=' + mean + ', sd=' + sd + ')) + xlab(expression(italic("X"))) + ylab(expression(paste(' + i18n("Density") + '," ", italic(f(x))))) + scale_x_continuous(breaks=c(' + mean + ',' + q + '[1]))');
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