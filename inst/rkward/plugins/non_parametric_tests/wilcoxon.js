// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var x,
	xName,
	y,
	yName,
	grouped,
	groups,
	groupsName,
	type,
	getConfInt,
	confLevel,
	hypothesis;

function setGlobalVars() {
	x = getString("x");
	xName = getString("x.shortname");
	y = getString("y");
	yName = getString("y.shortname");
	dataframe = getDataframe(x);
	grouped = getBoolean("grouped");
	groups = getList("groups");
	groupsName = getList("groups.shortname");
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
	var options = ', alternative = ' + quote(hypothesis) + ', paired=TRUE';
	if (type == "non_correction") {
		options += ', correct = FALSE';
	}
	if (type == "exact") {
		options += ', exact = TRUE';
	}
	// Confidence interval
	if (getConfInt) {
		options += ', conf.int = TRUE, conf.level = ' + confLevel;
	}
	// Grouped mode
	if (grouped) {
		echo('result <- ' + dataframe + ' |>\n');
		echo('\tgroup_by(' + groupsName + ') |>\n');
		echo('\tsummarise(test = tidy(wilcox.test(' + xName + ', ' + yName + options + '))) |>\n');
		echo('\tunnest(test)\n');
		echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
		} else {
		// Non-grouped mode
		echo('result <- tidy(wilcox.test(' + x + ', ' + y + options + '))\n');
	}
}

function printout() {
	// Header
	header = new Header(i18n("Wilcoxon test for comparing the distributions of %1 and %2", xName, yName));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Comparison of"), i18n("%1 with %2", xName, yName));
	header.add(i18n("Null hypothesis"), i18n("Scores %1 = Scores %2", xName, yName));
	if (hypothesis == "two.sided") {
		header.add(i18n("Alternative hypothesis"), i18n("Scores %1 &ne; Scores %2", xName, yName));
	} else if (hypothesis == "greater") {
		header.add(i18n("Alternative hypothesis"), i18n("Scores %1 &gt; Scores %2", xName, yName));
	} else {
		header.add(i18n("Alternative hypothesis"), i18n("Scores %1 &lt; Scores %2", xName, yName));
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
		echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
		echo('\trk.print.literal(\n');
    	echo('\ttibble(');
		echo(i18n("Population 1") + ' = ' + quote(xName) + ', ');
		echo(i18n("Population 2") + ' = ' + quote(yName)+ ', ');		
		echo(i18n("V statistic") + ' = result[[i]]$statistic, ');
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
		echo('rk.print.literal(\n');
		echo('\ttibble(');
		echo(i18n("Population 1") + ' = ' + quote(xName) + ', ');
		echo(i18n("Population 2") + ' = ' + quote(yName) + ', ');		
		echo(i18n("V statistic") + ' = result$statistic, ');
		echo(i18n("p-value") + ' = result$p.value');
		if (getConfInt) {
			echo(', ' + i18n("Confidence(%)") + ' = ' + 100 * confLevel);
			echo(', ' + i18n("Confidence interval<br>median of difference") + ' = paste0("(", round(result$conf.low, 6), " , ", round(result$conf.high, 6), ")")');
		  }
		echo(') |>\n');
    	echo('\tkable("html", align = "c", escape = F) |>\n');
    	echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    	echo(')\n'); 
	}
}