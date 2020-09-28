// author: Alfredo Sánchez Alberca (asalber@ceu.es)
var dataframe,
    condition,
    variables,
    variablesFrameChecked,
    newDataframe;

function setGlobalVars() {
    dataframe = getString("dataframe");
    condition = getString("condition");
    variables = getString("variables");
    variablesFrameChecked = getBoolean("variablesFrame.checked");
    newDataframe = getString("newDataframe");
}

function preprocess() {
    setGlobalVars();
}

function calculate() {
    variablesShortname = getValue("variables.shortname").split("\n").join(", ");
    // Subset the data frame applying the condition
    echo(".GlobalEnv$" + newDataframe + " <- subset(" + dataframe + ", subset=" + condition);
    // Extract the selected variables
    if (variablesFrameChecked) {
        echo(", select=c(" + variablesShortname + ")");
    }
    echo(")\n");
    // Add variables labels to new data frame
    echo("for(i in 1:length(names(" + newDataframe + "))){\n");
    echo("\t attr(.GlobalEnv$" + newDataframe + "[[names(" + newDataframe + ")[i]]],\".rk.meta\") = attr(" + dataframe + "[[names(" + newDataframe + ")[i]]],\".rk.meta\")\n");
    echo("}\n");
}

function printout() {
    var header = new Header(i18n("Data filtering")).addFromUI("dataframe");
    if (condition != "") {
        header.addFromUI("condition");
    }
    if (variablesFrameChecked) {
        header.add(i18n("Variables"), variablesShortname);
    }
    header.print();
}
