// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var populationSize,
  successes,
  failures,
  sampleSize;


include('plot_dist_common.js');

function getParameters() {
  populationSize = getString("populationSize");
  successes = getString("successes");
  sampleSize = getString("sampleSize");
  failures = parseInt(populationSize) - parseInt(successes);
  setDistParameters();
  if (density) {
    fun = "dhyper";
  } else {
    fun = "phyper";
  }
  min = 0;
  max = parseInt(sampleSize);
  n = max + 1;
}

function doHeader() {
  header = new Header(i18n("Hypergeometric %1 function H(%2,%3,%4)", label, populationSize, successes, sampleSize));
  header.add(i18n("Population size"), populationSize);
  header.add(i18n("Number of successes in population"), successes);
  header.add(i18n("Number of draws"), sampleSize);
  header.print();
}

function doFunCall() {
  echo('ylim <- max(' + fun + '(seq(' + min + ',' + max + '), m=' + successes + ', n=' + failures + ', k=' + sampleSize + '))\n');
  echo('p <- qplot(c(' + min + ',' + max + '), geom="blank") + stat_function(fun=' + fun + ', colour="#FF5555", n=' + n + ', geom="point", size=I(3), args=list(m=' + successes + ', n=' + failures + ', k=' + sampleSize + ')) + ylim(0,ylim)');
}