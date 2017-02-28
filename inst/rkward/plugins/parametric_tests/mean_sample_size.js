// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var sd, conflevel, error, errortype;

function preprocess () {
    echo('require(rk.Teaching)\n');
}

function calculate () {
    sd = getString("sd");
    conflevel = getString("conflevel");
    error = getString("error");
    errortype = getString("error_type");	
    echo('result <- sampleSizeOneMean(mean=, sd=' + sd + ', sig.level= 1-' + conflevel + ', error=' + error + ',error.type="' + errortype + '")\n');
}

function printout () {
    echo ('rk.header ("Sample size for estimating one mean", ');
    echo ('parameters=list ("Standard deviation of the population" = "' + sd + '", "Confidence level" ="' + conflevel + '", "Error" = "&#177;' + error );
    if (errortype=="relative") echo (' %');
    echo('"))\n');
    echo ('rk.results (list("Sample size required"= result$n))\n');
}


