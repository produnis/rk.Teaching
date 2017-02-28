// globals
var data, variable, factor, factorname, population1, population2, confint, conflevel, hypothesis;

function preprocess () {
}

function calculate () {
    // Filter
    echo(getString("filter_embed.code.calculate"));
    // Load variables
    variable = getString("variable");
    factor = getString("factor");
    population1 = getString("population1");
    population2 = getString("population2");
    confint = getBoolean("confint_frame.checked");
    conflevel = getString("conflevel");
    hypothesis = getString("hypothesis");
    var options = ", alternative=\"" + hypothesis + "\"";
    if (confint) options += ", conf.level=" + conflevel;
    echo('resultvar <- var.test (' + variable + '[' + factor + '==' + population1 + '], ' +  variable + '[' + factor + '==' + population2 + '], conf.level=0.95)\n');
    echo('resultnovareq <- t.test (' + variable + '[' + factor + '==' + population1 + '], ' +  variable + '[' + factor + '==' + population2 + ']' + options + ', var.equal=FALSE)\n');
    echo('resultvareq <- t.test (' + variable + '[' + factor + '==' + population1 + '], ' +  variable + '[' + factor + '==' + population2 + ']' + options + ', var.equal=TRUE)\n');
}

function printout () {
    // F test for comparison of variances
    echo('rk.header ("F-test for comparing variances of ' + getString("variable.shortname") + ' according to ' + getString("factor.shortname") + '", ');
    echo('parameters=list ("Comparison of" = rk.get.description(' + variable + '), "According to" = rk.get.description(' + factor + ')' + getString("filter_embed.code.printout") + ', "Null hyphotesis" = paste("variance", ' + population1 +', " = variance ", ' + population2 + ')');
    echo(', "Alternative hyphotesis" = paste("variance", ' + population1 +', " &ne; variance ", ' + population2 + ')');
    echo('))\n');
    echo('rk.results (list(');
    echo('"Variable" = rk.get.short.name(' + variable + '), ');
    echo('"Populations" = c(' + population1 + ', ' + population2 + '), ');
    echo('"Degrees of freedom" = resultvar$parameter, ');
    echo('"F statistic" = resultvar$statistic, ');
    echo('"p-value" = resultvar$p.value');
    echo (', "% Confidence level" = (100 * attr(resultvar$conf.int, "conf.level"))');
    echo (', "Confidence interval for<br/>the quotient of variances" = resultvar$conf.int');
    echo ('))\n');
    // T test for comparison of means 
    echo ('rk.header ("t-test for comparing means of ' + getString("variable.shortname") + ' according to ' + getString("factor.shortname") + '", ');
    echo ('parameters=list ("Comparison of" = rk.get.description(' + variable + '), "According to" = rk.get.description(' + factor + ')' + getString("filter_embed.code.printout") + ', "Null hyphotesis" = paste("mean", ' + population1 +', " = mean ", ' + population2 + ')');
    if (hypothesis=="two.sided"){
        echo(', "Alternative hyphotesis" = paste("mean", ' + population1 +', " &ne; mean ", ' + population2 + ')');
    }
    else if (hypothesis=="greater") {
        echo(', "Alternative hyphotesis" = paste("mean", ' + population1 +', " &gt; mean ", ' + population2 + ')');
    }
    else {
        echo(', "Alternative hyphotesis" = paste("mean", ' + population1 +', " &lt; mean ", ' + population2 + ')');
    }
    if (confint) {
        echo (', "Confidence level of the confidence interval" = "' + conflevel + '"');
    }
    echo('))\n');
    //  Non equal variances
    echo('rk.header ("Assuming non-equal variances",level=4)\n');
    echo('rk.results (list(');
    echo('"Variable" = rk.get.short.name(' + variable + '), ');
    echo('"Populations" = c(' + population1 + ', ' + population2 + '), ');
    echo('"Estimated means" = resultnovareq$estimate, ');
    echo('"Degrees of freedom" = resultnovareq$parameter, ');
    echo('"t statistic" = resultnovareq$statistic, ');
    echo('"p-value" = resultnovareq$p.value');
    if (confint) {
        echo(', "% Confidence level" = (100 * attr(resultnovareq$conf.int, "conf.level"))');
        echo(', "Confidence interval for<br/>the difference of means" = resultnovareq$conf.int');
    }
    echo('))\n');
    //  Equal variances
    echo('rk.header ("Assuming equal variances",level=4)\n');
    echo('rk.results (list(');
    echo('"Variable" = rk.get.short.name(' + variable + '), ');
    echo('"Populations" = c(' + population1 + ', ' + population2 + '), ');
    echo('"Estimated means" = resultvareq$estimate, ');
    echo('"Degrees of freedom" = resultvareq$parameter, ');
    echo('"t-statistic" = resultvareq$statistic, ');
    echo('"p-value" = resultvareq$p.value');
    if (confint) {
        echo(', "% Confidence level" = (100 * attr(resultvareq$conf.int, "conf.level"))');
        echo(', "Confidence interval for<br/>the difference of means" = resultvareq$conf.int');
    }
    echo('))\n');
}


