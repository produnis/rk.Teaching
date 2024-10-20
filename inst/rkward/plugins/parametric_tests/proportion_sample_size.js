// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var sd,
  confLevel,
  error;

function setGlobalVars() {
  p = getString("p");
  confLevel = getString("confLevel");
  error = getString("error");
}

function preprocess() {
  setGlobalVars();
  echo('library(rkTeaching)\n');
  echo('library(tidyverse)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  echo('result <- sampleSizeOneProportion(p=' + p + ', sig.level= 1-' + confLevel + ', error=' + error + ')\n');
}

function printout() {
  // Header
  header = new Header(i18n("Sample size computation to estimate a proportion"));
  header.add(i18n("Estimated proportion in the population"), p);
  header.add(i18n("Confidence level"), confLevel);
  header.add(i18n("Error"), '&#177;' + error);
  header.print();
  // Sample size result
  echo('rk.print.literal(tibble(' + i18n("Sample size required") + ' = result$n) |>\n');
  echo('\tkable("html", align = "c", escape = F) |>\n');
  echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
}
