// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var x, y, confint, conflevel, hypothesis;

function preprocess () {

}

function calculate () {
	// Filter
	echo(getString("filter_embed.code.calculate"));
	// Load variables
	x = getString("x");
	y = getString("y");
	confint = getBoolean("confint_frame.checked");
	conflevel = getString("conflevel");
	hypothesis = getString("hypothesis");
	var options = ', alternative="' + hypothesis + '", paired=TRUE';
	if (confint) {
		options += ", conf.level=" + conflevel;
	}	
	echo('result <- t.test (' + x + ', ' + y + options + ')\n');
}

function printout () {
	echo ('rk.header ("t-test for the mean of ' + getString("x.shortname") + ' - ' + getString("y.shortname") + '", ');
	echo ('parameters=list ("Comparison of " = rk.get.description(' + x + '), "with" = rk.get.description(' + y + ')' + getString("filter_embed.code.printout") + ', "Null hypothesis" = paste("mean ", rk.get.short.name(' + x + '), " = mean ", rk.get.short.name(' + y + '))');
	if (hypothesis=="two.sided"){
		echo(', "Alternative hypothesis" = paste("mean ", rk.get.short.name(' + x + '), " &ne; mean ", rk.get.short.name(' + y + '))');
	}
	else if (hypothesis=="greater") {
		echo(', "Alternative hypothesis" = paste("mean ", rk.get.short.name(' + x + '), " &gt; mean ", rk.get.short.name(' + y + '))');
	}
    else {
    	echo(', "Alternative hypothesis" = paste("mean ", rk.get.short.name(' + x + '), " &lt; mean ", rk.get.short.name(' + y + '))');
    }
	if (confint) {
		echo (', "Confidence level of the confidence interval" = "' + conflevel + '"');
	}
	echo('))\n');
	echo ('rk.results (list(');
	echo ('"Variable" = paste(rk.get.short.name(' + x + '), "-", rk.get.short.name(' + y + ')), ');
	echo ('"Estimated mean difference" = result$estimate, ');
	echo ('"Degrees of freedom" = result$parameter, ');
	echo ('"t statistic" = result$statistic, ');
	echo ('"p-value" = result$p.value');
	if (confint) {
		echo (', "% Confidence level" = (100 * attr(result$conf.int, "conf.level"))');
		echo (', "Confidence interval for<br/>the mean of difference" = result$conf.int');
	}
	echo ('))\n');
}


