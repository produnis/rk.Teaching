// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var x, y, xname, yname, data, groups, groupsname, intercept, modelname;

function preprocess(){
	echo('require(plyr)\n');
}

function calculate () {
    // Filter
	echo(getString("filter_embed.code.calculate"));
	// Load variables
	y = getString("y");
	yname = getString("y.shortname");
	data = y.split('[[')[0];
	x = getList("x");
	xname = getList("x.shortname");
	// Set intercept
	intercept = '';
	if (!getBoolean("intercept")){
		intercept = "0";
	}
	// Set regression formula
	var formula = yname + '~' + intercept;
	for (i=0; i<x.length; i++){
		formula += '+' + xname[i];
	}
	// Grouped mode
	if (getBoolean("grouped")) {
		groups = getList("groups");
		groupsname = getList("groups.shortname");
		echo(data + ' <- transform(' + data + ', .groups=interaction(' + data + '[,c(' + groupsname.map(quote) + ')]))\n');
		echo('result <- dlply(' + data + ', ".groups", function(df) lm(' +  formula + ', data=df))\n');
		// Save model
		if (getBoolean("save.active")){
			modelname = getString("save");
			echo('for (i in 1:length(result)){\n');
			echo('\t assign(paste("' + modelname + '", names(result)[i], sep="."), result[[i]], .GlobalEnv)\n');
			echo('}\n');
		}
		echo('result <- lapply(result,summary)\n');
	}
	else{
		echo ('result <- lm (' + formula + ', data=' + data + ')\n');
		// Save model
		if (getBoolean("save.active")){
			modelname = getString("save");
			echo ('assign("' + modelname + '", result, .GlobalEnv)\n');
		}
		echo('result <- summary(result)\n');
	}
}

function printout () {
	echo('rk.header ("Linear regression of ' + yname + ' on ' + xname + '", parameters=list("Dependent variable" = rk.get.description(' + y + '), "Independent variable(s)" = rk.get.description(' + x + ', paste.sep=", ")' + getString("filter_embed.code.printout"));
	if (getBoolean("grouped")) {
		echo(', "Grouping variable(s)" = rk.get.description(' + groups + ', paste.sep=", ")');
	}
	if (getBoolean("save.active")){
		echo(', "Model name" = "' + modelname + '"');
	}
	echo("))\n");
	// Grouped mode
	if (getBoolean("grouped")){
		echo('for (i in 1:length(result)){\n');
		echo('\t rk.header(paste("Group ' + groupsname.join('.') + ' = ", names(result)[i]),level=3)\n');
		// Ecuación del modelo
		echo('\t rk.header ("Model equation",level=4)\n'); 
		if (getBoolean("intercept")){
			echo('\t rk.print (c("' + yname + '", " = ", paste(round(result[[i]]$coeff[1,1],4), paste(round(result[[i]]$coeff[-1,1],4), rownames(result[[i]]$coeff)[-1], collapse=" + "), sep=" + ")))\n');
		}
		else{
			echo('\t rk.print (c("' + yname + '", " = ", paste(round(result[[i]]$coeff[,1],4), rownames(result[[i]]$coeff), collapse=" + ")))\n');
		}
		// Estimaciones
		echo('\t rk.header ("Model coefficients",level=4)\n');
		echo('\t rk.results (list(');
	    if (getBoolean("intercept")){
	    	echo('"Coefficient" = c("Intercept", rownames(result[[i]]$coeff)[-1])');
	    }
	    else{
	    	echo('"Coefficient" = rownames(result[[i]]$coeff)');
	    }
			echo(', "Estimation" = result[[i]]$coeff[,1]');
			echo(', "Std.Error" = result[[i]]$coeff[,2]');
			echo(', "t-statistic" = result[[i]]$coeff[,3]');
			echo(', "p-value" = result[[i]]$coeff[,4]))\n');
		// Ajuste del modelo
		echo('\t rk.header ("Model goodness of fit", level=4)\n');
		echo('\t rk.results (list(');
		echo('"R<sup>2</sup>" = result[[i]]$r.squared,');
		echo('"R<sup>2</sup> ajusted" = result[[i]]$adj.r.squared,');
		echo('"F-statistic" = result[[i]]$fstatistic[1],');
		echo('"p-value" = pf(result[[i]]$fstatistic[1],result[[i]]$fstatistic[2],result[[i]]$fstatistic[3],lower.tail=FALSE)))\n');
		echo('}\n');
	}
	// Non grouped mode
	else{
		// Ecuación del modelo
		echo('rk.header ("Model equation",level=4)\n'); 
		if (getBoolean("intercept")){
			echo('rk.print (c("' + yname + '", " = ", paste(round(result$coeff[1,1],4), paste(round(result$coeff[-1,1],4), rownames(result$coeff)[-1], collapse=" + "), sep=" + ")))\n');
		}
		else{
			echo('rk.print (c("' + yname + '", " = ", paste(round(result$coeff[,1],4), rownames(result$coeff), collapse=" + ")))\n');
		}
		// Estimaciones
		echo('rk.header ("Model coefficients",level=4)\n');
		echo('rk.results (list(');
	    if (getBoolean("intercept")){
	    	echo('"Coefficient" = c("Intercept", rownames(result$coeff)[-1])');
	    }
	    else{
	    	echo('"Coefficient" = rownames(result$coeff)');
	    }
			echo(', "Estimation" = result$coeff[,1]');
			echo(', "Std.Error" = result$coeff[,2]');
			echo(', "t-statistic" = result$coeff[,3]');
			echo(', "p-value" = result$coeff[,4]))\n');
		// Ajuste del modelo
		echo('rk.header ("Model goodness of fit", level=4)\n');
		echo('rk.results (list(');
		echo('"R<sup>2</sup>" = result$r.squared,');
		echo('"R<sup>2</sup> ajusted" = result$adj.r.squared,');
		echo('"F-statistic" = result$fstatistic[1],');
		echo('"p-value" = pf(result$fstatistic[1],result$fstatistic[2],result$fstatistic[3],lower.tail=FALSE)))\n');
	}
}

