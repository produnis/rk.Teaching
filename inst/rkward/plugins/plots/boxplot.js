//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
    variables,
    variablesName,
    grouped,
    groups,
    groupsName,
    notch,
    means,
    points,
    x,
    fill,
    borderColor,
    xlab;

function setGlobalVars() {
    variables = getList("variables");
    dataframe = getDataframe(variables);
    variablesName = getList("variables.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    notch = getBoolean("notch");
    means = getBoolean("means");
    points = getBoolean("points");
}

function preprocess() {
    setGlobalVars();
    echo('library(ggplot2)\n');
}

function calculate() {
    // Filter
    filter();
    // Set box color
    fill = getString("boxFillColor.code.printout");
    if (fill != '') {
        fill = ', fill = I(' + fill + ')';
    } else {
        fill = ', fill = I("#FF9999")'; // Default box color
    }
    // Set border color
    borderColor = getString("boxBorderColor.code.printout");
    if (borderColor != '') {
        borderColor = 'colour = I(' + borderColor + '), ';
    }
    // Set grouped mode
    if (grouped) {
        if (groupsName.length == 1) {
            fill = ', fill = ' + groupsName;
        } else {
            fill = ', fill = interaction(' + groupsName.join(', ') + ')';
        }
        borderColor = '';
    }
    // Set notch
    if (notch) {
        notch = 'notch = TRUE';
    } else {
        notch = 'notch = FALSE';
    }
    // Set means
    if (means) {
        means = ' +\n\tstat_summary(fun = mean, colour = "red", geom = "point", position = position_dodge(width = 0.75))';
    } else {
        means = '';
    }
    // Set points
    if (points) {
        points = ' + geom_point(position = position_dodge(width = 0.75))';
    } else {
        points = '';
    }
    // Plot
    echo('plot <- ' + dataframe + ' |>\n');
    if (variables.length == 1) {
        echo('\tggplot(aes(x = 0, y = ' + variablesName + fill + ')) +\n');
        xlab = variablesName;
    } else {
        echo('\tpivot_longer(c(' + variablesName.join(", ") + '), names_to = "variables", values_to = "values") |>\n');
        echo('\tggplot(aes(x = variables, y = values' + fill + ')) +\n');
        xlab = '';
    }
    echo('\tgeom_boxplot(' + borderColor + notch + ')' + points + means + ' +\n\txlab("' + xlab + '") +\n\tylab("")' + getString("plotOptions.code.calculate"));
    if (variables.length == 1) {
        echo(' +\n\ttheme(axis.text.x = element_blank(), axis.ticks.x = element_blank())');
    }
    echo('\n');
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
        header = new Header(i18n("Box plot of %1", variablesName.join(", ")));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("Variable"), variablesName.join(", "));
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
        echo('rk.graph.off ()\n');
    }
}