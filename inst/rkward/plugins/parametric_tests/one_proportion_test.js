// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variable,
  variableName,
  category,
  grouped,
  groups,
  groupsName,
  manualFreq,
  freq,
  n,
  p,
  type,
  getConfInt,
  confLevel,
  hypothesis;

function setGlobalVars() {
  variable = getString("variable");
  variableName = getString("variable.shortname");
  dataframe = getDataframe(variable);
  category = getString("category");
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  manualFreq = getBoolean("manual.checked");
  freq = getString("freq");
  n = getString("n");
  p = getString("proportion");
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
  var options = ', alternative = "' + hypothesis + '", p = ' + p;
  if (getConfInt) {
    options += ", conf.level = " + confLevel;
  }
  // Manual frequency
  if (manualFreq) {
    if (type == "binomial") {
      echo('result <- binom.test (' + freq + ',' + n +  options + ')\n');
    } else if (type == "normal_correction") {
      echo('result <- prop.test (' + freq + ',' + n +  options + ')\n');
    } else {
      echo('result <- prop.test (' + freq + ',' + n +  options + ', correct=FALSE)\n');
    }
  } else {
    // Non-manual frequency
    // Filter
    filter();
    // Set grouped mode
    if (grouped) {
      echo('result <- ' + dataframe + ' |>\n');
      echo('\tgroup_by(' + groupsName.join(", ") + ') |>\n');
      echo('\tcount(' + variableName + ', name = "freq") |>\n');
      echo('\tmutate(n = sum(freq)) |>\n');
      echo('\tfilter(' + variableName + ' == ' + category + ') |>\n');
      if (type == "binomial") {
        echo('\tmutate(test = tidy(binom.test(freq, n' + options + '))) |>\n');
      } else if (type == "normal_correction") {
        echo('\tmutate(test = tidy(prop.test(freq, n' + options + '))) |>\n');
      } else {
        echo('\tmutate(test = tidy(prop.test(freq, n' + options + ', correct = FALSE))) |>\n');
      }
      echo('\tunnest(test)\n');
      echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
    } else {
      echo('freq <- table(' + variable + ')\n');
      echo('result <- ');
      if (type == "binomial") {
        echo('tidy(binom.test(freq[[' + category + ']], sum(freq)' +  options + '))\n');
      } else if (type == "normal_correction") {
        echo('tidy(prop.test(freq[[' + category + ']], sum(freq)' +  options + '))\n');
      } else {
        echo('tidy(prop.test(freq[[' + category + ']], sum(freq)' +  options + ', correct = FALSE))\n');
      }
    }
  }
}

function printout() {
  if (manualFreq) {
    header = new Header(i18n("Test for one proportion"));
    header.add(i18n("Null hypothesis"), i18n("Proportion = %1", p));
    if (hypothesis == "two.sided") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion &ne; %1", p));
    } else if (hypothesis == "greater") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion &gt; %1", p));
    } else {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion &lt; %1", p));
    }
  } else {
    header = new Header(i18n("Test for the proportion of %1 = %2", variableName, category));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variable to test"), variableName);
    header.add(i18n("Null hypothesis"), i18n("Proportion of %1 = %2", category, p));
    if (hypothesis == "two.sided") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion of %1 &ne; %2", category, p));
    } else if (hypothesis == "greater") {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion of %1 &gt; %2", category, p));
    } else {
      header.add(i18n("Alternative hypothesis"), i18n("Proportion of %1 &lt; %2", category, p));
    }
  }
  if (type == "binomial") {
    header.add(i18n("Type of test"), i18n("Exact binomial"));
  } else if (type == "normal_correction") {
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
    echo(i18n("Proportion") + ' = result[[i]]$estimate, ');
    if (type != "binomial") {
      echo(i18n("DF") + ' = result[[i]]$parameter, ');
      echo(i18n("Chi statistic") + ' = result[[i]]$statistic, ');
    }
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
    echo(i18n("Proportion") + ' = result$estimate, ');
    if (type != "binomial") {
      echo(i18n("DF") + ' = result$parameter, ');
      echo(i18n("Chi statistic") + ' = result$statistic, ');
    }
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
