// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var umin,
	umax,
	range;

include('plot_dist_common.js');

function getParameters() {
	umin = getString("min");
	umax = getString("max");
	range = parseFloat(umax) - parseFloat(umin);
	min = parseFloat(umin) - range / 10;
	max = parseFloat(umax) + range / 10;
	setContParameters();
}

function doHeader() {
	header = new Header(i18n("Continuous uniform %1 function U(%2,%3)", label, umin, umax));
	header.add(i18n("Minimum"), umin);
	header.add(i18n("Maximum"), umax);
	header.print();
}

function doFunCall() {
	if (density) {
	  echo('x <- c(' + min + ', ' + umin + ', ' + umin + ', ' + umax + ', ' + umax + ', ' + max + ')\n');
		echo('y <- c(0, 0, ' + 1 / range + ', ' + 1 / range + ', 0, 0)\n');
	} else {
		echo('x <- c(' + min + ', ' + umin + ', ' + umax + ', ' + max + ')\n');
		echo('y <- c(0,0,1,1)\n');
	}
	echo('df <- data.frame(x, y)\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_line(colour="#FF5555") + ggtitle(' + i18n("Probability distribution Uniform(%1, %2)", umin, umax) + ')');
}