// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var objects,
	numObjects,
	listObjects,
	numDraws,
	replace,
	ordered,
	dataframe,
	prob;

function preprocess() {
	echo('library(prob)\n');
}

function setGlobals() {
	objects = getString("objects");
	numDraws = getString("numDraws");
	numObjects = getString("numObjects");
	listObjects = getList("listObjects");
	replace = getString("replace");
	ordered = getString("ordered");
	dataframe = getString("save");
	prob = getBoolean("prob");
}

function calculate() {
	setGlobals();
	if (objects === "num") {
		echo('results <- urnsamples(1:' + numObjects + ', size=' + numDraws + ', replace=' + replace + ', ordered=' + ordered + ')\n');
	} else {
		echo('results <- urnsamples(c("' + listObjects.replace(/,/g, "\",\"") + '"), size=' + numDraws + ', replace=' + replace + ', ordered=' + ordered + ')\n');
	}
	if (prob) {
		echo('results <- probspace(results)\n');
	}
	echo('assign("' + dataframe + '", results, .GlobalEnv)\n');
}

function printout() {
	// Header
	header = new Header(i18n("Probability space of drawing objects from an urn"));
	if (objects === "num") {
		header.add(i18n("Number of objects in the urn"), numObjects);
	} else {
		header.add(i18n("Objects in the urn"), listObjects);
	}
	header.add(i18n("Number of draws"), numDraws);
	if (getBoolean("replace.state")) {
		header.add(i18n("With replacement"), i18n("Yes"));
	} else {
		header.add(i18n("With replacement"), i18n("No"));
	}
	if (getBoolean("ordered.state")) {
		header.add(i18n("With order"), i18n("Yes"));
	} else {
		header.add(i18n("With order"), i18n("No"));
	}
	header.add(i18n("Probability space"), dataframe);
	header.print();
}