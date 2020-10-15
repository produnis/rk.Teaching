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
	echo('x <- seq(' + min + ', ' + max + ', 0.01)\n');
	echo('df = data.frame(x, y=' + fun + '(x, mean = ' + mean + ', sd = ' + sd + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_line(colour="#FF5555") + ggtitle(' + i18n("Probability distribution Normal(%1, %2)", mean, sd) + ')');
}