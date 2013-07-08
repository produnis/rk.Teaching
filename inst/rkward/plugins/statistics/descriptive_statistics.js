// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var data, variables;

function preprocess(){
	// add requirements etc. here
	echo('require(rk.Teaching)\n');
}

function getName(x){
	return x.split('"')[1];
}

function calculate () {
	var narm = "na.rm=FALSE";
	if (getString ("narm")) narm = "na.rm=TRUE";
	var v = trim(getString("variables"));
	data = v.split('[[')[0];
	variables = getList("variables.shortname").join(', ');
	var statistics = getString("min") + getString("max") + getString("mean") + getString("median") + getString("mode") + getString("variance") + getString("unvariance") + getString("stdev") + getString("sd") + getString("cv") + getString("range") + getString("iqrange") + getString("skewness") + getString("kurtosis");
	if (getBoolean("quartile") || getString("quantiles")!=''){
		statistics += "'quantiles',";
	}
	statistics = 'c(' + statistics.slice(0, -1) + ')';
	var quantiles = 'c(';
	if (getBoolean("quartile")){
		quantiles += '0.25, 0.5, 0.75 ';
		if (getString("quantiles")!= '')
			quantiles += ', ';
	}
	quantiles += getString("quantiles") + ')';
	var groups = '';
	if (getBoolean("grouped")){
		groups = ', groups=' + getString("groups");
	}
	echo ('results <- descriptiveStats(' + data + '[,c(' + variables + ')]' + groups + ', statistics=' + statistics + ', quantiles= ' + quantiles + ')\n');
	
}

function printout () {
	echo ('rk.header ("Estad&iacute;stica Descriptiva"');
	//echo (', parameters=list("Variables" =' + "'" + vars.join(', ') + "'");
	echo (', parameters=list("Variables" = rk.get.description(' + getList("variables") + ')');
	if (getBoolean("grouped")){
		echo (', "Seg&uacute;n" = rk.get.description(' + getString("groups") +  ')');
	}
	echo (', "Eliminar valores desconocidos" = ');
	if (getString ("narm")) echo ('"Si"');
	else echo ('"No"');
	echo ('))\n');
	//echo ('rk.results(list("Variables" = rownames(results$table)))\n');
	//echo ('HTML(results$table,file=rk.get.output.html.file(),digits=6)\n');
	echo ('rk.print(results$table,digits=6)\n');
	//echo('colnames(results$table) <- c("M&iacute;nimo", "M&aacute;ximo", "Media", "Mediana", "Moda", "Varianza", "Cuasivarianza", "Desviaci&oacute;n t&iacute;pica", "Cuasidesviaci&oacute;n t&iacute;pica", "Coeficiente de variaci&oacute;n", "Rango", "Rango intercuart&iacute;lico", "Coeficiente de asimietr&iacute;a", "Coeficiente de curtosis")[c("min", "max", "mean", "median", "Mode", "variance", "unvariance", "stdev", "sd", "cv", "ran", "iqrange", "skewness", "kurtosis") %in% colnames(results$table)]\n');
	//echo('rk.results(list("Estad&iacute;sticos" = colnames(results$table), "Valor" = results$table))\n');
}

