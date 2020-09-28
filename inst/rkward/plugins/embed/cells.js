// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var classes,
    breaks,
    classesheader;

function makeCodes() {
    var variable = getString("variable");
    var breaksmethod = getString("breaksFunction");
    if (breaksmethod == "num") {
        breaks = 'pretty(range(na.omit(' + variable + ')),' + getString("breaksNum") + ')';
        classesheader = "Approximately " + getString("breaksNum") + " intervals";
    } else if (breaksmethod == "vec") {
        breaks = 'c(' + getString("breaksVec") + ')';
        classesheader = "Defined by the user: " + getString("breaksVec");
    } else {
        breaks = 'pretty(range(na.omit(' + variable + ')), nclass.' + breaksmethod + '(' + variable + '))';
        classesheader = breaksmethod;
    };
    classes = ', breaks=' + breaks;
    if (getBoolean("rightclosed")) {
        classes += ', right=TRUE';
    } else {
        classes += ', right=FALSE';
    }
}

function preprocess() {
    // add requirements etc. here
    makeCodes();
    echo(breaks);
}

function calculate() {
    // the R code to be evaluated
    echo(classes);
}

function printout() {
    // printout the results
    echo(classesheader);
}
