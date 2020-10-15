// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var lambda,
	fun,
	min,
	max,
	n;

include('plot_dist_common.js');

function getParameters() {
	lambda = getString("lambda");
	setDistParameters()
	if (density) {
		fun = "dpois";
	} else {
		fun = "ppois";
	}
	min = 0;
	max = parseInt(lambda) + Math.round(4 * Math.sqrt(parseFloat(lambda)));
	n = max - min + 1;
}

function doHeader() {
	header = new Header(i18n("Poisson %1 function P(%2)", label, lambda));
  header.add(i18n("Mean"), lambda);
  header.print();
}

function doFunCall() {
	echo('x <- ' + min + ':' + max + '\n');
	echo('df = data.frame(x, y=' + fun + '(x, lambda = ' + lambda + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_point(colour="#FF5555") + ggtitle("Probability distribution Poisson(' + lambda + ')")');
}