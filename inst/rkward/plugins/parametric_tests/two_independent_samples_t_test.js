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
  echo('library(tidyverse)\n');
  echo('library(broom)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  // Filter
  filter();
  // Test settings
  var options = ", alternative = \"" + hypothesis + "\"";
  // Confidence interval
  if (getConfInt) {
    options += ", conf.level = " + confLevel;
  }
  // Grouped mode
  if (grouped) {
    echo('result <- ' + dataframe + ' |>\n');
    echo('\tfilter(' + factorName + ' %in% c(' + population1 + ', ' + population2 + ')) |>\n');
    echo('\tnest_by(' + groupsName + ') |>\n');
    echo('\tmutate(testvar = map(data, ~ tidy(var.test(' + variableName + ' ~ ' + factorName + ', data = .' + options + ')))) |>\n');
    echo('\tmutate(testnovareq = map(data, ~ tidy(t.test(' + variableName + ' ~ ' + factorName + ', data = .' + options + ', var.equal = FALSE)))) |>\n');
    echo('\tmutate(testvareq = map(data, ~ tidy(t.test(' + variableName + ' ~ ' + factorName + ', data = .' + options + ', var.equal = TRUE))))\n');
    echo('resultvar <- result |> unnest(testvar)\n');
    echo('resultnovareq <- result |> unnest(testnovareq)\n');
    echo('resultvareq <- result |> unnest(testvareq)\n');
    echo('resultvar <- split(resultvar, list(resultvar$' + groupsName.join(",resultvar$") + '), drop = TRUE)\n');
    echo('resultnovareq <- split(resultnovareq, list(resultnovareq$' + groupsName.join(",resultnovareq$") + '), drop = TRUE)\n');
    echo('resultvareq <- split(resultvareq, list(resultvareq$' + groupsName.join(",resultvareq$") + '), drop = TRUE)\n');
  } else {
    // Non-grouped mode
    echo('df <- ' + dataframe + ' |>\n');
    echo('\tfilter(' + factorName + ' %in% c(' + population1 + ', ' + population2 + '))\n');
    echo('resultvar <- tidy(var.test (' + variableName + ' ~ ' + factorName + ', data = df, conf.level = 0.95))\n');
    echo('resultnovareq <- tidy(t.test (' + variableName + ' ~ ' + factorName + ', data = df' + options + ', var.equal = FALSE))\n');
    echo('resultvareq <- tidy(t.test (' + variableName + ' ~ ' + factorName + ', data = df' + options + ', var.equal = TRUE))\n');
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
    // Grouped mode
    echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(resultvar)[i]), level=3)\n');
    // F test for comparison of variances
    echo('\trk.header(' + i18n("F-test for comparing variances") + ', level=4)\n');
    echo('\trk.print.literal(\n');
    echo('\ttibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Quotient of variances") + ' = resultvar[[i]]$estimate, ');
    echo(i18n("Num DF") + ' = resultvar[[i]]$parameter[1], ');
    echo(i18n("Den DF") + ' = resultvar[[i]]$parameter[2], ');
    echo(i18n("F statistic") + ' = resultvar[[i]]$statistic, ');
    echo(i18n("p-value") + ' = resultvar[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>quotient of variances") + ' = paste0("(", round(resultvar[[i]]$conf.low, 6), " , ", round(resultvar[[i]]$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\t\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo('\t)\n');
    // T-test for comparison of means
    //  Non equal variances
    echo('\trk.header(' + i18n("T-test assuming non-equal variances") + ',level=4)\n');
    echo('\trk.print.literal(\n');
    echo('\ttibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population1.slice(1) + ' = resultnovareq[[i]]$estimate1, ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population2.slice(1) + ' = resultnovareq[[i]]$estimate2, ');
    echo(i18n("Difference between means") + ' = resultnovareq[[i]]$estimate, ');
    echo(i18n("DF") + ' = resultnovareq[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = resultnovareq[[i]]$statistic, ');
    echo(i18n("p-value") + ' = resultnovareq[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>difference between means") + ' = paste0("(", round(resultnovareq[[i]]$conf.low, 6), " , ", round(resultnovareq[[i]]$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\t\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo('\t)\n'); 
    echo('\trk.header(' + i18n("T-test assuming equal variances") + ',level=4)\n');
    echo('\trk.print.literal(\n');
    echo('\ttibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population1.slice(1) + ' = resultvareq[[i]]$estimate1, ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population2.slice(1) + ' = resultvareq[[i]]$estimate2, ');
    echo(i18n("Difference between means") + ' = resultvareq[[i]]$estimate, ');
    echo(i18n("DF") + ' = resultvareq[[i]]$parameter, ');
    echo(i18n("t statistic") + ' = resultvareq[[i]]$statistic, ');
    echo(i18n("p-value") + ' = resultvareq[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>difference between means") + ' = paste0("(", round(resultvareq[[i]]$conf.low, 6), " , ", round(resultvareq[[i]]$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\t\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo('\t)\n'); 
    echo('}\n');
  } else {
    // Non-grouped mode
    // F test for comparison of variances
    echo('rk.header(' + i18n("F-test for comparing variances") + ', level=4)\n');
    echo('rk.print.literal(\n');
    echo('tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Quotient of variances") + ' = resultvar$estimate, ');
    echo(i18n("Num DF") + ' = resultvar$parameter[1], ');
    echo(i18n("Den DF") + ' = resultvar$parameter[2], ');
    echo(i18n("F statistic") + ' = resultvar$statistic, ');
    echo(i18n("p-value") + ' = resultvar$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>quotient of variances") + ' = paste0("(", round(resultvar$conf.low, 6), " , ", round(resultvar$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n');
    // T-test for comparison of means
    //  Non equal variances
    echo('rk.header(' + i18n("T-test assuming non-equal variances") + ',level=4)\n');
    echo('rk.print.literal(\n');
    echo('tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population1.slice(1) + ' = resultnovareq$estimate1, ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population2.slice(1) + ' = resultnovareq$estimate2, ');
    echo(i18n("Difference between means") + ' = resultnovareq$estimate, ');
    echo(i18n("DF") + ' = resultnovareq$parameter, ');
    echo(i18n("t statistic") + ' = resultnovareq$statistic, ');
    echo(i18n("p-value") + ' = resultnovareq$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>difference between means") + ' = paste0("(", round(resultnovareq$conf.low, 6), " , ", round(resultnovareq$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
    echo('rk.header(' + i18n("T-test assuming equal variances") + ',level=4)\n');
    echo('rk.print.literal(\n');
    echo('tibble(');
    echo(i18n("Variable") + ' = "' + variableName + '", ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population1.slice(1) + ' = resultvareq$estimate1, ');
    echo(i18n("Mean").slice(0,-1) + ' ' + population2.slice(1) + ' = resultvareq$estimate2, ');
    echo(i18n("Difference between means") + ' = resultvareq$estimate, ');
    echo(i18n("DF") + ' = resultvareq$parameter, ');
    echo(i18n("t statistic") + ' = resultvareq$statistic, ');
    echo(i18n("p-value") + ' = resultvareq$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>difference between means") + ' = paste0("(", round(resultvareq$conf.low, 6), " , ", round(resultvareq$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
  }
}
