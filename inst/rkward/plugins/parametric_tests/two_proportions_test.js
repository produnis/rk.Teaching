// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variable,
  variableName,
  category,
  factor,
  factorName,
  population1,
  population2,
  grouped,
  groups,
  groupsName,
  manualFreq,
  freq1,
  n1,
  freq2,
  n2,
  type,
  getConfInt,
  confLevel,
  hypothesis;

function setGlobalVars() {
  variable = getString("variable");
  variableName = getString("variable.shortname");
  dataframe = getDataframe(variable);
  category = getString("category");
  factor = getString("factor");
  factorName = getString("factor.shortname");
  population1 = getString("population1");
  population2 = getString("population2");
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  manualFreq = getBoolean("manual.checked");
  freq1 = getString("freq1");
  n1 = getString("n1");
  freq2 = getString("freq2");
  n2 = getString("n2");
  type = getString("type");
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
  // Test settings
  var options = ', alternative = "' + hypothesis + '"';
  if (getConfInt) {
    options += ', conf.level = ' + confLevel;
  }
  if (type == "normal") {
    options += ', correct = FALSE';
  }
  // Manual frequency
  if (manualFreq) {
    echo('result <- tidy(prop.test(c(' + freq1 + ',' + freq2 + '), c(' + n1 + ',' + n2 + ')' + options + '))\n');
  } else {
    // Non-manual frequency
    // Filter
    filter();
    // Set grouped mode
    if (grouped) {
      echo('result <- ' + dataframe + ' |>\n');
      echo('\tgroup_by(' + groupsName.join(", ") + ', ' + factorName + ') |>\n');
      echo('\tcount(' + variableName + ', name = "freq") |>\n');
      echo('\tmutate(n = sum(freq)) |>\n');
      echo('\tfilter(' + variableName + ' == ' + category + ') |>\n');
      echo('\tpivot_wider(names_from = ' + factorName + ', values_from = c(freq, n)) |>\n');
      echo('\tmutate(test = tidy(prop.test(c(`freq_' + population1.slice(1, -1) + '`, `freq_' + population2.slice(1,-1) + '`), c(`n_' + population1.slice(1,-1) + '`, `n_' + population2.slice(1,-1) + '`)' + options + '))) |>\n');
      echo('\tunnest(test)\n');
      echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
    } else {
      echo('freq <- table(' + variable + ', ' + factor + ')\n');
      echo('result <- tidy(prop.test(c(freq[[' + category + ', ' + population1 + ']], freq[[' + category + ', ' + population2 + ']]), c(sum(freq[,' + population1 + ']), sum(freq[,' + population2 + ']))' + options + '))\n');
    }
  }
}

function printout() {
  if (manualFreq) {
    header = new Header(i18n("Test for comparing two proportions"));
    header.add(i18n("Null hypothesis"), i18n("Proportion 1 = proportion 2"));
    if (hypothesis == "two.sided") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion 1 &ne; proportion 2"));
    } else if (hypothesis == "greater") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion 1 &gt; proportion 2"));
    } else {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion 1 &lt; proportion 2", p));
    }
  } else {
    header = new Header(i18n("Test for comparing the proportions of %1 = %2 in %3 and %4", variableName, category, population1, population2));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variable to test"), variableName);
    header.add(i18n("Null hypothesis"), i18n("Proportion %1 = proportion %2", population1, population2));
    if (hypothesis == "two.sided") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion %1 &ne; proportion %2", population1, population2));
    } else if (hypothesis == "greater") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion %1 &gt; proportion %2", population1, population2));
    } else {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion %1 &lt; proportion %2", population1, population2));
    }
  }
  if (type == "normal_correction") {
    header.add(i18n("Type of test"), i18n("Normal approximation with continuity correction"));
  } else {
    header.add(i18n("Type of test"), i18n("Normal approximation without continuity correction"));
  }
  if (getConfInt) {
    header.add(i18n("Confidence level of the confidence interval"), confLevel);
  }
  if (!manualFreq) {
    if (grouped) {
      header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
    }
    if (filtered) {
      header.addFromUI("condition");
    }
  }
  header.print();
  // Grouped mode
  if (!manualFreq & grouped) {
    echo('for (i in 1:length(result)){\n');
    echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('\trk.print.literal(\n');
    echo('\ttibble(');
    echo(i18n("Proportion in %1", population1) + ' = result[[i]]$estimate1, ');
    echo(i18n("Proportion in %1", population2) + ' = result[[i]]$estimate2, ');
    echo(i18n("DF") + ' = result[[i]]$parameter, ');
    echo(i18n("Chi statistic") + ' = result[[i]]$statistic, ');
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>difference between proportions") + ' = paste0("(", round(result[[i]]$conf.low, 6), " , ", round(result[[i]]$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\t\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo('\t)\n'); 
    echo('}\n');
  } else {
    // Non-grouped mode
    echo('rk.print.literal(\n');
    echo('tibble(');
    if (manualFreq) {
      echo(i18n("Proportion 1") + ' = result$estimate1, ');
      echo(i18n("Proportion 2") + ' = result$estimate2, ');
    } else {
      echo(i18n("Proportion in %1", population1) + ' = result$estimate1, ');
      echo(i18n("Proportion in %1", population2) + ' = result$estimate2, ');
    }
    echo(i18n("DF") + ' = result$parameter, ');
    echo(i18n("Chi statistic") + ' = result$statistic, ');
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval<br>difference between proportions") + ' = paste0("(", round(result$conf.low, 6), " , ", round(result$conf.high, 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
  }
}
