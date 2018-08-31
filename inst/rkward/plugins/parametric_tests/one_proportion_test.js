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
  echo('require(plyr)\n');
}

function calculate() {
  // Test settings
  var options = ', alternative="' + hypothesis + '", p=' + p;
  if (getConfInt) {
    options += ", conf.level=" + confLevel;
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
      echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
      echo(dataframe + ' <- ' + dataframe + '[!is.na(' + dataframe + '[[".groups"]]),]\n');
      echo('result <- dlply(' + dataframe + ', ".groups", function(df){\n\tfreq <- table(df[[' +  quote(variableName) + ']])\n');
      if (type == "binomial") {
        echo('\tbinom.test(freq[[' + category + ']], sum(freq)' +  options + ')\n})\n');
      } else if (type == "normal_correction") {
        echo('\tprop.test(freq[[' + category + ']], sum(freq)' +  options + ')\n})\n');
      } else {
        echo('\tprop.test(freq[[' + category + ']], sum(freq)' +  options + ', correct=FALSE)\n})\n');
      }
    } else {
      echo('freq <- table(' + variable + ')\n');
      echo('result <-');
      if (type == "binomial") {
        echo('binom.test(freq[[' + category + ']], sum(freq)' +  options + ')\n');
      } else if (type == "normal_correction") {
        echo('prop.test(freq[[' + category + ']], sum(freq)' +  options + ')\n');
      } else {
        echo('prop.test(freq[[' + category + ']], sum(freq)' +  options + ', correct=FALSE)\n');
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
    echo('\t rk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('rk.results (list(');
    echo(i18n("Estimated proportion") + ' = result[[i]]$estimate, ');
    if (type != "binomial") {
      echo(i18n("Degrees of freedom") + ' = result[[i]]$parameter, ');
      echo(i18n("Chi statistic") + ' = result[[i]]$statistic, ');
    }
    echo(i18n("p-value") + ' = result[[i]]$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result[[i]]$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval<br/>for the proportion") + ' = result[[i]]$conf.int');
    }
    echo('))}\n');
  } else {
    // Non-grouped mode
    echo('rk.results (list(');
    echo(i18n("Estimated proportion") + ' = result$estimate, ');
    if (type != "binomial") {
      echo(i18n("Degrees of freedom") + ' = result$parameter, ');
      echo(i18n("Chi statistic") + ' = result$statistic, ');
    }
    echo(i18n("p-value") + ' = result$p.value');
    if (getConfInt) {
      echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result$conf.int, "conf.level"))');
      echo(', ' + i18n("Confidence interval<br/>for the proportion") + ' = result$conf.int');
    }
    echo('))\n');
  }
}
