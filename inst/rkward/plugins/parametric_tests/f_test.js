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
  factor = getString("factor");
  factorName = getString("factor.shortname");
  population1 = getString("population1");
  population2 = getString("population2");
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  getConfInt = getBoolean("frameConfInt.checked");
  confLevel = getString("confLevel");
  hypothesis = getString("hypothesis");
}

function preprocess() {
  setGlobalVars();
  echo('require(plyr)\n');
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
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) var.test(df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population1 + '], df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population2 + '],' + options + '))\n');
  } else {
    // Non-grouped mode
    echo('result <- var.test (' + variable + '[' + factor + '==' + population1 + '], ' + variable + '[' + factor + '==' + population2 + ']' + options + ')\n');
  }
}

function printout() {
  // Header
  header = new Header(i18n("F test for comparing variances of %1 according to %2", variableName, factorName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Comparison of"), i18n("%1 according to %2", variableName, factorName));
  header.add(i18n("Null hypothesis"), i18n("Variance %1 = Variance %2", population1, population2));
  if (hypothesis == "two.sided") {
    header.add(i18n("Alternative hypothesis"), i18n("Variance %1 &ne; Variance %2", population1, population2));
  } else if (hypothesis == "greater") {
    header.add(i18n("Alternative hypothesis"), i18n("Variance %1 &gt; Variance %2", population1, population2));
  } else {
    header.add(i18n("Alternative hypothesis"), i18n("Variance %1 &lt; Variance %2", population1, population2));
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
    echo('for (i in 1:length(result)){\n');
    echo('\t rk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated variance quotient") + ' = result[[i]]$estimate, ');
    echo(i18n("Degrees of freedom") + ' = result[[i]]$parameter, ');
    echo(i18n("F statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the quotient of variances") + ' = result[[i]]$conf.int');
    }
    echo('))}\n');
  } else {
    // Non-grouped mode
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
    echo(i18n("Estimated variance quotient") + ' = result$estimate, ');
    echo(i18n("Degrees of freedom") + ' = result$parameter, ');
    echo(i18n("F statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the quotient of variances") + ' = result$conf.int');
    }
    echo('))\n');
  }
}
