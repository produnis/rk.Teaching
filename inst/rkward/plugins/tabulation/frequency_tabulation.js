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
    echo('library(tidyverse)\n');
    echo('library(broom)\n');
    echo('library(knitr)\n');
    echo('library(kableExtra)\n');
}

function calculate() {
    // Filter
    filter();
    echo ('result <- ' + dataframe + ' |>\n');
    // Grouped mode
    if (grouped) {
        echo('\tgroup_by(' + groupsName + ')|>\n');
    }
    // Compute frequencies
    if (intervalsChecked) {
        // Intervals
        //echo('result <- frequencyTableIntervals(' + dataframe + ', ' + quote(variableName) + getString("cells.code.calculate"));
        echo('\tmutate(' + variableName + ' = cut(' + variableName + getString("cells.code.calculate") + ')) |>\n');
    } 
    echo('\tcount(' + variableName + ') |>\n');
    echo('\tmutate(f = round(n/sum(n), 4), N = cumsum(n), F = round(cumsum(n)/sum(n), 4))\n');
    if (grouped) {
        echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
    }
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
        echo('\t\t rk.print.literal(result[[i]] |>\n');
        echo('\tkable("html", align = "c", escape = F) |>\n');
        echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
        echo('}\n');
    } else {
        echo('rk.print.literal(result |>\n');
        echo('\tkable("html", align = "c", escape = F) |>\n');
        echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
        echo(')\n'); 
    }
}