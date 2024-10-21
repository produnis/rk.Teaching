// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q,
	df,
	tail,
	min,
	max,
	plot;

function setGlobals() {
	q = getString("q");
	df = getString("df");
	tail = getString("tail");
	plot = getBoolean("plot");
	min = -4;
	max = 4;
}

function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate() {
	echo('prob <- (pt(q = c(' + q + '), df = ' + df + ', ' + tail + '))\n');
	echo('result <- tibble(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative Prob") + ' = prob)\n');
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
	echo('rk.print.literal(result |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
	// Plot
	if (plot) {
		if (tail == "lower.tail=TRUE") {
			echo('x <- seq(' + min + ',' + q + '[1], 0.01)\n');
		} else {
			echo('x <- seq(' + q + '[1], ' + max + ', 0.01)\n');
		}
		echo('y <- dt(x,' + df + ')\n');
		echo('df <- data.frame(x, y)\n');
		echo('rk.graph.on()\n');
		echo('try ({\n');
			echo('p <- ggplot(df, aes(x, y)) + geom_area(fill=I("#FF9999"), alpha=0.5) + stat_function(fun=dt, colour="#FF5555", args=list(df=' + df + ')) + xlab(expression(italic("X"))) + ylab(expression(paste(' + i18n("Density") + '," ", italic(f(x))))) + scale_x_continuous(breaks=c(0,' + q + '[1]), limits=c(' + min + ', ' + max + '))');
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