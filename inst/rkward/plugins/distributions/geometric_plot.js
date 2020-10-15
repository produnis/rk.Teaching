// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var prob,
  min,
  max,
  n,
  fun;

include('plot_dist_common.js');

function getParameters() {
  prob = getString("prob");
  setDistParameters()
  if (density) {
    fun = "dgeom";
  } else {
    fun = "pgeom";
  }
  min = 0;
  p = parseFloat(prob);
  var i = 1;
  while (Math.pow((1 - p), i - 1) * p > 0.01) {
    i++;
  }
  max = i;
  n = max + 1;
}

function doHeader() {
  header = new Header(i18n("Geometric %1 function Geom(%2)", label, prob));
  header.add(i18n("Probability of success"), prob);
  header.print();
}

function doFunCall() {
  echo('x <- ' + min + ':' + max + '\n');
	echo('df = data.frame(x, y=' + fun + '(x, prob = ' + prob + '))\n');
	echo('p <- ggplot(df, aes(x, y)) + geom_point(colour="#FF5555") + ggtitle("Probability distribution Geometric(' + prob + ')")');
}