// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  x,
  xName,
  y,
  yName,
  groups,
  groupsName,
  getConfInt,
  confInt,
  confLevel,
  hypothesis;

function setGlobalVars() {
  x = getString("x");
  xName = getString("x.shortname");
  y = getString("y");
  yName = getString("y.shortname");
  dataframe = getDataframe(x);
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
  var options = ', alternative="' + hypothesis + '", paired=TRUE';
  // Confidence interval
  if (getConfInt) {
    options += ", conf.level=" + confLevel;
  }
  // Grouped mode
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) t.test(df[[' + quote(xName) + ']], df[[' + quote(yName) + ']]' + options + '))\n');
  } else {
    // Non-grouped mode
    echo('result <- t.test (' + x + ', ' + y + options + ')\n');
  }
}

function printout() {
  // Header
  header = new Header(i18n("T-test for the mean of %1 - %2", xName, yName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Comparison of"), i18n("%1 with %2", xName, yName));
  header.add(i18n("Null hypothesis"), i18n("Mean of %1 = Mean of %2", xName, yName));
  if (hypothesis == "two.sided") {
    header.add(i18n("Alternative hypothesis"), i18n("Mean %1 &ne; Mean %2", xName, yName));
  } else if (hypothesis == "greater") {
    header.add(i18n("Alternative hypothesis"), i18n("Mean %1 &gt; Mean %2", xName, yName));
  } else {
    header.add(i18n("Alternative hypothesis"), i18n("Mean %1 &lt; Mean %2", xName, yName));
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
    echo(i18n("Variable") + ' = "' + xName + ' - ' + yName + '", ');
    echo(i18n("Estimated mean difference") + ' = result[[i]]$estimate, ');
    echo(i18n("Degrees of freedom") + ' = result[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the mean of difference") + ' = result[[i]]$conf.int');
    }
    echo('))}\n');
  } else {
    // Non-grouped mode
    echo('rk.results (list(');
    echo(i18n("Variable") + ' = "' + xName + ' - ' + yName + '", ');
    echo(i18n("Estimated mean difference") + ' = result$estimate, ');
    echo(i18n("Degrees of freedom") + ' = result$parameter, ');
    echo(i18n("t statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval for<br/>the mean of difference") + ' = result$conf.int');
    }
    echo('))\n');
  }
}
