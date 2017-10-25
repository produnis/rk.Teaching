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
	echo('require(plyr)\n');
}

function calculate() {
	// Filter
	filter();
	// Grouped mode
	if (grouped) {
		echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
		echo('result <- dlply(' + dataframe + ', ".groups", function(df) friedman.test(as.matrix(df[c("' + variablesName.join("\", \"") + '")])))\n');
	} else {
		// Non-grouped mode
		echo('result <- friedman.test(as.matrix(' + dataframe + '[c("' + variablesName.join("\", \"") + '")]))\n');
	}
}

function printout() {
	// Header
	header = new Header(i18n("Friedman test for comparing the distribution of %1", variablesName.join(", ")));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Comparison of"), variablesName.join(", "));
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
		echo('\trk.results (list(');
		echo(i18n("Chi statistic") + ' = result[[i]][["statistic"]], ');
		echo(i18n("p-vule") + ' = result[[i]][["p.value"]]');
		echo('))\n');
		echo('}\n');
	} else {
		// Non-grouped mode
		echo('rk.results(list(');
		echo(i18n("Chi statistic") + ' = result[["statistic"]], ');
		echo(i18n("p-vule") + ' = result[["p.value"]]');
		echo('))\n');
	}
}