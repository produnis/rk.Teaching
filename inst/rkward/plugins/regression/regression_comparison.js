// author: Alfredo Sánchez Alberca (asalber@ceu.es)

// globals
var x, y, xname, yname, filter, groupsname;

function preprocess(){
	echo('require(rk.Teaching)\n');
	echo('require(plyr)\n');
}

function calculate() {
    // Filter
	echo(getString("filter_embed.code.calculate"));
	// Load variables
	y = getString("y");
	x = getString("x");
	data = getValue("y").split('[[')[0];
	xname = getString("x.shortname");
	yname = getString("y.shortname");
	var models = getString("linear") + getString("cuadratic") + getString("cubic") + getString("potential") + getString("exponential") + getString("logarithmic") + getString("inverse") + getString("sigmoid");
	models = models.slice(0, -1);
	// Grouped mode
	if (getBoolean("grouped")) {
		groups = getList("groups");
		groupsname = getList("groups.shortname");
		echo(data + ' <- transform(' + data + ', .groups=interaction(' + data + '[,c(' + groupsname.map(quote) + ')]))\n');
		echo('result <- dlply(' + data + ', ".groups", function(df) regcomp(df[["' + yname + '"]], df[["' + xname + '"]]' + ', models=c(' + models + ')))\n');
	}
	else{
		echo ('result <- regcomp(' + y + ', ' + x + ', models=c(' + models + '))\n');
	}
}

function printout () {
	echo ('rk.header ("Comparison of regression models of ' + yname + ' on ' + xname + '", parameters=list("Dependent variable" = rk.get.description(' + y + '), "Independent variable" = rk.get.description(' + x + ')' + getString("filter_embed.code.printout") + "))\n");
	// Grouped mode
	if (getBoolean("grouped")){
		echo('for (i in 1:length(result)){\n');
		echo('\t rk.header(paste("Group ' + groupsname.join('.') + ' = ", names(result)[i]),level=3)\n');
		echo('\t rk.results(result[[i]])\n');
		echo('}\n');
	}
	else{
		echo('rk.results(result)\n');
	}
}

