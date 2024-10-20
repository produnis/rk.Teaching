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
  echo('library(tidyverse)\n');
  echo('library(broom)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
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
    echo('result <- ' + dataframe + ' |>\n');
    echo('\tfilter(' + factorName + ' %in% c(' + population1 + ', ' + population2 + ')) |>\n');
    echo('\tnest_by(' + groupsName + ') |>\n');
    echo('\tmutate(test = map(data, ~ tidy(var.test(' + variableName + ' ~ ' + factorName + ', data = .' + options + ')))) |>\n');
    echo('\tunnest(test)\n');
    echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
  } else {
    // Non-grouped mode
    echo('df <- ' + dataframe + ' |>\n');
    echo('\tfilter(' + factorName + ' %in% c(' + population1 + ', ' + population2 + '))\n');
    echo('result <- tidy(var.test (' + variableName + ' ~ ' + factorName + ', data = df, conf.level = 0.95))\n');
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
    echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('\trk.print.literal(tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Quotient of variances") + ' = result[[i]]$estimate, ');
    echo(i18n("Num DF") + ' = result[[i]]$num.df, ');
    echo(i18n("Den DF") + ' = result[[i]]$den.df, ');
    echo(i18n("F statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>quotient of variances") + ' = paste0("(", round(result[[i]]$conf.low, 6), " , ", round(result[[i]]$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
    echo('}\n'); 
  } else {
    // Non-grouped mode
    echo('rk.print.literal(tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Quotient of variances") + ' = result$estimate, ');
    echo(i18n("Num DF") + ' = result$num.df, ');
    echo(i18n("Den DF") + ' = result$den.df, ');
    echo(i18n("F statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>quotient of variances") + ' = paste0("(", round(result$conf.low, 6), " , ", round(result$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
  }
}
