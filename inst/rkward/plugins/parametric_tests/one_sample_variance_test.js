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
  variance,
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
  variance = getString("variance");
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
  // Set grouped mode
  if (grouped) {
    echo('result <- ' + dataframe + ' |>\n');
    echo('\tgroup_by(' + groupsName + ') |>\n');
    echo('\tsummarise(estimate = estimate  <- var(na.omit(' + variableName + ')),\n');
    echo('\t\tdf = length(na.omit(' + variableName + ')) - 1,\n');
    echo('\t\tstatistic = df * estimate / ' + variance + ',\n');
    if (hypothesis == "two.sided") {
      echo('\t\tp.value = 2 * min(pchisq(statistic, df), pchisq(statistic, df, lower.tail = FALSE))');
    } else if (hypothesis == "greater") {
      echo('\t\tp.value = pchisq(statistic, df, lower.tail = FALSE)');
    } else {
      echo('\t\tp.value = pchisq(statistic, df)');
    }
    if (getConfInt) {
      if (hypothesis == "two.sided") {
        echo(',\n\t\tconf.low =  estimate * df / qchisq((1-' + confLevel + ')/2' + ', df, lower.tail = FALSE) ,\n');
        echo('\t\tconf.high = estimate * df / qchisq((1-' + confLevel + ')/2' + ', df))\n');
      } else if (hypothesis == "greater") {
        echo(',\n\t\tconf.low =  estimate * df / qchisq(' + confLevel + ', df),\n');
        echo('\t\tconf.high = Inf)\n');
      } else {
        echo(',\n\t\tconf.low = 0,\n');
        echo(',\n\t\tconf.high =  estimate * df / qchisq(' + confLevel + ', df, lower.tail = FALSE))\n');        
      }
    } else {
      echo(')\n');
    }
    echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
  } else {
    echo('estimate  <- var(na.omit(' + variable + '))\n');
    echo('df <- length(na.omit(' + variable + ')) - 1\n');
    echo('statistic <- df * estimate / ' + variance + '\n');
    if (hypothesis == "two.sided") {
        echo('p.value <- 2 * min(pchisq(statistic, df), pchisq(statistic, df, lower.tail = FALSE))\n');
    } else if (hypothesis == "greater") {
        echo('p.value <- pchisq(statistic, df, lower.tail = FALSE)\n');
    } else {
        echo('p.value <- pchisq(statistic, df)\n');
    }
    if (getConfInt) {
      if (hypothesis == "two.sided") {
        echo('confInt <-  c(estimate * df / qchisq((1-' + confLevel + ')/2' + ', df, lower.tail = FALSE) , estimate * df / qchisq((1-' + confLevel + ')/2' + ', df))\n');
      } else if (hypothesis == "greater") {
        echo('confInt <-  c(estimate * df / qchisq(' + confLevel + ', df), Inf)\n');
      } else {
        echo('confInt <-  c(0, estimate * df / qchisq(' + confLevel + ', df, lower.tail = FALSE))\n');        
      }
    }
  }
}

function printout() {
  // Header
  header = new Header(i18n("Test for the variance of %1", variableName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Variable to test"), variableName);
  header.add(i18n("Null hypothesis"), i18n("Variance of %1 = %2", variableName, variance));
  if (hypothesis == "two.sided") {
    header.add(i18n("Alternative hypothesis"), i18n("Variance &ne; %1", variance));
  } else if (hypothesis == "greater") {
    header.add(i18n("Alternative hypothesis"), i18n("Variance &gt; %1", variance));
  } else {
    header.add(i18n("Alternative hypothesis"), i18n("Variance &lt; %1", variance));
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
    echo(i18n("Variance") + ' = result[[i]]$estimate, ');
    echo(i18n("DF") + ' = result[[i]]$df, ');
    echo(i18n("chi statistic") + ' = result[[i]]$statistic, ');
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
    echo(i18n("Variance") + ' = estimate, ');
    echo(i18n("DF") + ' = df, ');
    echo(i18n("chi statistic") + ' = statistic, ');
    echo(i18n("p-value") + ' = p.value');
    if (getConfInt) {
      echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
      echo(', ' + i18n("Confidence interval") + ' = paste0("(", round(confInt[1], 6), " , ", round(confInt[2], 6), ")")');
    }
    echo(') |>\n');
    echo('\tkable("html", align = "c", escape = FALSE) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
  }
}
