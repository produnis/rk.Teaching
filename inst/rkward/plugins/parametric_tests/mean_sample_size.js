// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var sd,
  confLevel,
  error;

function setGlobalVars() {
  sd = getString("sd");
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
  echo('result <- sampleSizeOneMean(mean=, sd=' + sd + ', sig.level= 1-' + confLevel + ', error=' + error + ', error.type="absolute")\n');
}

function printout() {
  // Header
  header = new Header(i18n("Sample size computation to estimate one mean"));
  header.add(i18n("Standard deviation of the population"), sd);
  header.add(i18n("Confidence level"), confLevel);
  header.add(i18n("Error"), '&#177;' + error);
  header.print();
  // Sample size result
  echo('rk.print.literal(tibble(' + i18n("Sample size required") + ' = result$n) |>\n');
  echo('\tkable("html", align = "c", escape = F) |>\n');  
  echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
}
