// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variables,
  variablesNames,
  grouped,
  groups,
  groupsName,
  method,
  missing,
  pvalue;

function setGlobalVars() {
  variables = getList("variables");
  variablesNames = getList("variables.shortname");
  dataframe = getDataframe(variables);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  method = getString("method");
  missing = getString("missing");
  pvalue = getBoolean("p");
}

function preprocess() {
  setGlobalVars();
  echo('library(psych)\n');
  echo('library(tidyverse)\n');
  echo('library(broom)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  // Filter
  filter();
  echo('result <- ' + dataframe + ' |>\n');
  // Grouped mode
  if (grouped) {
      echo('\tgroup_by(' + groupsName + ') |>\n');
      echo('\tsummarise(correlation = list(corr.test(across(c(' + variablesNames.join(", ") + ')), use = ' + quote(missing) + ', method=' + quote(method) + ')))\n');
      echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
  } else {
      echo('\tselect(' + variablesNames.join(", ") + ') |>\n');
      echo('\tcorr.test(use = ' + quote(missing) + ', method=' + quote(method) + ')\n');
  }
}

  function printout() {
    // Header
    header = new Header(i18n("Correlation matrix of %1", variablesNames.join(", ")));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variables"), variablesNames.join(", "));
    header.add(i18n("Method"), method);
    if (missing == "pairwise.complete.obs") {
      header.add(i18n("Omitting missing values"), i18n("Pairwise"));
    } else {
      header.add(i18n("Omitting missing values"), i18n("In all the variables"));
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
      echo('\trk.header(' + i18n("Correlation coefficient") + ', level=4)\n');
      echo('\trk.print.literal(result[[i]]$correlation[[1]]$r |>\n');
        echo('\tkable("html", align = "c", escape = F) |>\n');
        echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
      if (pvalue) {
        echo('\trk.header(' + i18n("p-value") + ', level=4)\n');
        echo('\trk.print.literal(result[[i]]$correlation[[1]]$p |>\n');
        echo('\tkable("html", align = "c", escape = F) |>\n');
        echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
      }
      echo('}\n');
    } else {
      echo('rk.header(' + i18n("Correlation coefficient") + ', level=4)\n');
      echo('rk.print.literal(result$r |>\n');
      echo('\tkable("html", align = "c", escape = F) |>\n');
      echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
      echo(')\n'); 
      if (pvalue) {
        echo('rk.header(' + i18n("p-value") + ', level=4)\n');
        echo('rk.print.literal(result$p |>\n');
        echo('\tkable("html", align = "c", escape = F) |>\n');
        echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
        echo(')\n');   
      }
  }
}
