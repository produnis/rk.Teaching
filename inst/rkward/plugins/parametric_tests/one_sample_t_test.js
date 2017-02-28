// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var variable, variablename, groups, groupsname, mean, confint, conflevel, hypothesis;

function preprocess () {
}

function calculate () {
    // Filter
    echo(getString("filter_embed.code.calculate"));
    // Load variables
    variable = getString("variable");
    variablename = getString("variable.shortname");
    data = variable.split('[[')[0];
    mean = getString("mean");
    confint = getBoolean ("confint_frame.checked");
    conflevel = getString ("conflevel");
    hypothesis = getString ("hypothesis");
    var options = ', alternative="' + hypothesis + '", mu=' + mean ;
    if (confint) {
        options += ", conf.level=" + conflevel;
    }
    if (getBoolean("grouped")) {
        groups = getList("groups");
        groupsname = getList("groups.shortname");
        echo(data + ' <- transform(' + data + ', .groups=interaction(' + data + '[,c(' + groupsname.map(quote) + ')]))\n');
        echo('result <- dlply(' + data + ', ".groups", function(df) t.test(df[["' + variablename + '"]]' + options + '))\n');
    } else {
        echo('result <- t.test (' + variable + options + ')\n');
    }
}

function printout () {
    echo ('rk.header ("t-test for the mean of ' + getString("variable.shortname") + '", ');
    echo ('parameters=list ("Variable" = rk.get.description(' + variable + ')' + getString("filter_embed.code.printout") + ', "Null hypothesis" = paste("mean of", rk.get.short.name(' + variable + '), "= ' + mean + '")');
    if (hypothesis=="two.sided"){
        echo(', "Alternative hypothesis" = paste("mean &ne; ' + mean + '")');
    }
    else if (hypothesis=="greater") {
        echo(', "Alternative hypothesis" = paste("mean &gt; ' + mean + '")');
    }
    else {
        echo(', "Alternative hypothesis" = paste("mean &lt; ' + mean + '")');
    }
    if (confint) {
        echo (', "Confidence level of the confidence interval" = "' + conflevel + '"');
    }
    echo('))\n');
    if (getBoolean("grouped")){
        echo('for (i in 1:length(result)){\n');
        echo('\t rk.header(paste("Group ' + groupsname.join('.') + ' = ", names(result)[i]),level=3)\n');
        echo ('rk.results (list(');
        echo ('"Variable" = rk.get.short.name(' + variable + '), ');
        echo ('"Estimated mean" = result[[i]]$estimate, ');
        echo ('"Degrees of freedom" = result[[i]]$parameter, ');
        echo ('"t statistic" = result[[i]]$statistic, ');
        echo ('"p-value" = result[[i]]$p.value');
        if (confint) {
            echo (', "% Confidence level" = (100 * attr(result[[i]]$conf.int, "conf.level"))');
            echo (', "Confidence interval<br/>for the mean" = result[[i]]$conf.int');
        }
        echo ('))}\n');
    } else {
        echo ('rk.results (list(');
        echo ('"Variable" = rk.get.short.name(' + variable + '), ');
        echo ('"Estimated mean" = result$estimate, ');
        echo ('"Degrees of freedom" = result$parameter, ');
        echo ('"t statistic" = result$statistic, ');
        echo ('"p-value" = result$p.value');
        if (confint) {
            echo (', "% Confidence level" = (100 * attr(result$conf.int, "conf.level"))');
            echo (', "Confidence interval<br/>for the mean" = result$conf.int');
        }
        echo ('))\n');
    }
    
}
