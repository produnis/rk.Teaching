// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var delta, sd, siglevel, power, type, h1;

function preprocess () {
}


function calculate () {
	delta = getString("delta");
	sd = getString("sd");
	siglevel = getString("siglevel");
	power = getString("power");
	type = getString("type");
	h1 = getString("h1")
	echo('result <- power.t.test(delta=' + delta + ', sd=' + sd + ', sig.level=' + siglevel + ', power=' + power + ', type="' + type + '", alternative="' + h1 + '")\n');
}

function printout () {
	echo ('rk.header ("Sample size computation for the t-test", parameter=list(');
	if (type=="one.sample") echo ('"Type of test" = "One population"');
	else if (type=="two.sample") echo ('"Type of test" = "Two independent populations"');
	else echo ('"Type of test" = "Two paired populations"');
	if (h1=="two.sided") echo (', "Alternative hypothesis" = "Two-sided"');
	else echo (', "Alternative hypothesis" = "One-sided"');
	echo (', "Difference between the means" = "' + delta + '", "Standard deviation" = "' + sd + '", "Significance level" ="' + siglevel + '", "Power" = "' + power + '"))\n');

	echo ('rk.results (list("Sample size required"= result$n))\n');
}