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
    borderColor;

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
    // Data frame preparation
    echo('.df <- data.frame(y=c(' + variables.join() + '), x=factor(rep(c(' + variablesName.map(quote) + '), each=nrow(' + dataframe + ')))');
    if (grouped) {
        echo(', ' + groupsName.join(".") + '=rep(interaction(' + groups + '),' + variables.length + '))\n');
        echo('.df <- .df[!is.na(.df[["' + groupsName.join(".") + '"]]),]\n');

    } else {
        echo(')\n');
    }
    // Set box color
    fill = getString("boxFillColor.code.printout");
    if (fill != '') {
        fill = 'I(' + fill + ')';
    } else {
        fill = 'I("#FF9999")'; // Default box color
    }
    // Set border color
    borderColor = getString("boxBorderColor.code.printout");
    if (borderColor != '') {
        borderColor = 'colour=I(' + borderColor + '), ';
    }
    // Set grouped mode
    facet = '';
    if (grouped) {
        fill = groupsName.join('.');
        borderColor = '';
    }
    // Set notch
    if (notch) {
        notch = 'notch=TRUE';
    } else {
        notch = 'notch=FALSE';
    }
    // Set means
    if (means) {
        means = ' + stat_summary(fun=mean, colour="red", geom="point", position=position_dodge(width=0.75))';
    } else {
        means = "";
    }
    // Set points
    if (points) {
        points = ' + geom_point(position=position_dodge(width=0.75))';
    } else {
        points = "";
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
    echo('.boxplot <- ggplot(data=.df, aes(x=x, y=y, fill=' + fill + ')) + geom_boxplot(' + borderColor + notch + ')' + points + means + ' + xlab("") + ylab("")' + facet + getString("plotOptions.code.calculate") + '\n');
    echo('print(.boxplot)\n');
    echo('})\n');

    if (full) {
        echo('rk.graph.off ()\n');
    }
}