// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
    x,
    y,
    xName,
    yName,
    grouped,
    groups,
    groupsName,
    lineColor,
    lineType;

function setGlobalVars() {
    x = getString("x");
    y = getString("y");
    dataframe = getDataframe(x);
    xName = getString("x.shortname");
    yName = getString("y.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
}

function preprocess() {
    setGlobalVars();
    echo('library(tidyverse)\n');
}

function calculate() {
    // Filter
    filter();
    // Set line color
    lineColor = getString("lineColor.code.printout");
    if (lineColor != '') {
        lineColor = 'colour = ' + lineColor;
    } else {
        lineColor = 'colour = "#FF9999"'; // Default color
    }
    // Set line type
    lineType = getString("lineType.code.printout");

    if (lineType != '') {
        lineType = ', linetype =' + lineType;
    }
    // Plot
    echo('plot <- ' + dataframe + ' |>\n');
    // Set grouped mode
    if (grouped) {
        if (groups.length > 1) {
            echo('\tmutate(' + groupsName.join(".") + ' = interaction(' + groupsName.join(", ") + ')) |>\n');
        }
        echo('\tggplot(aes(x = ' + xName + ', y = ' + yName + ', colour = ' + groupsName.join(".") + ', linetype = ' + groupsName.join(".") + ', group = ' + groupsName.join(".") + ')) +\n');
        echo('\tgeom_line()' + getString("plotOptions.code.calculate") + '\n');
    } else {
        echo('\tggplot(aes(x = ' + xName + ', y = ' + yName + ')) +\n');
        echo('\tgeom_line(' + lineColor + lineType + ')' + getString("plotOptions.code.calculate") + '\n');
    }

}

function printout() {
    doPrintout(true);
}

function preview() {
    preprocess();
    calculate();
    doPrintout(false);
}

function doPrintout(full) {
    // Print header
    if (full) {
        header = new Header(i18n("Scatter plot of %1 on %2", yName, xName));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("X variable"), xName);
        header.add(i18n("Y variable"), yName);
        if (grouped) {
            header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
        }
        if (filtered) {
            header.addFromUI("condition");
        }
        header.print();
        echo('rk.graph.on()\n');
    }
    // Plot
    echo('try ({\n');
    echo('\tprint(plot)\n');
    echo('})\n');
    if (full) {
        echo('rk.graph.off()\n');
    }
}