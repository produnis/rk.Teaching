// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var variable, factor, category, factorname, defsamples, sample1, sample2, freq1, n1, freq2, n2,  type, test, confint, conflevel, hypothesis;

function preprocess () {
    
}

function calculate () {
    hypothesis = getString ("hypothesis");
    var options = ', alternative="' + hypothesis + '"';
    confint = getBoolean("confint_frame.checked");
    conflevel = getString("conflevel");
    if (confint) {
        options += ', conf.level=' + conflevel;
    }
    type = getString("type");
    if (type=="normal"){
        options += ', correct=FALSE)';
        test = "Normal approximation without continuity correction";
    }
    else {
        test = "Normal approximation with continuity correction";
    }
    if (getBoolean("manual.checked")){
        freq1 = getString("freq1");
        n1 = getString("n1");
        freq2 = getString("freq2");
        n2 = getString("n2");
        echo('result <- prop.test(c(' + freq1 + ',' + freq2 + '),c(' + n1 + ',' + n2 + '), ' + options + ')\n');
        echo('result <- list("Estimated proportion 1" = result$estimate[1], "Estimated proportion 2" = result$estimate[2], "Degrees of<br/>freedom" = result$parameter, "Chi statistic" = result$statistic, "p-value" = result$p.value');
        if (confint) {
            echo(', "% Confidence level" = (100 * attr(result$conf.int, "conf.level")), "Confidence interval for<br/>the difference of proportions" = result$conf.int');
        }
        echo(')\n');
        category = ''; 
    }
    else {
        // Filter
        echo(getString("filter_embed.code.calculate"));
        // Load variables
        variable = getString("variable");
        factor = getString("factor");
        category = getString("category");
        defsamples = getBoolean("samples_frame.checked");
        if (defsamples){
            sample1 = getString("sample1");
            sample2 = getString("sample2");
            data = factor.split('[[')[0];
            factorname = getString("factor.shortname");
            echo (data + ' <- subset(' + data + ', subset=' + factorname + '==' + sample1 + ' | ' + factorname + '==' + sample2 + ')\n');
            echo (factor + ' <- factor(' + factor + ')\n');
        }
        echo('.data <- split(' + variable + ',' + factor +')\n');
        echo('.x1<-.data[[levels(' + factor + ')[1]]]\n');
        echo('.x2<-.data[[levels(' + factor + ')[2]]]\n');
        echo ('.freq1 <- length(.x1[.x1==' + category + '])\n');
        echo ('.n1 <- length(.x1)\n');
        echo ('.freq2 <- length(.x2[.x2==' + category + '])\n');
        echo ('.n2 <- length(.x2)\n');
        echo('result <- prop.test(c(.freq1,.freq2),c(.n1,.n2)' + options + ')\n');
        echo('result <- list(result$estimate[1], result$estimate[2], "Degrees of<br/>freedom" = result$parameter, "Chi statistic" = result$statistic, "p-value" = result$p.value');
        if (confint) {
            echo(', "% Confidence level" = (100 * attr(result$conf.int, "conf.level")), "Confidence interval for<br/>the difference of proportions" = result$conf.int');
        }
        echo(')\n');
        echo('names(result)[1:2] <- c(paste("Estimated proportion<br/>of",' + category + ', "in", levels(' + factor + ')[1]), paste("Estimated proportion<br/>of", ' + category + ', "in", levels(' + factor + ')[2]))\n');
    }	
}

function printout () {
    echo ('rk.header (paste("Test for comparing two proportions"');
    if (getBoolean("manual.checked")){
        echo ('), parameters=list("Frequency of the first sample" = "' + freq1 + '", "Size of the first sample" = "' + n1 + '", "Frequency of the second sample" = "' + freq2 + '", "Size of the second sample" = "' + n2 + '"');
        echo(', "Null hypothesis" = "proportion 1 = proportion 2"');
        if (hypothesis=="two.sided"){
            echo(', "Alternative hypothesis" = "proportion 1 &ne; proportion 2"');
        }
        else if (hypothesis=="greater") {
            echo(', "Alternative hypothesis" = "proportion 1 &gt; proportion 2"');
        }
        else {
            echo(', "Alternative hypothesis" = "proportion 1 &lt; proportion 2"');
        }	
    } else {
        echo(', "of ' + getString("variable.shortname") + ' =", ' + category + ', "according to ' + getString("factor.shortname") + '"), parameters=list ("Comparison of" = rk.get.description(' + variable + '), "According to" = rk.get.description(' + factor + ')' + getString("filter_embed.code.printout") + ', "Proportion of" =' + category);
        echo(', "Null hypothesis" = paste("Proportion of", ' + category + ', "in",  levels(' + factor + ')[1], " = proportion of", ' + category + ', "in", levels(' + factor + ')[2])');
        if (hypothesis=="two.sided"){
            echo(', "Alternative hypothesis" = paste("proportion of", ' + category + ', "in",  levels(' + factor + ')[1], " &ne; proportion of", ' + category + ', "in", levels(' + factor + ')[2])');
        }
        else if (hypothesis=="greater") {
            echo(', "Alternative hypothesis" = paste("proportion of", ' + category + ', "in",  levels(' + factor + ')[1], " &gt; proportion of", ' + category + ', "in", levels(' + factor + ')[2])');
        }
        else {
            echo(', "Alternative hypothesis" = paste("proportion of", ' + category + ', "in",  levels(' + factor + ')[1], " &lt; proportion of", ' + category + ', "in", levels(' + factor + ')[2])');
        }	
    }		
    echo(', "Type of test" = "' + test + '"');
    if (confint) {
        echo (', "Confidence level of the confidence interval" = "' + conflevel + '"');
    }
    echo('))\n');
    echo ('rk.results(result)\n');
}


