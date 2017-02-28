// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var x, y, xname, yname, data, groups, groupsname, equation, modelname, model, typemodel, filter;

function preprocess(){
	echo('require(plyr)\n');
}

function calculate () {
    // Filter
	echo(getString("filter_embed.code.calculate"));
	// Load variables
	y = getString("y");
	yname = getString("y.shortname");
	x = getString("x"); 
	xname = getString("x.shortname"); 
	data = y.split('[[')[0];
	var formula = '';
	model = getString("model");
	if (model == "linear"){
		typemodel = "Linear"
		formula += yname + ' ~ ' + xname;
	}
	else if (model == "cuadratic"){
		typemodel = "Cuadratic"
		formula += yname + ' ~ ' + xname + ' + I(' + xname + '^2)';
	}
	else if (model == "cubic"){
		typemodel = "Cubic"
		formula += yname + ' ~ ' + xname +	' + I(' + xname + '^2) + I(' + xname + '^3)';
	}
	else if (model == "potential"){
		typemodel = "Potential"
		formula += 'log(' + yname + ') ~ log(' + xname + ')';
	}
	else if (model == "exponential"){
		typemodel = "Exponential"
		formula += 'log(' + yname + ') ~ ' + xname;
	}
	else if (model == "logarithmic"){
		typemodel = "Logarithmic"
		formula += yname + ' ~ log(' + xname + ')';
	}
	else if (model == "inverse"){
		typemodel = "Inverse"
		formula += yname + ' ~ I(1/' + xname + ')';
	}
	else if (model == "sigmoid"){
		typemodel = "Sigmoidal"
		formula += 'log(' + yname + ') ~ I(1/' + xname + ')';
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
	echo ('rk.header ("' + typemodel + ' regression of ' + yname + ' on ' + getList("x.shortname").join(', ') + '", parameters=list("Dependent variable" = rk.get.description(' + y + "), 'Independent variable'= rk.get.description(" + x + ')' + getString("filter_embed.code.printout"));
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
		if (model == "linear"){
			echo('rk.print (c("' + yname + '", " = ", round(result[[i]][[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xname + '"))\n');
		}
		if (model == "cuadratic"){
			echo('rk.print (c("' + yname + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xname + ' + ", round(result[[i]]$coeff[3,1],4), "' + xname + '^2"))\n');
		}
		if (model == "cubic"){
			echo('rk.print (c("' + yname + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xname + ' + ", round(result[[i]]$coeff[3,1],4), "' + xname + '^2 + ", round(result[[i]]$coeff[4,1],4), "' + xname + '^3"))\n');
		}
		if (model == "potential"){
			echo('rk.print (c("log(' + yname + ')", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "log(' + xname + ')"))\n');
		}
		if (model == "exponential"){
			echo('rk.print (c("log(' + yname + ')", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xname + '"))\n');
		}
		if (model == "logarithmic"){
			echo('rk.print (c("' + yname + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "log(' + xname + ')"))\n');
		}
		if (model == "inverse"){
			echo('rk.print (c("' + yname + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "/ ' + xname + '"))\n');
		}
		if (model == "sigmoid"){
			echo('rk.print (c("log(' + yname + ')", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "/ ' + xname + '"))\n');
		}
		// Estimaciones del modelo 
		echo('\t rk.header ("Model coefficients",level=4)\n');
		echo('rk.results (list(');
		echo('"Coefficient" = rownames(result[[i]]$coeff)');
		echo(', "Estimation" = result[[i]]$coeff[,1]');
		echo(', "Std.Error" = result[[i]]$coeff[,2]');
		echo(', "t-statistics" = result[[i]]$coeff[,3]');
		echo(', "p-value" = result[[i]]$coeff[,4]))\n');
		// Ajuste del modelo
		echo('\t rk.header ("Model goodness of fit", level=4)\n');
		echo('rk.results (list(');
		echo('"R<sup>2</sup>" = result[[i]]$r.squared,');
		echo('"R<sup>2</sup> ajusted" = result[[i]]$adj.r.squared,');
		echo('"F-statistics" = result[[i]]$fstatistic[1],');
		echo('"p-value" = pf(result[[i]]$fstatistic[1],result[[i]]$fstatistic[2],result[[i]]$fstatistic[3],lower.tail=FALSE)))\n');
		echo('}\n');
	}
	else{
		// Ecuación del modelo
		echo('rk.header ("Model equation",level=4)\n'); 
		if (model == "linear"){
			echo('rk.print (c("' + yname + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xname + '"))\n');
		}
		if (model == "cuadratic"){
			echo('rk.print (c("' + yname + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xname + ' + ", round(result$coeff[3,1],4), "' + xname + '^2"))\n');
		}
		if (model == "cubic"){
			echo('rk.print (c("' + yname + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xname + ' + ", round(result$coeff[3,1],4), "' + xname + '^2 + ", round(result$coeff[4,1],4), "' + xname + '^3"))\n');
		}
		if (model == "potential"){
			echo('rk.print (c("log(' + yname + ')", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "log(' + xname + ')"))\n');
		}
		if (model == "exponential"){
			echo('rk.print (c("log(' + yname + ')", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xname + '"))\n');
		}
		if (model == "logarithmic"){
			echo('rk.print (c("' + yname + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "log(' + xname + ')"))\n');
		}
		if (model == "inverse"){
			echo('rk.print (c("' + yname + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "/ ' + xname + '"))\n');
		}
		if (model == "sigmoid"){
			echo('rk.print (c("log(' + yname + ')", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "/ ' + xname + '"))\n');
		}
		// Estimaciones del modelo 
		echo('rk.header ("Model coefficients",level=4)\n');
		echo('rk.results (list(');
		echo('"Coefficient" = rownames(result$coeff)');
		echo(', "Estimation" = result$coeff[,1]');
		echo(', "Std.Error" = result$coeff[,2]');
		echo(', "t-statistics" = result$coeff[,3]');
		echo(', "p-value" = result$coeff[,4]))\n');
		// Ajuste del modelo
		echo('rk.header ("Model goodness of fit", level=4)\n');
		echo('rk.results (list(');
		echo('"R<sup>2</sup>" = result$r.squared,');
		echo('"R<sup>2</sup> ajusted" = result$adj.r.squared,');
		echo('"F-statistics" = result$fstatistic[1],');
		echo('"p-value" = pf(result$fstatistic[1],result$fstatistic[2],result$fstatistic[3],lower.tail=FALSE)))\n');
	}
}

