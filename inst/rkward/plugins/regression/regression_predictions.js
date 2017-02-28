// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var model;

function preprocess(){
	echo('require(rk.Teaching)\n');
}

function calculate () {
	model = getString("model");
	var interval = '';
	if (getBoolean("intervals")){
		interval= 'interval="prediction"';
	}
	var data;
	if (getBoolean("use_dataframe")){
		data = getString("dataframe");
	}
	else{
		data = 'data.frame(x=c(' + getString("values") + '))'
	}
	echo('model <- ' + model + '\n'); 
	echo('results <- predictions(model, ' + data + ', ' + interval + ')\n');
}

function printout () {
	echo('rk.header (paste("Regression predictions of ", colnames(model$model)[1], " on ", colnames(model$model)[-1], collapse=", "), parameters=list("Model name" = "' + model + '", "Dependent variable" = colnames(model$model)[1], "Independent variable" = paste(colnames(model$model)[-1], collapse=", "), "Model equation" = paste(colnames(model$model)[1], " = ", paste(round(model$coefficients[1],4), paste(round(model$coefficients[-1],4), names(model$coefficients)[-1], collapse=" + "), sep=" + "))))\n');
	if (getBoolean("intervals")){
		echo('rk.results(setNames(list(results[,1],results[,2],results[,3],results[,4]),c(colnames(results)[1],paste("predicciones ",colnames(' + model +'$model)[1]), "lower limit 95%","upper limit 95%")))\n');
	}
	else{
		echo('rk.results(setNames(list(results[,1],results[,2]),c(colnames(results)[1],paste(colnames(' + model +'$model)[1]," prediction"))))\n');
	}
}

