// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
	variables,
	variablesName,
	grouped,
	groups,
	groupsName,
	statistics,
	narm;

function setGlobalVars() {
	variables = getList("variables");
	dataframe = getDataframe(variables);
	variablesName = getList("variables.shortname");
	grouped = getBoolean("grouped");
	groups = getList("groups");
	groupsName = getList("groups.shortname");
}

function preprocess() {
	setGlobalVars();
	echo('require(rk.Teaching)\n');
}

function calculate() {
	// Filter
	filter();
	// Remove NA
	var narm = "na.rm=FALSE";
	if (getBoolean("narm")) narm = "na.rm=TRUE";
	// Statistics
	statistics = getString("min") + getString("max") + getString("mean") + getString("median") + getString("mode") + getString("variance") + getString("unvariance") + getString("stdev") + getString("sd") + getString("cv") + getString("range") + getString("iqrange") + getString("skewness") + getString("kurtosis");
	if (getBoolean("quartile") || getString("quantiles") != '') {
		statistics += "'quantiles',";
	}
	statistics = 'c(' + statistics.slice(0, -1) + ')';
	var quantiles = 'c(';
	if (getBoolean("quartile")) {
		quantiles += '0.25, 0.5, 0.75 ';
		if (getString("quantiles") != '')
			quantiles += ', ';
	}
	quantiles += getString("quantiles") + ')';
	groups = ')]';
	if (getBoolean("grouped")) {
		groups = ',' + groupsName.map(quote) + ')], groups=c(' + groupsName.map(quote) + ')';
	}
	echo('result <- descriptiveStats(' + dataframe + '[c(' + variablesName.map(quote) + groups + ', statistics=' + statistics + ', quantiles= ' + quantiles + ')\n');

}

function printout() {
	header = new Header(i18n("Descriptive statistics of %1", variablesName.join(', ')));
	header.add(i18n("Data frame"), dataframe);
	header.add(i18n("Variable(s)"), variablesName.join(', '));
	if (grouped) {
		header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
	}
	if (getBoolean("narm")) {
		header.add(i18n("Ommit missing values"), i18n("Yes"));
	} else {
		header.add(i18n("Ommit missing values"), i18n("No"));
	}
	if (filtered) {
		header.addFromUI("condition");
	}
	header.print();

	// Print result
	if (getBoolean("grouped")) {
		echo('for (i in 1:length(result)){\n');
		echo('\t rk.header(paste(' + i18n("Group") + ', "' + groupsName.join('.') + ' = ", names(result)[i]),level=3)\n');
		echo('\t\t rk.results(result[[i]])\n');
		echo('}\n');
	} else {
		echo('rk.results(result)\n');
	}

}