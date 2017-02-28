// globals
var data, variable, factor, factorname, defsamples, sample1, sample2, confint, conflevel, hypothesis;

function preprocess () {
    
}

function calculate () {
    // Filter
    echo(getString("filter_embed.code.calculate"));
    // Load variables
    variable = getString("variable");
    factor = getString("factor");
    defsamples = getBoolean("samples_frame.checked");
    if (defsamples){
        sample1 = getString("sample1");
        sample2 = getString("sample2");
        data = factor.split('[[')[0];
        factorname = getString("factor.shortname");
        echo (data + ' <- subset(' + data + ', subset=' + factorname + '=="' + sample1 + '" | ' + factorname + '=="' + sample2 + '")\n');
        echo (factor + ' <- factor(' + factor + ')\n');
    }
    confint = getBoolean("confint_frame.checked");
    conflevel = getString("conflevel");
    hypothesis = getString("hypothesis");
    var options = ", alternative=\"" + hypothesis + "\"";
    if (confint) options += ", conf.level=" + conflevel;
    echo('result <- var.test (' + variable + ' ~ ' + factor + options + ')\n');
}

function printout () {
    echo ('rk.header ("Fisher\'s F test to compare the variances of ' + getString("variable.shortname") + ' according to ' + getString("factor.shortname") + '", ');
    echo ('parameters=list ("Comparison of" = rk.get.description(' + variable + '), "According to" = rk.get.description(' + factor + ')' + getString("filter_embed.code.printout") + ', "Null hypothesis" = paste("variance of", levels(' + factor + ')[1], " = variance of", levels(' + factor + ')[2])');
    if (hypothesis=="two.sided"){
        echo(', "Alternative hypothesis" = paste("variance of", levels(' + factor + ')[1], " &ne; variance of", levels(' + factor + ')[2])');
    }
    else if (hypothesis=="greater") {
        echo(', "Alternative hypothesis" = paste("variance of", levels(' + factor + ')[1], " &gt; variance of", levels(' + factor + ')[2])');
    }
    else {
        echo(', "Alternative hypothesis" = paste("variance of", levels(' + factor + ')[1], " &lt; variance of", levels(' + factor + ')[2])');
    }	if (confint) {
        echo (', "Confidence level of the confidence interval" = "' + conflevel + '"');
    }
    echo('))\n');
    echo ('rk.results (list(');
    echo ('"Variable" = rk.get.short.name(' + variable + '), ');
    echo ('"Factor levels" = levels(' + factor + '), ');
    echo ('"Degrees of<br/>freedom" = result$parameter, ');
    echo ('"F statistic" = result$statistic, ');
    echo ('"p-valor" = result$p.value');
    if (confint) {
        echo (', "% Confidence level" = (100 * attr(result$conf.int, "conf.level"))');
        echo (', "Confidence interval for<br/>the quotient of variances" = result$conf.int');
    }
    echo ('))\n');
}


