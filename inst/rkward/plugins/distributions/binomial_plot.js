// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var size,
	prob,
	fun;

include('plot_dist_common.js');

function getParameters() {
	size = getString("size");
	prob = getString("prob");
	setDistParameters();
	if (density) {
		fun = "dbinom";
	} else {
		fun = "pbinom";
	}
	min = 0;
	max = parseInt(getString("size"));
	n = max + 1;
}

function doHeader() {
	header = new Header(i18n("Binomial %1 function B(%2,%3)", label, size, prob));
	header.add(i18n("Number of trials"), size);
	header.add(i18n("Probability of success"), prob);
	header.print();
}

function doFunCall() {
	echo('x <- ' + min + ':' + max + '\n');
	echo('df = data.frame(x, y=' + fun + '(x, size = ' + size + ', prob = ' + prob + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_point(colour="#FF5555") + ggtitle("Probability distribution Binomial(' + size + ', ' + prob + ')")');
}