// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var p,
  populationSize,
  successes,
  failures,
  sampleSize,
  tail;

function setGlobals() {
  p = getString("p");
  populationSize = getString("populationSize");
  successes = getString("successes");
  sampleSize = getString("sampleSize");
  failures = parseInt(populationSize) - parseInt(successes);
  tail = getString("tail");
}

function preprocess() {
	setGlobals();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate() {
  echo('result <- (qhyper(p = c(' + p + '), m = ' + successes + ', n = ' + failures + ', k = ' + sampleSize + ', ' + tail + '))\n');
}

function printout() {
  // Header
  header = new Header(i18n("Hypergeometric quantiles H(%1,%2,%3)", populationSize, successes, sampleSize));
  header.add(i18n("Population size"), populationSize);
  header.add(i18n("Number of successes in population"), successes);
  header.add(i18n("Number of draws"), sampleSize);
  if (tail === "lower.tail=TRUE") {
    header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
  } else {
    header.add(i18n("Accumulation tail"), i18n("Right (>)"));
  }
  header.print();
  // Result
  echo('rk.print.literal(tibble(' + i18n("Cumulative prob") + ' = c(' + p + '), ' + i18n("Quantile") + ' = result) |>\n');
  echo('\tkable("html", align = "c", escape = F) |>\n');
  echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
  echo(')\n'); 
}