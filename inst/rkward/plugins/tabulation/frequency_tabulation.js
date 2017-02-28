// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include ("../common/common_functions.js")
include ("../common/filter.js")

var dataframe,
    variable,
    variablename,
    grouped,
    groups,
    groupsnames,
    intervalsChecked;

function setGlobalVars() {
    variable = getString("variable");
    dataframe = getDataframe(variable);
    variablename = getString("variable.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsnames = getList("groups.shortname");
    intervalsChecked = getBoolean("intervalsFrame.checked");
}

function preprocess() {
    setGlobalVars();
    echo('require(rk.Teaching)\n');
}

function calculate() {
    // Filter
    filter();
    // Compute frequencies
    if (intervalsChecked) {
        // Intervals
        echo('result <- frequencyTableIntervals(' + dataframe + ', ' + quote(variablename) + getString("cells.code.calculate"));
    } else {
        // Non intervals
        echo('result <- frequencyTable(' + dataframe + ', ' + quote(variablename));
    }
    // Grouped mode
    if (grouped) {
        echo(', groups=c(' + groupsnames.map(quote) + ')');
    }
    echo(')\n');
}

function printout() {
    header = new Header(i18n("Frequency table of %1", variablename));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variable"), variablename);
    if (grouped){
        header.add(i18n("Grouping variable(s)"), groupsnames.join(", "));
    }
    if (intervalsChecked) {
        header.add(i18n("Class intervals method"), getString("cells.code.printout"));
    }
    if (filtered) {
        header.addFromUI("condition");
    }
    header.print();

// Print result
    if (grouped) {
        echo('for (i in 1:length(result)){\n');
        echo('\t rk.header(paste("Group ' + groupsnames.join('.') + ' = ", names(result)[i]),level=3)\n');
        echo('\t\t rk.results(result[[i]])\n');
        echo('}\n');
    } else {
        echo('rk.results(result)\n');
    }
}
