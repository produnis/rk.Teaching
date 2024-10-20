// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var model, data;

function setGlobalVars() {
	model = getString("model");
	values = getString("values");
	useDataframe = getBoolean("useDataframe");
	dataframe = getString("dataframe");
	getIntervals = getBoolean("intervals");
}

function preprocess(){
	setGlobalVars();
	echo('library(tidyverse)\n');
	echo('library(knitr)\n');
	echo('library(kableExtra)\n');
}

function calculate () {
	if (useDataframe){
		data = dataframe;
	}
	else{
		echo('df <- setNames(data.frame(c(' + values + ')), attr(terms(' + model +'), "term.labels"))\n')
		data = 'df';
	}
	echo('result <- cbind(df, predict(' + model + ', newdata = ' + data + ', interval = "prediction")) |>\n');	 
	echo('\trename(!!names(' + model + '$model)[1] := fit, conf.int.lwr = lwr, conf.int.upr = upr)\n');
}

function printout () {
	echo('rk.header(' + i18n("Regression predictions of %1", model) + ', parameters=list(' + i18n("Dependent variable") + ' = colnames(' + model + '$model)[1], ' + i18n("Independent variable") + ' = paste(colnames(' + model + '$model)[-1], collapse=", "), ' +  i18n("Model equation") + ' = paste(colnames(' + model + '$model)[1], " = ", paste(round(' + model + '$coefficients[1],4), paste(round(' + model + '$coefficients[-1],4), names(' + model + '$coefficients)[-1], collapse=" + "), sep=" + "))))\n');
	if (getIntervals){
		echo('rk.print.literal(result |>\n');
			
	} else {
		echo('rk.print.literal(result[1:2] |>\n');
	}
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
}
