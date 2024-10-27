// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var effect,
  sigLevel,
  n,
  type,
  h1;

function setGlobalVars() {
  effect = getString("effect");
  sigLevel = getString("sigLevel");
  n = getString("n");
  type = getString("type");
  h1 = getString("h1")
}

function preprocess() {
  setGlobalVars();
  echo('library(tidyverse)\n');
  echo('library(pwr)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  echo('result <- pwr.t.test(n = ' + n + ', d = ' + effect + ', sig.level = ' + sigLevel + ', type = "' + type + '", alternative = "' + h1 + '")\n');
}

function printout() {
  // Header
  header = new Header(i18n("Power computation for the t-test"));
  if (type == "one.sample") {
    header.add(i18n("Type of test"), "One population");
  } else if (type == "two.sample") {
    header.add(i18n("Type of test"), "Two independent populations");
  } else {
    header.add(i18n("Type of test"), "Two paired populations");
  }
  if (h1 == "two.sided") {
    header.add(i18n("Alternative hypothesis"), "Two-sided");
  } else {
    header.add(i18n("Alternative hypothesis"), "Two-sided");
  }
  header.add(i18n("Effect size"), effect);
  header.add(i18n("Significance level"), sigLevel);
  header.add(i18n("Sample size"), n);
  header.print();
  // // Sample size result
  echo('rk.print.literal(tibble(' + i18n("Power of test") + ' = result$power) |>\n');
  echo('\tkable("html", align = "c", escape = F) |>\n');
  echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
}
