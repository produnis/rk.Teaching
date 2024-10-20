// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  	variables,
  	variablesNames,
  	grouped,
  	groups,
  	groupsName;

function setGlobalVars() {
	variables = getList("variables");
  	variablesNames = getList("variables.shortname");
  	dataframe = getDataframe(variables);
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
	echo('library(psych)\n');

}

function calculate() {
	// Filter
	filter();
	echo('result <- ' + dataframe + ' |>\n');
	// Grouped mode
	if (grouped) {
		echo('\tselect(' + groupsName.join(", ") + ', ' + variablesNames.join(", ") + ') |>\n');
		echo('\tdrop_na(' + variablesNames.join(", ") + ') |>\n');
		echo('\tnest_by(' + groupsName + ') |>\n');
		echo('\tmutate(test = list(ICC(data)$results)) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
	} else {
		echo('\tselect(' + variablesNames.join(", ") + ') |>\n');
		echo('\tna.omit() |>\n');
		echo('\tICC()\n');
	}
}

function printout() {
	header = new Header(i18n("Intraclass correlation of %1", variablesNames.join(", ")));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Variables"), variablesNames.join(", "));
	header.print();
    if (grouped) {
		// Grouped mode
		echo('for (i in 1:length(result)){\n');
		echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
		echo('\trk.print.literal(tibble(');
		echo(i18n("Type") + ' = result[[i]]$type, ');
		echo(i18n("ICC") + ' = result[[i]]$ICC, ');
		echo(i18n("F statistic") + ' = result[[i]]$F, ');
		echo(i18n("DF1") + ' = result[[i]]$df1, ');
		echo(i18n("DF2") + ' = result[[i]]$df2, ');
		echo(i18n("p-value") + ' = result[[i]]$p) |>\n');
		echo('\t\tkable("html", align = "c", escape = F) |>\n');
		echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo('\t)\n');
		echo('}\n');
	}
	else {
		// Non-grouped mode
		echo('rk.print.literal(tibble(');
		echo(i18n("Type") + ' = result$results$type, ');
		echo(i18n("ICC") + ' = result$results$ICC, ');
		echo(i18n("F statistic") + ' = result$results$F, ');
		echo(i18n("DF1") + ' = result$results$df1, ');
		echo(i18n("DF2") + ' = result$results$df2, ');
		echo(i18n("p-value") + ' = result$results$p) |>\n');
		echo('\tkable("html", align = "c", escape = F) |>\n');
		echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo(')\n');
	}
}