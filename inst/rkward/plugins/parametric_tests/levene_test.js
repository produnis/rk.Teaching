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
  echo('library(tidyverse)\n');
  echo('library(broom)\n');
  echo('library(car)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  // Filter
  filter();
  // Test settings
  var options = ', center = ' + center;
  // Grouped mode
  if (grouped) {
    echo('result <- ' + dataframe + ' |>\n');
    echo('\tnest_by(' + groupsName + ') |>\n');
    echo('\tmutate(test = map(data, ~ tidy(leveneTest(' + variableName + ' ~ ' + factorName + ', data = .' + options + ')))) |>\n');
    echo('\tunnest(test)\n');
    echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
  } else {
    // Non-grouped mode
    echo('result <- tidy(leveneTest(' + variableName + ' ~ ' + factorName + ', data = ' + dataframe + options + '))\n');
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
    echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('rk.print.literal(tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = "' + factorName + '", ');
    echo(i18n("DF") + ' = result[[i]]$df, ');
    echo(i18n("Residual DF") + ' = result[[i]]$df.residual, ');
    echo(i18n("F statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n');     echo('}\n');
  } else {
    // Non-grouped mode
    echo('rk.print.literal(tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Populations") + ' = "' + factorName + '", ');
    echo(i18n("DF") + ' = result$df, ');
    echo(i18n("Residual DF") + ' = result$df.residual, ');
    echo(i18n("F statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n');   }
}
