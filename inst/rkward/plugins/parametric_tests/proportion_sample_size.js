// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var sd, conflevel, error, errortype;

function preprocess () {
    echo('require(rk.Teaching)\n');
}

function calculate () {
    p = getString("p");
    conflevel = getString("conflevel");
    error = getString("error");
    echo('result <- sampleSizeOneProportion(p=' + p + ', sig.level= 1-' + conflevel + ', error=' + error + ')\n');
}

function printout () {
    echo ('rk.header ("Sample size computation to estimate a proportion in a population", ');
    echo ('parameters=list ("Estimated proportion in the population" = "' + p + '", "Confidence level" ="' + conflevel + '", "Error" = "&#177;' + error + '"))\n');
    echo ('rk.results (list("Sample size required"= result$n))\n');
}


