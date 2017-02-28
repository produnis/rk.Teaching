// globals
var variable, factor, center;

function preprocess () {
    echo('require(car)\n');
}

function calculate () {
    // Filter
    echo(getString("filter_embed.code.calculate"));
    // Load variables
    variable = getString("variable");
    factor = getString("factor");
    center = getString("center");
    var options = ', center=' + center;
    echo('result <- leveneTest(' + variable + ', ' + factor + options + ')\n');
}

function printout () {
    echo ('rk.header ("Levene\'s test for comparing variances of ' + getString("variable.shortname") + ' according to ' + getString("factor.shortname") + '", ');
    echo ('parameters=list ("Variance comparison of " = rk.get.description(' + variable + '), "According to" = rk.get.description(' + factor + ')' + getString("filter_embed.code.printout"));
    if (center=="median") {
        echo (', "Variability with respect to" = "Median"');
    }
    else {
        echo (', "Variability with respect to" = "Mean"');
    }
    echo('))\n');
    echo ('rk.results (list(');
    echo ('"Variable"= rk.get.short.name(' + variable + '), ');
    echo ('"Factor levels" = levels(' + factor + '), ');
    echo ('"Degrees of freedom"=result[["Df"]], ');
    echo ('"F statistic"=result[["F value"]][1], ');
    echo ('"p-value"=result[["Pr(>F)"]][1]');
    echo ('))\n');
}


