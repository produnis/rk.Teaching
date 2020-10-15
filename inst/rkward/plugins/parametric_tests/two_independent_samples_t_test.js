// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variable,
  variableName,
  factor,
  factorName,
  population1,
  population2,
  groups,
  groupsName,
  getConfInt,
  confLevel,
  hypothesis;

function setGlobalVars() {
  variable = getString("variable");
  variableName = getString("variable.shortname");
  dataframe = getDataframe(variable);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  factor = getString("factor");
  factorName = getString("factor.shortname");
  population1 = getString("population1");
  population2 = getString("population2");
  groupsName = getList("groups.shortname");
  getConfInt = getBoolean("frameConfInt.checked");
  confLevel = getString("confLevel");
  hypothesis = getString("hypothesis");
}

function preprocess() {
  setGlobalVars();
  echo('library(plyr)\n');
}

function calculate() {
  // Filter
  filter();
  // Test settings
  var options = ", alternative=\"" + hypothesis + "\"";
  // Confidence interval
  if (getConfInt) {
    options += ", conf.level=" + confLevel;
  }
  // Grouped mode
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo(dataframe + ' <- ' + dataframe + '[!is.na(' + dataframe + '[[".groups"]]),]\n');
    echo('resultvar <- dlply(' + dataframe + ', ".groups", function(df) var.test(df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population1 + '], df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population2 + '], conf.level=0.95))\n');
    echo('resultnovareq <- dlply(' + dataframe + ', ".groups", function(df) t.test(df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population1 + '], df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population2 + ']' + options + ', var.equal=FALSE))\n');
    echo('resultvareq <- dlply(' + dataframe + ', ".groups", function(df) t.test(df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population1 + '], df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population2 + ']' + options + ', var.equal=TRUE))\n');
  } else {
    // Non-grouped mode
    echo('resultvar <- var.test (' + variable + '[' + factor + '==' + population1 + '], ' + variable + '[' + factor + '==' + population2 + '], conf.level=0.95)\n');
    echo('resultnovareq <- t.test (' + variable + '[' + factor + '==' + population1 + '], ' + variable + '[' + factor + '==' + population2 + ']' + options + ', var.equal=FALSE)\n');
    echo('resultvareq <- t.test (' + variable + '[' + factor + '==' + population1 + '], ' + variable + '[' + factor + '==' + population2 + ']' + options + ', var.equal=TRUE)\n');
  }
}

function printout() {
  // Header
  header = new Header(i18n("T-test for comparing means of %1 according to %2", variableName, factorName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Comparison of"), i18n("%1 according to %2", variableName, factorName));
  header.add(i18n("Null hypothesis"), i18n("Mean of %1 = Mean of %2", population1, population2));
  if (hypothesis == "two.sided") {
    header.add(i18n("Alternative hypothesis"), i18n("Mean %1 &ne; Mean %2", population1, population2));
  } else if (hypothesis == "greater") {
    header.add(i18n("Alternative hypothesis"), i18n("Mean %1 &gt; Mean %2", population1, population2));
  } else {
    header.add(i18n("Alternative hypothesis"), i18n("Mean %1 &lt; Mean %2", population1, population2));
  }
  if (getConfInt) {
    header.add(i18n("Confidence level of the confidence interval"), confLevel);
  }
  if (grouped) {
    header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
  }
  if (filtered) {
    header.addFromUI("condition");
  }
  header.print();
  // Grouped mode
  if (grouped) {
    echo('for (i in 1:length(resultvar)){\n');
    echo('\t rk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(resultvar)[i]), level=3)\n');
    // F test for comparison of variances
    echo('\t rk.header(' + i18n("F-test for comparing variances") + ', level=4)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated variance quotient") + ' = resultvar[[i]]$estimate, ');
    echo(i18n("Degrees of freedom") + ' = resultvar[[i]]$parameter, ');
    echo(i18n("F statistic") + ' = resultvar[[i]]$statistic, ');
    echo(i18n("p-value") + ' = resultvar[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(resultvar[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the quotient of variances") + ' = resultvar[[i]]$conf.int');
    }
    echo('))\n');
    // T-test for comparison of means
    // Non equal variances
    echo('rk.header ("T-test assuming non-equal variances",level=4)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated means") + ' = resultnovareq[[i]]$estimate, ');
    echo(i18n("Degrees of freedom") + ' = resultnovareq[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = resultnovareq[[i]]$statistic, ');
    echo(i18n("p-value") + ' = resultnovareq[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(resultnovareq[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the difference of means") + ' = resultnovareq[[i]]$conf.int');
    }
    echo('))\n');
    echo('rk.header ("T-test assuming equal variances",level=4)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated means") + ' = resultvareq[[i]]$estimate, ');
    echo(i18n("Degrees of freedom") + ' = resultvareq[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = resultvareq[[i]]$statistic, ');
    echo(i18n("p-value") + ' = resultvareq[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(resultvareq[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the difference of means") + ' = resultvareq[[i]]$conf.int');
    }
    echo('))}\n');
  } else {
    // Non-grouped mode
    // F test for comparison of variances
    echo('rk.header(' + i18n("F-test for comparing variances") + ', level=4)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated variance quotient") + ' = resultvar$estimate, ');
    echo(i18n("Degrees of freedom") + ' = resultvar$parameter, ');
    echo(i18n("F statistic") + ' = resultvar$statistic, ');
    echo(i18n("p-value") + ' = resultvar$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(resultvar$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the quotient of variances") + ' = resultvar$conf.int');
    }
    echo('))\n');
    // T-test for comparison of means
    //  Non equal variances
    echo('rk.header ("T-test assuming non-equal variances",level=4)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated means") + ' = resultnovareq$estimate, ');
    echo(i18n("Degrees of freedom") + ' = resultnovareq$parameter, ');
    echo(i18n("t statistic") + ' = resultnovareq$statistic, ');
    echo(i18n("p-value") + ' = resultnovareq$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(resultnovareq$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the difference of means") + ' = resultnovareq$conf.int');
    }
    echo('))\n');
    echo('rk.header ("T-test assuming equal variances",level=4)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated means") + ' = resultvareq$estimate, ');
    echo(i18n("Degrees of freedom") + ' = resultvareq$parameter, ');
    echo(i18n("t statistic") + ' = resultvareq$statistic, ');
    echo(i18n("p-value") + ' = resultvareq$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(resultvareq$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the difference of means") + ' = resultvareq$conf.int');
    }
    echo('))\n');
  }
}
