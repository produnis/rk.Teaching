// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")

// globals
var n,
	p;

function setGlobalVars() {
	n = getString("trials");
	p = getString("prob");
}

function printout() {
	doPrintout(true);
}

function preview() {
	doPrintout(false);
}

// internal helper functions
function doPrintout(full) {
	setGlobalVars();
	if (full) {
		header = new Header(i18n("Law of rare events"));
		header.add(i18n("Binomial number of trials"), n);
		header.add(i18n("Binomial probability of success"), p);
		header.add(i18n("Poisson mean"), n + "*" + p);
		header.print();
		echo('rk.graph.on ()\n');
	}
	echo('try ({\n');
	echo('n <- ' + n + '\n');
	echo('p <- ' + p + '\n');
	echo('mu <- p*n\n');
	echo('sd <- sqrt(n*p*(1-p))\n');
	echo('plot( seq(0,n), dpois( seq(0,n), mu ), type="h", xlim=c(-1,n+1), xlab="x", ylab="Probability", ylim=range(0,dpois( seq(0,n), mu), dbinom(seq(0,n),n,p)))\n');
	echo('points( seq(0,n), dpois( seq(0,n), mu ), pch=16, col="blue")\n');
	echo('points( seq(0,n), dbinom( seq(0,n), n, p), type="h")\n');
	echo('abline(h=0)\n');
	echo('points( seq(0,n), dbinom( seq(0,n), n, p), pch=18, col="red" )\n');
	echo('title( paste(' + i18n("Mean") + ', "=", round(mu,3), ' + i18n("Std.Dev.") + ', "=", round(sd,3)))\n');
	echo('legend("topright", c("Binomial", "Poisson"), col = c("red","blue"), pch = c(18,16))\n');
	echo('})\n');
	if (full) {
		echo('rk.graph.off ()\n');
	}
}