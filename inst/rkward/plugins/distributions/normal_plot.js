// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var mean,
	sd,
	fun;

include('plot_dist_common.js');

function getParameters() {
	mean = getString("mean");
	sd = getString("sd");
	min = parseFloat(mean) - 3 * parseFloat(sd);
	max = parseFloat(mean) + 3 * parseFloat(sd);
	setContParameters();
	if (density) {
		fun = "dnorm";
	} else {
		fun = "pnorm";
	}
}

function doHeader() {
	header = new Header(i18n("Normal %1 function N(%2,%3)", label, mean, sd));
	header.add(i18n("Mean"), mean);
	header.add(i18n("Standard deviation"), sd);
	header.print();
}

function doFunCall() {
	echo('p <- qplot(c(' + min + ',' + max + '), geom="blank") + stat_function(fun=' + fun + ', colour="#FF5555", args=list(mean=' + mean + ', sd=' + sd + '))');
}