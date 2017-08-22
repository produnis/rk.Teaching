// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variable,
  variableName,
  groups,
  groupsName,
  mean,
  getConfInt
  confInt,
  confLevel,
  hypothesis;

function setGlobalVars() {
  variable = getString("variable");
  variableName = getString("variable.shortname");
  dataframe = getDataframe(variable);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  mean = getString("mean");
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
  var options = ', alternative="' + hypothesis + '", mu=' + mean;
  // Confidence interval
  if (getConfInt) {
    options += ", conf.level=" + confLevel;
  }
  // Set grouped mode
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) t.test(df[[' + quote(variableName) + ']]' + options + '))\n');
  } else {
    echo('result <- t.test (' + variable + options + ')\n');
  }
}

function printout() {
  header = new Header(i18n("T-test for the mean of %1", variableName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Variable to test"), variableName);
  header.add(i18n("Null hypothesis"), i18n("Mean of %1 = %2", variableName, mean));
  if (hypothesis == "two.sided") {
    header.add(i18n("Alternative hypothesis"), i18n("Mean &ne; %1", mean));
  } else if (hypothesis == "greater") {
    header.add(i18n("Alternative hypothesis"), i18n("Mean &gt; %1", mean));
  } else {
    header.add(i18n("Alternative hypothesis"), i18n("Mean &lt; %1", mean));
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
    echo('rk.results (list(');
    echo(i18n("Variable") + ' = ' + quote(variableName) + ', ');
    echo(i18n("Estimated mean") + ' = result[[i]]$estimate, ');
    echo(i18n("Degrees of freedom") + ' = result[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval<br/>for the mean") + ' = result[[i]]$conf.int');
    }
    echo('))}\n');
  } else {
    // Non-grouped mode
    echo('rk.results (list(');
    echo(i18n("Variable") + ' = ' + quote(variableName) + ', ');
    echo(i18n("Estimated mean") + ' = result$estimate, ');
    echo(i18n("Degrees of freedom") + ' = result$parameter, ');
    echo(i18n("t statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval<br/>for the mean") + ' = result$conf.int');
    }
    echo('))\n');
  }
}
