// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var x,
	xName,
	y,
	yName,
	dataframe;

function setGlobalVars() {
	x = getString("x");
	xName = getString("x.shortname");
	y = getString("y");
	yName = getString("y.shortname");
	dataframe = getDataframe(x);
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
	// Grouped mode
	if (grouped) {
		echo('result <- ' + dataframe + ' |>\n');
		echo('\tgroup_by(' + groupsName + ') |>\n');
		echo('\tsummarise(test = tidy(cohen.kappa(cbind(' + xName + ', ' + yName + ')))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
	} else {
		echo('result <- tidy(cohen.kappa(cbind(' + x + ', ' + y + ')))\n');
	}
}

function printout() {
	header = new Header(i18n("Cohen\'s kappa coefficient of %1 and %2", xName, yName));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Variables"), xName + ", " + yName);
	header.print();
    if (grouped) {
		// Grouped mode
		echo('for (i in 1:length(result)){\n');
		echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
		echo('\trk.print.literal(tibble(');
		echo(i18n("Type") + ' = result[[i]]$type, ');
		echo(i18n("Kappa") + ' = result[[i]]$estimate, ');
		echo(i18n("Confidence interval") + ' = paste0("(", round(result[[i]]$conf.low, 6), " , ", round(result[[i]]$conf.high, 6), ")")) |>\n');
		echo('\t\tkable("html", align = "c", escape = F) |>\n');
		echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo('\t)\n');
		echo('}\n');
	}
	else {
		// Non-grouped mode
		echo('rk.print.literal(tibble(');
		echo(i18n("Type") + ' = result$type, ');
		echo(i18n("Kappa") + ' = result$estimate, ');
		echo(i18n("Confidence interval") + ' = paste0("(", round(result$conf.low, 6), " , ", round(result$conf.high, 6), ")")) |>\n');
		echo('\tkable("html", align = "c", escape = F) |>\n');
		echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo(')\n');
	}
}