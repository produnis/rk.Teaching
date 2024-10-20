// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var variable,
	variableName,
	factor,
	factorName,
	grouped,
	groups,
	groupsName,
	pairwise;

function setGlobalVars() {
	variable = getString("variable");
	variableName = getString("variable.shortname");
	dataframe = getDataframe(variable);
	factor = getString("factor");
	factorName = getString("factor.shortname");
	groupsName = getList("groups.shortname");
	grouped = getBoolean("grouped");
	groups = getList("groups");
	pairwise = getBoolean("pairwise");
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
		echo('\tsummarise(test = tidy(kruskal.test(' + variableName + ' ~ ' + factorName + '))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
		if (pairwise) {
			echo('result.pairwise <- ' + dataframe + ' |>\n');
			echo('\tgroup_by(' + groupsName + ') |>\n');
			echo('\treframe(test = tidy(pairwise.wilcox.test(' + variableName + ', ' + factorName + ', p.adjust.method = "BH"))) |>\n');
			echo('\tunnest(test)\n');
			echo('result.pairwise <- split(result.pairwise, list(result.pairwise$' + groupsName.join(",result.pairwise$") + '), drop = TRUE)\n');	
		}
	} else {
		// Non-grouped mode
		echo('result <- tidy(kruskal.test(' + variable + ' ~ ' + factor + '))\n');
		if (pairwise) {
			echo('result.pairwise <- tidy(pairwise.wilcox.test(' + variable + ', ' + factor + ',  p.adjust.method = "BH"))\n');
		}
	}
}

function printout() {
	// Header
	header = new Header(i18n("Kruskal-Wallis test for comparing the distribution of %1 according to %2", variableName, factorName));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Comparison of"), i18n("%1 according to %2", variableName, factorName));
	header.add(i18n("Null hypothesis"), i18n("There is no significant difference between the populations"));
	header.add(i18n("Alternative hypothesis"), i18n("There are significant difference between at least two populations"));
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
    	echo('\ttibble(');
		echo(i18n("Variable") + ' = ' + quote(variableName) + ', ');
		echo(i18n("Populations defined by") + ' = ' + quote(factorName) + ', ');
		echo(i18n("Chi statistic") + ' = result[[i]]$statistic, ');
		echo(i18n("p-value") + ' = result[[i]]$p.value) |>\n');
		echo('\t\tkable("html", align = "c", escape = F) |>\n');
    	echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo('\t)\n');
		if (pairwise) {
			echo('\trk.header(' + i18n("Pairwise comparison") + ', level=3)\n');
			echo('\trk.print.literal(\n');
    		echo('\ttibble(');
			echo(i18n("Population 1") + ' = result.pairwise[[i]]$group1, ');
			echo(i18n("Population 2") + ' = result.pairwise[[i]]$group2, ');
			echo(i18n("p-value") + ' = result.pairwise[[i]]$p.value) |>\n');
			echo('\tkable("html", align = "c", escape = F) |>\n');
    		echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
			echo('\t)\n');
		}
		echo('}\n');
	} else {
		// Non-grouped mode
		echo('rk.print.literal(tibble(');
		echo(i18n("Variable") + ' = ' + quote(variableName) + ', ');
		echo(i18n("Populations defined by") + ' = ' + quote(factorName) + ', ');
		echo(i18n("Chi statistic") + ' = result$statistic, ');
		echo(i18n("p-value") + ' = result$p.value) |>\n');
    	echo('\tkable("html", align = "c", escape = F) |>\n');
    	echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    	echo(')\n');
		if (pairwise) {
			echo('rk.header(' + i18n("Pairwise comparison") + ', level=3)\n');
			echo('rk.print.literal(tibble(');
			echo(i18n("Population 1") + ' = result.pairwise$group1, ');
			echo(i18n("Population 2") + ' = result.pairwise$group2, ');
			echo(i18n("p-value") + ' = result.pairwise$p.value) |>\n');
			echo('\tkable("html", align = "c", escape = F) |>\n');
    		echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    		echo(')\n')
		}
	}
}
