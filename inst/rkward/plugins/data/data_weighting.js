// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var dataframe,
    freq,
    newDataframe;

function setGlobalVars() {
    dataframe = getString("dataframe");
    freq = getString("freq.shortname");
    newDataframe = getString("newDataframe");
}

function preprocess() {
    setGlobalVars();
    echo("require(rk.Teaching)\n");
}

function calculate() {
    echo('.GlobalEnv$' + newDataframe + ' <- weightDataFrame(' + dataframe + ', "' + freq + '")\n');
}

function printout() {
    var header = new Header(i18n("Data weighting")).addFromUI("dataframe").addFromUI("freq").addFromUI("newDataframe").print();
}
