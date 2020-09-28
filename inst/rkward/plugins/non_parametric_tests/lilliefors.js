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
	echo('require(nortest)\n');
	echo('require(plyr)\n');
}

function calculate() {
	// Filter
	filter();
	// Set grouped mode
	if (grouped) {
		echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
		echo('result <- dlply(' + dataframe + ', ".groups", function(df) lillie.test(df[["' + variableName + '"]]))\n');
	} else {
		echo('result <- lillie.test(' + variable + ')\n');
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
		echo('\trk.results (list(');
		echo(i18n("D statistic") + ' = result[[i]][[1]],');
		echo(i18n("p-value") + ' = result[[i]][[2]]))\n');
		echo('}\n');
	}
	// Non grouped mode
	else {
		echo('rk.results (list(');
		echo(i18n("D statistic") + ' = result[[1]],');
		echo(i18n("p-value") + ' = result[[2]]))\n');
	}
}