// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variable,
  variableName,
  grouped, 
  groups,
  groupsName,
  mean,
  getConfInt,
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
  echo('library(tidyverse)\n');
  echo('library(broom)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  // Filter
  filter();
  // Test settings
  var options = ', alternative = "' + hypothesis + '", mu = ' + mean;
  // Confidence interval
  if (getConfInt) {
    options += ", conf.level = " + confLevel;
  }
  // Set grouped mode
  if (grouped) {
    echo('result <- ' + dataframe + ' |>\n');
    echo('\tgroup_by(' + groupsName + ') |>\n');
    echo('\tsummarise(test = tidy(t.test(' + variableName + options + '))) |>\n');
    echo('\tunnest(test)\n');
    echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
  } else {
    echo('result <- tidy(t.test (' + variable + options + '))\n');
  }
}

function printout() {
  // Header
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
  if (getBoolean("grouped")){
    echo('for (i in 1:length(result)){\n');
    echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('\trk.print.literal(\n');
    echo('\ttibble(');
    echo(i18n("Variable") + ' = ' + quote(variableName) + ', ');
    echo(i18n("Mean") + ' = result[[i]]$estimate, ');
    echo(i18n("DF") + ' = result[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval") + ' = paste0("(", round(result[[i]]$conf.low, 6), " , ", round(result[[i]]$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo('\t)\n'); 
    echo('}\n');
  } else {
    // Non-grouped mode
    echo('rk.print.literal(\n');
    echo('tibble(');
    echo(i18n("Variable") + ' = ' + quote(variableName) + ', ');
    echo(i18n("Mean") + ' = result$estimate, ');
    echo(i18n("DF") + ' = result$parameter, ');
    echo(i18n("t statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval") + ' = paste0("(", round(result$conf.low, 6), " , ", round(result$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
  }
}
