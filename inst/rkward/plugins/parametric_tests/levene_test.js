// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variable,
  variableName,
  factor,
  factorName,
  groups,
  groupsName,
  center;

function setGlobalVars() {
  variable = getString("variable");
  variableName = getString("variable.shortname");
  dataframe = getDataframe(variable);
  factor = getString("factor");
  factorName = getString("factor.shortname");
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  center = getString("center");
}

function preprocess() {
  setGlobalVars();
  echo('require(car)\n');
  echo('require(plyr)\n');
}

function calculate() {
  // Filter
  filter();
  // Test settings
  var options = ', center=' + center;
  // Grouped mode
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) leveneTest(df[[' + quote(variableName) + ']], df[[' + quote(factorName) + ']]' + options + '))\n');
  } else {
    // Non-grouped mode
    echo('result <- leveneTest(' + variable + ', ' + factor + options + ')\n');
  }
}

function printout() {
  // Header
  header = new Header(i18n("Levene's test for comparing variances of %1 according to %2", variableName, factorName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Comparison of"), i18n("%1 according to %2", variableName, factorName));
  header.add(i18n("Null hypothesis"), i18n("The are no significant differences among the variances of the populations"));
  header.add(i18n("Alternative hypothesis"), i18n("There are significant differences among the variances of at least two populations"));
  if (center == "median") {
    header.add(i18n("Variability with respect to"), i18n("Median"));
  } else {
    header.add(i18n("Variability with respect to"), i18n("Mean"));
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
    echo(i18n("Populations defined by") + ' = "' + factorName + '", ');
    echo(i18n("Degrees of freedom") + ' = result[[i]]$Df, ');
    echo(i18n("F statistic") + ' = result[[i]][["F value"]][1], ');
    echo(i18n("p-value") + ' = result[[i]][["Pr(>F)"]][1]');
    echo('))}\n');
  } else {
    // Non-grouped mode
    echo('rk.results(list(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations defined by") + ' = "' + factorName + '", ');
    echo(i18n("Degrees of freedom") + ' = result$Df, ');
    echo(i18n("F statistic") + ' = result[["F value"]][1], ');
    echo(i18n("p-value") + ' = result[["Pr(>F)"]][1]');
    echo('))\n');
  }
}
