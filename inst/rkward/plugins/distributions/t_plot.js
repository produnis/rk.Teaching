// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var df, 
fun;

include ('plot_dist_common.js');

function getParameters () {
	df = getString("df");
	min = -3.5;
	max = 3.5;
	setContParameters();
	if (density) {
		fun = "dt";
	} else {
		fun = "pt";
	}
}

function doHeader () {
	header = new Header(i18n("Student\'s t %1 function T(%2)", label, df));
	header.add(i18n("Degrees of freedom"), df);
	header.print();
}

function doFunCall () {
	echo('x <- seq(' + min + ', ' + max + ', 0.01)\n');
	echo('df = data.frame(x, y=' + fun + '(x, df = ' + df + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_line(colour="#FF5555") + ggtitle(' + i18n("Probability distribution Student\'s t (%1)", df) + ')');
}


