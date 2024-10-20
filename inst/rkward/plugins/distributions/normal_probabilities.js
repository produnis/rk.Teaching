// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	mean,
	sd,
	tail,
	min,
	max,
	plot;

function setGlobals() {
	q = getString("q");
	mean = getString("mean");
	sd = getString("sd");
	min = parseFloat(mean) - 3 * parseFloat(sd);
	max = parseFloat(mean) + 3 * parseFloat(sd);
	tail = getString("tail");
	plot = getBoolean("plot");
}

function preprocess() {
	setGlobals();
	echo('library(ggplot2)\n');
}

function calculate() {
	echo('prob <- (pnorm(q = c(' + q + '), mean = ' + mean + ', sd = ' + sd + ', ' + tail + '))\n');
	echo('result <- tibble(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative Prob") + ' = prob)\n');
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
	echo('rk.print.literal(result |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
	// Plot
	if (plot) {
		if (tail == "lower.tail=TRUE") {
			echo('x <- seq(' + mean + '-3*' + sd + ',' + q + '[1], 0.01)\n');
		} else {
			echo('x <- seq(' + q + '[1],' + mean + '+3*' + sd + ', 0.01)\n');
		}
		echo('y <- dnorm(x,' + mean + ',' + sd + ')\n');
		echo('df <- data.frame(x, y)\n');
		echo('rk.graph.on()\n');
		echo('try ({\n');
		echo('p <- ggplot(df, aes(x, y)) + geom_area(fill=I("#FF9999"), alpha=0.5) + stat_function(fun=dnorm, colour="#FF5555", args=list(mean=' + mean + ', sd=' + sd + ')) + xlab(expression(italic("X"))) + ylab(expression(paste(' + i18n("Density") + '," ", italic(f(x))))) + scale_x_continuous(breaks=c(' + mean + ',' + q + '[1]), limits=c(' + min + ', ' + max + '))');
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