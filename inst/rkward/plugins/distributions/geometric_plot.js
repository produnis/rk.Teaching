// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var prob,
  min,
  max,
  n;

include('../common/plot_dist_common.js');

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
  echo('ylim <- max(' + fun + '(seq(' + min + ',' + max + '), prob=' + prob + '))\n');
  echo('p <- qplot(c(' + min + ',' + max + '), geom="blank") + stat_function(fun=' + fun + ', colour="#FF5555", n=' + n + ', geom="point", size=I(3), args=list(prob=' + prob + ')) + ylim(0,ylim)');
}