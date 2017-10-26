// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")

// globals
var observed,
	observedName,
	theoric,
	theoricName;

function setGlobalVars() {
	observed = getString("observed");
	observedName = getString("observed.shortname");
	theoric = getString("theoric");
	theoricName = getString("theoric.shortname");
}

function preprocess() {
	setGlobalVars();
}

function calculate() {
	echo('result <- chisq.test(' + observed + ', p=' + theoric + ', rescale.p=TRUE)\n');
}

function printout() {
	header = new Header(i18n("Chi-square test of goodness of fit"));
	header.add(i18n("Observed frequencies"), observedName);
	header.add(i18n("Theoretical probabilities"), theoricName);
	header.add(i18n("Null hypothesis"), i18n("There is no significant difference between the observed and the theorical distribution."));
	header.add(i18n("Alternative hypothesis"), i18n("There is a significant difference between the observed and the theorical distribution."));
	header.print();

	echo('rk.results (list(');
	echo(i18n("Chi statistic") + ' = result$statistic, ');
	echo(i18n("Degrees of freedom") + ' = result$parameter, ');
	echo(i18n("p-value") + ' = result$p.value');
	echo('))\n');
}