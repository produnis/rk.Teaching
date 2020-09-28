// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var delta,
  sd,
  sigLevel,
  power,
  type,
  h1;

function setGlobalVars() {
  delta = getString("delta");
  sd = getString("sd");
  sigLevel = getString("sigLevel");
  power = getString("power");
  type = getString("type");
  h1 = getString("h1")
}

function preprocess() {
  setGlobalVars();
}

function calculate() {
  echo('result <- power.t.test(delta=' + delta + ', sd=' + sd + ', sig.level=' + sigLevel + ', power=' + power + ', type="' + type + '", alternative="' + h1 + '")\n');
}

function printout() {
  // Header
  header = new Header(i18n("Sample size computation for the t-test"));
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
  header.add(i18n("Difference between the means"), delta);
  header.add(i18n("Standard deviation of the population"), sd);
  header.add(i18n("Significance level"), sigLevel);
  header.add(i18n("Power"), power);
  header.print();
  // // Sample size result
  echo('rk.results (list(' + i18n("Sample size required") + ' = result$n))\n');
}
