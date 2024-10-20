// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
	variable,
	variableName,
	groups,
	groupsName;

function setGlobalVars() {
	variable = getString("variable");
	variableName = getString("variable.shortname");
	dataframe = getDataframe(variable);
	grouped = getBoolean("grouped");
	groups = getList("groups");
	groupsName = getList("groups.shortname");
}

function preprocess() {
	setGlobalVars();
	echo('library(tidyverse)\n');
	echo('library(broom)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
	echo('library(nortest)\n');
}

function calculate() {
	// Filter
	filter();
	// Set grouped mode
	if (grouped) {
		echo('result <- ' + dataframe + ' |>\n');
		echo('\tgroup_by(' + groupsName + ') |>\n');
		echo('\tsummarise(test = tidy(lillie.test(' + variableName + '))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
	} else {
		echo('result <- tidy(lillie.test(' + variableName + '))\n');
	}
}

function printout() {
	// Header
	header = new Header(i18n("Lilliefors (Kolmogorov-Smirnov) normality test of %1", variableName));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Variable to test"), variableName);
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
		echo('\trk.print.literal(\n');
		echo('\t\ttibble(');
		echo(i18n("Statistic") + ' = result[[i]]$statistic,');
		echo(i18n("p-value") + ' = result[[i]]$p.value) |>\n');
		echo('\t\tkable("html", align = "c", escape = F) |>\n');
    	echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    	echo('\t)\n'); 
		echo('}\n');
	}
	// Non grouped mode
	else {
		echo('rk.print.literal(\n');
		echo('\ttibble(');
		echo(i18n("Statistic") + ' = result$statistic, ');
		echo(i18n("p-value") + ' = result$p.value) |>\n');
		echo('\tkable("html", align = "c", escape = F) |>\n');
    	echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    	echo(')\n'); 
	}
}