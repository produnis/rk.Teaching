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
	echo('x <- seq(' + min + ', ' + max + ', 0.01)\n');
	echo('df = data.frame(x, y=' + fun + '(x, df = ' + df + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_line(colour="#FF5555") + ggtitle(' + i18n("Probability distribution Chi-square(%1)", df) + ')');
}