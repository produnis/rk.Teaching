// globals
var design, dep, data, within, between, caseid, sumsq, dep_name, within_name, between_name, caseid_name, sumsq_type;

function preprocess () {
    echo('require(ez)\n');
    echo('require(nlme)\n');
    echo('require(multcomp)\n');
}

function calculate () {
    // Filter
    echo(getString("filter_embed.code.calculate"));
    // Load variables
    data = getString("dataframe");
    design = getString("design");
    dep = getString("dep");
    dep_name = getString("dep.shortname");
    caseid = getString("caseid");
    caseid_name = getValue("caseid.shortname");
    within = getList("within");
    within_name = getList("within.shortname").join(", ");
    n_within = within.lenght;
    between = getList("between");
    between_name = getList("between.shortname").join(", ");
    sumsq_type = getString("sumsqtype");
    var heterocedasticity = getString("heterocedasticity");
    sumsq = getBoolean("sumsq");
    //var vrslObsrvdvrShortname = getValue("vrsl_Obsrvdvr.shortname").split("\n").join(", ");
    if(sumsq_type == 3) {
        echo('# Set type III of sum of squares\n');
        echo('options(contrasts=c("contr.sum","contr.poly"))\n');
    }
    if(caseid == '' & design == 'between') {
        echo('# ezANOVA requiere una variable con el identificador de usuario\n');
        echo(data + ' <- cbind(' + data + ', subjectid=factor(1:nrow(' + data + ')))\n');
    }
    echo('anova.results <- ezANOVA(data=' + data + '[!is.na(' + data + '$' + dep_name + '),], dv=.(' + dep_name +')');
    if(caseid) {
        echo(', wid=' + caseid_name);
    } else if(design == 'between') {
        echo(', wid=.(subjectid)');
    }
    if(within != '' & design !='between'){
        echo(', within=.(' + within_name + ')');
    }
    if(between != '' & design !='within'){
        echo(', between=.(' + between_name + ')');
    }
    if(sumsq_type != 2) {
        echo(', type=' + sumsq_type);
    }
    if(heterocedasticity != "false") {
        echo(', white.adjust="' + heterocedasticity + '"');
    }
    if(sumsq) {
        echo(', detailed=TRUE');
    } 
    echo(', return_aov=TRUE)\n');
    if (getString("pairwise")){
        if (design=='between'){
            echo('pairs <- TukeyHSD(anova.results[["aov"]])\n');
        }
        if (design=='within'){
            echo('pairs <- glht(lme(' + dep_name + '~' + within_name + ', data = ' + data + '[!is.na('  + data + '$' + dep_name + '),], random = ~1|' + caseid_name + '), linfct = mcp(' + within_name + '= "Tukey"))\n');
        }
        if (design=='mixed'){
            echo('pairs <- glht(lme(' + dep_name + '~' + between_name + '*' + within_name + ', data = ' + data + '[!is.na('  + data + '$' + dep_name + '),], random = ~1|' + caseid_name + '), linfct = mcp(' + between_name + '= "Tukey", ' + within_name + '= "Tukey"))\n');
        }
    }
}

function printout () {
    //Título y parámetros
    echo('rk.header("ANOVA of ' + dep_name + '", ');
    echo('parameters=list ("Dependent variable"= rk.get.description(' + dep + ')');
    if(between != "" & design !="within"){
        echo(', "Between subjects factors" = rk.get.description(' + between + ', paste.sep=", ")');
    }
    if(within != "" & design !="between"){
        echo(', "Within subjects factors" = rk.get.description(' + within + ', paste.sep=", ")');
    }
    echo(getString("filter_embed.code.printout")); 
    echo(', "Sums of squares" = "Type ' + sumsq_type + '"))\n');
    // Resultado ANOVA
    echo('rk.results(list(');
    echo('"Source of variation" = anova.results[["ANOVA"]][["Effect"]]');
    echo(', "Numerator<br/> degrees of freedom" = anova.results[["ANOVA"]][["DFn"]]');
    echo(', "Denominator<br/> degrees of freedom" = anova.results[["ANOVA"]][["DFd"]]');
    if(sumsq){
        echo(', "Sum of squares of num" = anova.results[["ANOVA"]][["SSn"]]');
        echo(', "Sum of squares of den" = anova.results[["ANOVA"]][["SSd"]]');
    }
    echo(', "F statistic" = anova.results[["ANOVA"]][["F"]]');
    echo(', "p-value" = anova.results[["ANOVA"]][["p"]]');
    echo('))\n');
    // Resultado test de esfericidad e Mauchly (para medidas repetidas)
    echo("if(\"Mauchly\'s Test for Sphericity\" %in% names(anova.results)){\n");
    echo('\trk.header("Mauchly\'s test for sphericity", level=3)\n');
    echo('\trk.results(list(');
    echo("\"Source of variation\" = anova.results[[\"Mauchly's Test for Sphericity\"]][[\"Effect\"]]");
    echo(", \"W statistic\" = anova.results[[\"Mauchly's Test for Sphericity\"]][[\"W\"]]");
    echo(", \"p-value\" = anova.results[[\"Mauchly's Test for Sphericity\"]][[\"p\"]]");
    echo('))\n}\n');	
    // Resultado correcciones de esfericidad
    echo('if("Sphericity Corrections" %in% names(anova.results)){\n');
    echo('\trk.header("Sphericity correction", level=3)\n');
    echo('\trk.results(list(');
    echo('"Source of variation" = anova.results[["Sphericity Corrections"]][["Effect"]]');
    echo(', "Epsilon Greenhouse-Geisser" = anova.results[["Sphericity Corrections"]][["GGe"]]');
    echo(', "G-G corrected p-value" = anova.results[["Sphericity Corrections"]][["p[GG]"]]');
    echo(', "Epsilon Huynh-Feldt" = anova.results[["Sphericity Corrections"]][["HFe"]]');
    echo(', "H-F corrected p-value" = anova.results[["Sphericity Corrections"]][["p[HF]"]]');
    echo('))\n}\n');	
    // Resultado test de homogeneidad de varianzas de Levene
    echo("if(\"Levene's Test for Homogeneity of Variance\" %in% names(anova.results)){\n");
    echo('\trk.header("Levene\'s test for comparing variances", level=3)\n');
    echo('\trk.results(list(');
    echo("\"Numerator<br/> degrees of freedom\" = anova.results[[\"Levene's Test for Homogeneity of Variance\"]][[\"DFn\"]]");
    echo(", \"Denominator<br/>degrees of freedom\" = anova.results[[\"Levene's Test for Homogeneity of Variance\"]][[\"DFd\"]]");
    echo(", \"Sum squares num\" = anova.results[[\"Levene's Test for Homogeneity of Variance\"]][[\"SSn\"]]");
    echo(", \"Sum squares den\" = anova.results[[\"Levene's Test for Homogeneity of Variance\"]][[\"SSd\"]]");
    echo(", \"F statistics\" = anova.results[[\"Levene's Test for Homogeneity of Variance\"]][[\"SSn\"]]");
    echo(", \"p-value\" = anova.results[[\"Levene's Test for Homogeneity of Variance\"]][[\"p\"]]");
    echo('))\n}\n');
    // Resultado comparación por pares
    if (getBoolean("pairwise")){
        echo('rk.header("Pairwise comparison of means",level=3)\n');
        if (design=='between'){
            echo('for(i in 1:length(pairs)){\n');
            echo('\t rk.header(paste("Confidence intervals for the difference of means according to", names(pairs)[i]),level=4)\n');
            echo('rk.results(list(');
            echo('"Pairs" = rownames(pairs[[i]])');
            echo(', "Difference of means" = pairs[[i]][,1]');
            echo(', "Lower limit" = pairs[[i]][,2]');
            echo(', "Upper limit" = pairs[[i]][,3]');
            echo(', "p-value" = pairs[[i]][,4]');
            echo('))\n');
            echo('}\n');
        }
        else {
            echo('rk.header("Tukey\'s test for pairwise comparison of means",level=4)\n');
            echo('rk.results(list(');
            echo('"Pairs" = names(summary(pairs)$test$coefficients)');
            echo(', "Estimate" = summary(pairs)$test$coefficients');
            echo(', "Standard error" = summary(pairs)$test$sigma');
            echo(', "t statistic" = summary(pairs)$test$tstat');
            echo(', "p-value" = summary(pairs)$test$pvalues');
            echo('))\n');
            echo('rk.header("Confidence intervals for the difference of means",level=4)\n');
            echo('rk.results(list(');
            echo('"Pairs" = rownames(confint(pairs)$confint)');
            echo(', "Estimate" = confint(pairs)$confint[,1]');
            echo(', "Lower limit" = confint(pairs)$confint[,2]');
            echo(', "" = confint(pairs)$confint[,3]');
            echo('))\n');
        }
    }
    if (getBoolean("pairwise_plot")){
        echo ('rk.graph.on()\n');
        echo('par(las=1,mar=c(4,8,6,0))\n');
        echo('plot(pairs)\n');
        //echo('title(main="Intervalos de confianza del 95%\n para la diferencia de medias")\n');
        //echo('plot(pairs,main="Intervalos de confianza del 95%\n para la diferencia de medias", xlab="Diferencia de ' + dep_name + '")\n');
        echo ('rk.graph.off()\n');
    }
}


