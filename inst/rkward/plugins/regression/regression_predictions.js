// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var model;

function setGlobalVars() {
	model = getString("model");
	values = getString("values");
	useDataframe = getBoolean("useDataframe");
	dataframe = getString("dataframe");
	getIntervals = getBoolean("intervals");
}

function preprocess(){
	setGlobalVars();
	echo('library(rkTeaching)\n');
}

function calculate () {
	var interval = '';
	if (getIntervals){
		interval= 'interval="prediction"';
	}
	var data;
	if (useDataframe){
		data = dataframe;
	}
	else{
		data = 'data.frame(x=c(' + values + '))';
	}
	echo('model <- ' + model + '\n');
	echo('results <- predictions(model, ' + data + ', ' + interval + ')\n');
}

function printout () {
	echo('rk.header(' + i18n("Regression predictions of %1", model) + ', parameters=list(' + i18n("Dependent variable") + ' = colnames(model$model)[1], ' + i18n("Independent variable") + ' = paste(colnames(model$model)[-1], collapse=", "), ' +  i18n("Model equation") + ' = paste(colnames(model$model)[1], " = ", paste(round(model$coefficients[1],4), paste(round(model$coefficients[-1],4), names(model$coefficients)[-1], collapse=" + "), sep=" + "))))\n');

	// Intervals
	if (getIntervals){
		echo('rk.results(setNames(list(results[,1],results[,2],results[,3],results[,4]),c(colnames(results)[1], paste(' + i18n("prediction") + ', colnames(' + model +'$model)[1]),' + i18n("lower limit 95%") + ',' +  i18n("upper limit 95%") + ')))\n');
	}
	else{
		echo('rk.results(setNames(list(results[,1],results[,2]),c(colnames(results)[1],paste(' + i18n("prediction") + ', colnames(' + model +'$model)[1]))))\n');
	}
}
