// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var dataframe,
    variables;

function setGlobalVars() {
    dataframe = getString("dataframe");
    variables = getList("variables.shortname");
}

function preprocess() {
    setGlobalVars();
    echo('require("rkTeaching")\n');
}

function calculate() {
    for (var i = 0; i < variables.length; i++) {
        echo(dataframe + '<- transform(' + dataframe + ',' + variables[i] + '.standardized = scale(' + variables[i] + ', scale=stdev(' + variables[i] + ')))\n');
        echo('\t attr(' + dataframe + '[["' + variables[i] + '.standardized"]], ".rk.meta") = NULL\n');
    }
    echo('.GlobalEnv$' + dataframe + ' <- ' + dataframe + '\n');
}

function printout() {
    new Header(i18n("Standardization")).addFromUI("dataframe").add(i18n("Variables"), variables.join(", ")).print();
}
