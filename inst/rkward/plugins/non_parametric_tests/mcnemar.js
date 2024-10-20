// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var row,
  rowName,
  col,
  colName,
  dataframe,
  observed,
  percentages,
  expected;

function setGlobalVars() {
  row = getString("row");
  rowName = getString("row.shortname");
  dataframe = getDataframe(row);
  col = getString("col");
  colName = getString("col.shortname");
  observed = getBoolean("observed");
  percentages = getBoolean("percentages");
  expected = getBoolean("expected");
  groupsName = getList("groups.shortname");
  grouped = getBoolean("grouped");
  groups = getList("groups");
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
  // Grouped mode
  if (grouped) {
		echo('result <- ' + dataframe + ' |>\n');
		echo('\tgroup_by(' + groupsName + ') |>\n');
		echo('\tsummarise(test = tidy(mcnemar.test(' + rowName + ' , ' + colName + '))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
  } else {
    // Non-grouped mode
    echo('result <- tidy(mcnemar.test(' + row + ', ' + col + '))\n');
  }
}

function printout() {
  // Header
  header = new Header(i18n("McNemar test of independence of %1 and %2", rowName, colName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Paired variables"), rowName + ", " + colName);
  header.add(i18n("Null hypothesis"), i18n("There is no significant association between the variables."));
  header.add(i18n("Alternative hypothesis"), i18n("There is a significant association between the variables."));
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
		echo(i18n("Chi statistic") + ' = result[[i]]$statistic, ');
		echo(i18n("DF") + ' = result[[i]]$parameter, ');
		echo(i18n("p-value") + ' = result[[i]]$p.value) |>\n');
		echo('\t\tkable("html", align = "c", escape = FALSE) |>\n');
		echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo('\t)\n'); 
    echo('}\n');
  } else {
    // Non-grouped mode
    echo('rk.print.literal(tibble(');
    echo(i18n("Chi statistic") + ' = result$statistic, ');
    echo(i18n("DF") + ' = result$parameter, ');
		echo(i18n("p-value") + ' = result$p.value) |>\n');
		echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo(')\n');
  }
}