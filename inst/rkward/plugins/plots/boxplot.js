//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
    variable,
    variableName,
    grouped,
    groups,
    groupsName,
    notch,
    means,
    points,
    x,
    xlab,
    ylab,
    boxColor,
    borderColor;

function setGlobalVars() {
    variable = getList("variable");
    dataframe = getDataframe(variable);
    variableName = getList("variable.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    notch = getBoolean("notch");
    means = getBoolean("means");
    points = getBoolean("points");
}

function preprocess() {
    setGlobalVars();
    echo('require(ggplot2)\n');
}

function calculate() {
    // Filter
    filter();
    // Data frame preparation
    echo('df <- data.frame(y=c(' + variable.join() + '), x=factor(rep(c("' + variableName.join('","') + '"), each=nrow(' + dataframe + ')))');
    if (grouped) {
        echo(', ' + groupsName.join(".") + '=rep(interaction(' + groups + '),' + variable.length + ')');
    }
    echo(')\n');
    // Set axes labels
    xlab = ', xlab=""';
    ylab = ', ylab=""';
    fill = '';
    // Set box color
    boxColor = getString("boxFillColor.code.printout");
    if (boxColor != '') {
        boxColor = ', fill=I(' + boxColor + ')';
    } else {
        boxColor = ', fill=I("#FF9999")'; // Default box color
    }
    // Set border color
    borderColor = getString("boxborderColor.code.printout");
    if (borderColor != '') {
        borderColor = ', colour=I(' + borderColor + ')';
    }
    // Set grouped mode
    facet = '';
    if (grouped) {
        boxColor = ', fill=' + groupsName.join(".");
        borderColor = '';
    }
    // Set notch
    if (notch) {
        notch = ', notch=TRUE';
    } else {
        notch = ', notch=FALSE';
    }
    // Set means
    if (means) {
        means = ' + stat_summary(fun.y=mean, colour="red", geom="point", position=position_dodge(width=0.75))';
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
        header = new Header(i18n("Box plot of %1", variableName.join(", ")));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("Variable"), variableName.join(", "));
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
    echo('p<-qplot(x, y, data=df, geom="boxplot"' + boxColor + borderColor + notch + xlab + ylab + getString("plotOptions.code.printout") + ')' + points + means + facet + getString("plotOptions.code.calculate") + '\n');
    echo('print(p)\n');
    echo('})\n');

    if (full) {
        echo('rk.graph.off ()\n');
    }
}
