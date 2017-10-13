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
	grouped = getBoolean("grouped");
	groups = getList("groups");
	factor = getString("factor");
	factorName = getString("factor.shortname");
	population1 = getString("population1");
	population2 = getString("population2");
	groupsName = getList("groups.shortname");
	getConfInt = getBoolean("frameConfInt.checked");
	confLevel = getString("confLevel");
	hypothesis = getString("hypothesis");
}

function preprocess() {
	setGlobalVars();
	echo('require(plyr)\n');
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
		echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
		echo('result <- dlply(' + dataframe + ', ".groups", function(df) wilcox.test(df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population1 + '], df[[' + quote(variableName) + ']][df[[' + quote(factorName) + ']]==' + population2 + ']' + options + '))\n');
	} else {
		// Non-grouped mode
		echo('result <- wilcox.test(' + variable + ' ~ ' + factor + options + ')\n');
	}
}

function printout() {
	// Header
	header = new Header(i18n("Mann Whitney U test for comparing the distribution of %1 according to %2", variableName, factorName));
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
		header.add(i18n("Type of test"), i18n("Normal approximation without continuity correction"));
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
		echo('rk.results (list(');
		echo(i18n("Variable") + ' = "' + variableName + '", ');
		echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
		echo(i18n("U statistic") + ' = result[[i]]$statistic, ');
		echo(i18n("p-value") + ' = result[[i]]$p.value');
		if (getConfInt) {
			echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result[[i]]$conf.int, "conf.level"))');
			echo(', ' + i18n("Confidence interval for<br/>the difference of ranks") + ' = result[[i]]$conf.int');
		}
		echo('))}\n');
	} else {
		// Non-grouped mode
		echo('rk.results (list(');
		echo(i18n("Variable") + ' = "' + variableName + '", ');
		echo(i18n("Populations") + ' = c(' + population1 + ', ' + population2 + '), ');
		echo(i18n("U statistic") + ' = result$statistic, ');
		echo(i18n("p-value") + ' = result$p.value');
		if (getConfInt) {
			echo(', ' + i18n("% Confidence level") + ' = (100 * attr(result$conf.int, "conf.level"))');
			echo(', ' + i18n("Confidence interval for<br/>the difference of ranks") + ' = result$conf.int');
		}
		echo('))\n');
	}
}