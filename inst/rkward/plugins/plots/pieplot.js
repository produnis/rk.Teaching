//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    variable,
    variableName,
    grouped,
    groups,
    groupsName,
    relative,
    freq,
    facet,
    xLabel;

function setGlobalVars() {
    variable = getString("variable");
    dataframe = getDataframe(variable);
    variableName = getString("variable.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    relative = getBoolean("relative");
}

function preprocess() {
    setGlobalVars();
    echo('library(ggplot2)\n');
}

function calculate() {
    // Filter
    filter();
    // Set grouped mode
    if (grouped) {
        echo(dataframe + ' <- transform(' + dataframe + ', ' + groupsName.join(".") + '=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
        echo(dataframe + ' <- ' + dataframe + '[!is.na(' + dataframe + '[["' + groupsName.join(".") + '"]]),]\n');
        facet = ' + facet_grid(.~' + groupsName.join(".") + ')';
    } else {
        facet = '';
    }
    // Set type of frequency
    if (relative) {
        freq = ', position="fill"';
        xLabel = i18n("Relative frequency");
    } else {
        freq = '';
        xLabel = i18n("Absolute frequency");
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
        header = new Header(i18n("Pie chart of %1", variableName));
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
    echo('p <- ggplot(data=' + dataframe + ', aes(x=factor(1), fill=factor(' + variableName + '))) + geom_bar(width=1' + freq + ') +  xlab(' + quote(xLabel) + ') + ylab("") + theme( axis.ticks.y=element_blank(), axis.text.y=element_blank()) + scale_fill_hue("' + variableName + '")' + facet + getString("plotOptions.code.calculate") + ' + coord_polar(theta="y")\n');
    // getString("plotOptions.code.calculate") + '\n');
    echo('print(p)\n');
    echo('})\n');

    if (full) {
        echo('rk.graph.off()\n');
    }
}
