// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var df,
	fun;

include('plot_dist_common.js');

function getParameters() {
	df = getString("df");
	min = 0;
	max = parseFloat(df) + 4 * Math.sqrt(2 * parseFloat(df));
	setContParameters();
	if (density) {
		fun = "dchisq";
	} else {
		fun = "pchisq";
	}
}

function doHeader () {
	header = new Header(i18n("Chi-square %1 function &chi;(%2)", label, df));
	header.add(i18n("Degrees of freedom"), df);
	header.print();
}

function doFunCall() {
	echo('p <- qplot(c(' + min + ',' + max + '), geom="blank") + stat_function(fun=' + fun + ', colour="#FF5555", args=list(df=' + df + '))');
}