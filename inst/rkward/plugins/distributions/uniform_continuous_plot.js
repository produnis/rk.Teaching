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
		echo('p <- qplot(x=c(' + min + ',' + umin + ',' + umin + ',' + umax + ',' + umax + ',' + max + '), y=c(0,0,' + 1 / range + ',' + 1 / range + ',0,0), geom="line", colour=I("#FF5555"))');
	} else {
		echo('p <- qplot(x=c(' + min + ',' + umin + ',' + umax + ',' + max + '), y=c(0,0,1,1), geom="line", colour=I("#FF5555"))');
	}
}