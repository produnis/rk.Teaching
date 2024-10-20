// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
	variable,
	variableName,
	factor,
	factorName,
	population1,
	population2,
	grouped,
	groups,
	groupsName,
	type,
	getConfInt,
	confInt,
	confLevel,
	hypothesis;

function setGlobalVars() {
	variable = getString("variable");
	variableName = getString("variable.shortname");
	dataframe = getDataframe(variable);
	factor = getString("factor");
	factorName = getString("factor.shortname");
	population1 = getString("population1");
	population2 = getString("population2");
	groupsName = getList("groups.shortname");
	grouped = getBoolean("grouped");
	groups = getList("groups");
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
	// Filter
	filter();
	// Test settings
	var options = ', alternative="' + hypothesis + '"';
	if (type == "non_correction") {
		options += ', correct=FALSE';
	}
	if (type == "exact") {
		options += ', exact=TRUE';
	}
	// Confidence interval
	if (getConfInt) {
		options += ', conf.int=TRUE, conf.level=' + confLevel;
	}
	// Grouped mode
	if (grouped) {
		echo('result <- ' + dataframe + ' |>\n');
		echo('\tgroup_by(' + groupsName + ') |>\n');
		echo('\tsummarise(test = tidy(wilcox.test(' + variableName + ' ~ ' + factorName + options + '))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
	} else {
		// Non-grouped mode
		echo('result <- tidy(wilcox.test(' + variable + ' ~ ' + factor + options + '))\n');
	}
}

function printout() {
	// Header
	header = new Header(i18n("Mann-Whitney U test for comparing the distribution of %1 according to %2", variableName, factorName));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Comparison of"), i18n("%1 according to %2", variableName, factorName));
	header.add(i18n("Null hypothesis"), i18n("Scores %1 = Scores %2", population1, population2));
  if (hypothesis == "two.sided") {
    header.add(i18n("Alternative hypothesis"), i18n("Scores %1 &ne; Scores %2", population1, population2));
  } else if (hypothesis == "greater") {
    header.add(i18n("Alternative hypothesis"), i18n("Scores %1 &gt; Scores %2", population1, population2));
  } else {
    header.add(i18n("Alternative hypothesis"), i18n("Scores %1 &lt; Scores %2", population1, population2));
  }
	if (type == "non_correction") {
		header.add(i18n("Type of test"),
			i18n("Normal approximation without continuity correction"));
	} else if (type == "exact") {
		header.add(i18n("Type of test"), i18n("Exact"));
	} else {
		header.add(i18n("Type of test"), i18n("Normal approximation with continuity correction"));
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
	if (grouped) {
		echo('for (i in 1:length(result)){\n');
		echo('\t rk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
		echo('\trk.print.literal(\n');
    	echo('\ttibble(');
		echo(i18n("Population 1") + ' = ' + population1 + ', ');
		echo(i18n("Population 2") + ' = ' + population2 + ', ');		
		echo(i18n("U statistic") + ' = result[[i]]$statistic, ');
		echo(i18n("p-value") + ' = result[[i]]$p.value');
		if (getConfInt) {
			echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
			echo(', ' + i18n("Confidence interval<br>mean of difference") + ' = paste0("(", round(result[[i]]$conf.low, 6), " , ", round(result[[i]]$conf.high, 6), ")")');
		}
		echo(') |>\n');
		echo('\t\tkable("html", align = "c", escape = FALSE) |>\n');
		echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
		echo('\t)\n'); 
		echo('}\n');
	} else {
		// Non-grouped mode
		echo('rk.print.literal(tibble(');
		echo(i18n("Variable") + ' = "' + variableName + '", ');
		echo(i18n("Population 1") + ' = ' + population1 + ', ');
		echo(i18n("Population 2") + ' = ' + population2 + ', ');	
		echo(i18n("U statistic") + ' = result$statistic, ');
		echo(i18n("p-value") + ' = result$p.value');
		if (getConfInt) {
			echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
			echo(', ' + i18n("Confidence interval<br>difference of medians") + ' = paste0("(", round(result$conf.low, 6), " , ", round(result$conf.high, 6), ")")');
		  }
		echo(') |>\n');
    	echo('\tkable("html", align = "c", escape = F) |>\n');
    	echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    	echo(')\n');
	}
}