// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var dataframe,
    expression,
    save;

function setGlobalVars() {
    dataframe = getString("dataframe");
    expression = getString("expression");
    save = getString("save");
}

function preprocess() {
    setGlobalVars();
}

function calculate() {
    // Create a new variable with the given expression
    echo(".GlobalEnv$" + save + " <- with(" + dataframe + ", " + expression + ")\n");
    // Remove the label of the new variable
    echo("attr(.GlobalEnv$" + save + ",'.rk.meta') <- NULL\n");
}

function printout() {
    new Header(i18n("Variable calculation")).addFromUI("dataframe").addFromUI("save").addFromUI("expression").print();
}
