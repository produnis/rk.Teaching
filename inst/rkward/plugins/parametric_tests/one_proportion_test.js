// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var x, freq, n, category, p, type, test, confint, conflevel, hypothesis;

function preprocess () {
    
}

function calculate () {
    if (getBoolean("manual.checked")){
        freq = getString("freq");
        n = getString("n");
        echo ('freq <- ' + freq + '\n');
        echo ('n <- ' + n + '\n');
        category='';
    }
    else {
        // Filter
        echo(getString("filter_embed.code.calculate"));
        // Load variables
        x = getString("variable");
        category = getString("category");
        echo ('freq <- length(' + x + '[' + x + '==' + category + '])\n');
        echo ('n  <- length(' + x + ')\n');
    }	
    p = getString("proportion");
    confint = getBoolean("confint_frame.checked");
    conflevel = getString("conflevel");
    hypothesis = getString("hypothesis");
    var options = ', alternative="' + hypothesis + '", p=' + p ;
    if (confint) {
        options += ", conf.level=" + conflevel;
    }
    type = getString("type");
    if (type=="binomial"){
        echo('result <- binom.test (freq, n'+ options + ')\n');
        test = "Exact binomial"
    }
    else if (type=="normal_correction"){
        echo('result <- prop.test (freq, n'+ options + ')\n');
        test = "Normal approximation with continuity correction"
    }
    else {
        echo('result <- prop.test (freq, n'+ options + ', correct=FALSE)\n');
        test = "Normal approximation without continuity correction"
    }
}

function printout () {
    echo ('rk.header (paste("Test for estimating", ');
    if (getBoolean("manual.checked")){
        echo ('"one proportion"), parameters=list ("Sample frequency" = freq, "Sample size" = n');
        echo(', "Null hyphotesis" = paste("Proportion =", ' + p + ')');
    if (hypothesis=="two.sided"){
        echo(', "Alternative hypothesis" = paste("Proportion &ne;", ' + p + ')');
    }
    else if (hypothesis=="greater") {
        echo(', "Alternative hypothesis" = paste("Proportion &gt;", ' + p + ')');
    }
    else {
        echo(', "Alternative hypothesis" = paste("Proportion &lt;", ' + p + ')');
    }
    }
    else{
        echo ('"the proportion of ' + getString("variable.shortname") + ' =", ' + category + '), parameters=list ("Variable" = rk.get.description(' + x + '), "Proportion of" = ' + category + getString("filter_embed.code.printout") + ', "Sample frequency" = freq, "Sample size" = n');		
    echo(', "Null hyphotesis" = paste("Proportion of", ' + category + ', "=", ' + p + ')');
    if (hypothesis=="two.sided"){
        echo(', "Alternative hypothesis" = paste("Proportion of",' + category + ', "&ne;", ' + p + ')');
    }
    else if (hypothesis=="greater") {
        echo(', "Alternative hypothesis" = paste("Proportion of",' + category + ', "&gt;", ' + p + ')');
    }
    else {
        echo(', "Alternative hypothesis" = paste("Proportion of",' + category + ', "&lt;", ' + p + ')');
    }
    }
    echo(', "Type of test" = "' + test + '"');
    if (confint) {
        echo (', "Confidence level of the confidence interval" = "' + conflevel + '"');
    }
    echo('))\n');
    echo ('rk.results (list(');
    echo ('"Estimated proportion " = freq/n, ');
    if (type!="binomial"){
        echo ('"Degrees of freedom" = result$parameter, ');
        echo ('"Chi statistic" = result$statistic, ');
    }
    echo ('"p-value" = result$p.value');
    if (confint) {
        echo (', "% Confidence level" = (100 * attr(result$conf.int, "conf.level"))');
        echo (', "Confident interval<br/>for the proportion" = result$conf.int');
    }
    echo ('))\n');
}


