// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var variables,
	variablesName,
	grouped,
	groups,
	groupsName;

function setGlobalVars() {
	variables = getList("variables");
	variablesName = getList("variables.shortname");
	dataframe = getDataframe(variables);
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
		echo('\tmutate(id = row_number()) |>\n');
		echo('\tpivot_longer(c(' + variablesName.join(", ") + '), names_to = "repetitions", values_to = "values") |>\n');
		echo('\tgroup_by(' + groupsName + ') |>\n');
		echo('\tsummarise(test = tidy(friedman.test(values ~ repetitions | id))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
	} else {
		// Non-grouped mode
		echo('result <- ' + dataframe + ' |>\n');
		echo('\tmutate(id = row_number()) |>\n');
		echo('\tpivot_longer(c(' + variablesName.join(", ") + '), names_to = "repetitions", values_to = "values") |>\n');
		echo('\tsummarise(test = tidy(friedman.test(values ~ repetitions | id))) |>\n');
		echo('\tunnest(test)\n');
	}
}

function printout() {
	// Header
	header = new Header(i18n("Friedman test for comparing the distribution of %1", variablesName.join(", ")));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Comparison of"), variablesName.join(", "));
	header.add(i18n("Null hypothesis"), i18n("There are no significant differences among the populations"));
	header.add(i18n("Alternative hypothesis"), i18n("There are significant differences between at least two populations"));
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
		echo(i18n("p-value") + ' = result[[i]]$p.value) |>\n');
		echo('\t\tkable("html", align = "c", escape = F) |>\n');
    	echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo('\t)\n');
		echo('}\n');
	} else {
		// Non-grouped mode
		echo('rk.print.literal(tibble(');
		echo(i18n("Chi statistic") + ' = result$statistic, ');
		echo(i18n("p-value") + ' = result$p.value) |>\n');
		echo('\tkable("html", align = "c", escape = F) |>\n');
    	echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo(')\n');
	}
}