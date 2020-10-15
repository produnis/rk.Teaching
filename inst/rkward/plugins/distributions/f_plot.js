// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var df1,
	df2,
	fun;

include('plot_dist_common.js');

function getParameters() {
	df1 = getString("df1");
	df2 = getString("df2");
	min = 0;
	if (parseFloat(df2) < 5) {
		max = 15
	} else {
		max = parseFloat(df2) / (parseFloat(df2) - 2) + 4 * Math.sqrt(2 * Math.pow(parseFloat(df2), 2) * (parseFloat(df1) + parseFloat(df2) - 2) / (parseFloat(df1) * Math.pow((parseFloat(df2) - 2), 2) * (parseFloat(df2) - 4)));
	}
	setContParameters();
	if (density) {
		fun = "df";
	} else {
		fun = "pf";
	}
}

function doHeader() {
	header = new Header(i18n("Fisher-Snedecor F %1 function F(%2,%3)", label, df1, df2));
	header.add(i18n("Numerator degrees of freedom"), df1);
	header.add(i18n("Denominator degrees of freedom"), df2);
	header.print();
}

function doFunCall() {
	echo('x <- seq(' + min + ', ' + max + ', 0.01)\n');
	echo('df = data.frame(x, y=' + fun + '(x, df1 = ' + df1 + ', df2 = ' + df2 + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_line(colour="#FF5555") + ggtitle(' + i18n("Probability distribution Fisher-Snedecor F(%1, %2)", df1, df2) + ')');
}