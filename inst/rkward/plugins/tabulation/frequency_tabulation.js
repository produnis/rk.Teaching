// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    variable,
    variableName,
    grouped,
    groups,
    groupsName,
    intervalsChecked;

function setGlobalVars() {
    variable = getString("variable");
    dataframe = getDataframe(variable);
    variableName = getString("variable.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    intervalsChecked = getBoolean("intervalsFrame.checked");
}

function preprocess() {
    setGlobalVars();
    echo('require(rkTeaching)\n');
}

function calculate() {
    // Filter
    filter();
    // Compute frequencies
    if (intervalsChecked) {
        // Intervals
        echo('result <- frequencyTableIntervals(' + dataframe + ', ' + quote(variableName) + getString("cells.code.calculate"));
    } else {
        // Non intervals
        echo('result <- frequencyTable(' + dataframe + ', ' + quote(variableName));
    }
    // Grouped mode
    if (grouped) {
        echo(', groups=c(' + groupsName.map(quote) + ')');
    }
    echo(')\n');
}

function printout() {
    header = new Header(i18n("Frequency table of %1", variableName));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variable"), variableName);
    if (grouped) {
        header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
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
        echo('\t rk.header(paste(' + i18n("Group") + ', "' + groupsName.join('.') + ' = ", names(result)[i]),level=3)\n');
        echo('\t\t rk.results(result[[i]])\n');
        echo('}\n');
    } else {
        echo('rk.results(result)\n');
    }
}