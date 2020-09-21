//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    variable,
    variableName,
    grouped,
    groups,
    groupsName,
    xlab,
    ylab,
    y,
    fill,
    position,
    pos,
    barColor,
    borderColor,
    facet,
    relative,
    cumulative,
    polygon;

function setGlobalVars() {
    variable = getString("variable");
    dataframe = getDataframe(variable);
    variableName = getString("variable.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    relative = getBoolean("relative");
    cumulative = getBoolean("cumulative");
    position = getString("position");
    polygon = getBoolean("polygon");
}

function preprocess() {
    setGlobalVars();
    echo('require(rkTeaching)\n');
    echo('require(plyr)\n');
    echo('require(ggplot2)\n');
}

function calculate() {
    // Filter
    filter();
    // Set axes labels
    xlab = ' + xlab(' + quote(variableName) + ')';
    ylab = ' + ylab(' + i18n("Absolute frequency") + ')';
    fill = '';
    // Set bar color
    barColor = getString("barFillColor.code.printout")
    if (barColor !== '') {
        barColor = ', fill=I(' + barColor + ')';
    } else {
        barColor = ', fill=I("#FF9999")'; // Defauklt bar color
    }
    // Set border color
    borderColor = getString("barBorderColor.code.printout");
    if (borderColor !== '') {
        borderColor = ', colour=I(' + borderColor + ')';
    }
    // Set grouped mode
    pos = '';
    facet = '';
    if (grouped) {
        fill = ', aes(fill=' + groupsName.join('.') + ')';
        if (cumulative || position === 'faceted') {
            facet = ' + facet_grid(' + groupsName.join('.') + '~.)';
        } else {
            pos = ', position=' + quote(position);
        }
        barColor = '';
    }
    // Prepare data
    if (grouped) {
        echo('.df <- ldply(frequencyTable(' + dataframe + ', ' + quote(variableName) + ', groups=c(' + groupsName.map(quote) + ')))\n');
        echo('.df <- transform(.df,' + groupsName.join('.') + '=interaction(.df[,c(' + groupsName.map(quote) + ')]))\n');
        echo('.df <- .df[!is.na(.df[["' + groupsName.join(".") + '"]]),]\n');
    } else {
        echo('.df <- frequencyTable(' + dataframe + ', ' + quote(variableName) + ')\n');
    }
    // Set frequency type
    y = 'Abs.Freq.';
    if (relative) {
        y = 'Rel.Freq.';
        ylab = ' + ylab(' + i18n("Relative frequency") + ')';
        if (grouped && position === 'stack') {
            echo('.df <- transform(.df,Rel.Freq.=Abs.Freq./sum(Abs.Freq.))\n');
        }
    }
    if (cumulative) {
        y = 'Cum.Abs.Freq.';
        ylab = ' + ylab(' + i18n("Cumulative frequency") + ')';
        if (relative) {
            y = 'Cum.Rel.Freq.';
            ylab = ' + ylab(' + i18n("Cumulative relative frequency") + ')';
        }
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
        header = new Header(i18n("Bar chart of %1", variableName));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("Variable"), variableName);
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
    echo('p <- ggplot(data=.df, aes(x=' + variableName + ', y=' + y + ')) + geom_bar(stat="identity", orientation="x"' + fill + barColor + borderColor + pos + ')' + xlab + ylab + facet + getString("plotOptions.code.calculate") + '\n');
    if (polygon) {
        if (cumulative) {
            echo('p <- p + geom_step(aes(group=1))\n');
        } else {
            echo('p <- p + geom_line(aes(group=1))\n');
        }
    }
    echo('print(p)\n');
    echo('})\n');

    if (full) {
        echo('rk.graph.off()\n');
    }
}
