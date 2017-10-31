// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var file,
	source;

function setGlobalVars() {
	file = getList("file");
	source = getBoolean("source");
}

function preprocess() {
	setGlobalVars();
}

function calculate() {
	echo('install.packages("' + file + '", repos=NULL');
	if (source){
		echo(', type="source"');
	}
	echo(')\n');
}