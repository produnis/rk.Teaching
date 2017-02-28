//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include ("../common/common_functions.js")
include ("../common/filter.js")

var dataframe,
    variable,
    variablename,
    groups,
    groupsname,
    fill,
    position,
    xlab,
    ylab,
    barcolor,
    bordercolor,
    facet;

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
    echo('require(rk.Teaching)\n');
    echo('require(plyr)\n');
    echo('require(ggplot2)\n');
}

function calculate() {
    // Load variables
    variable = getString("variable");
    dataframe = variable.split('[[')[0];
    variablename = getString("variable.shortname");
    xlab = 'x="' + variablename + '"';
    ylab = ', y="Absolute frequency"';
    fill = '';
    // Set bar color
    barcolor = getString("barfillcolor.code.printout")
    if (barcolor != '') {
        barcolor = ', fill=I(' + barcolor + ')';
    } else {
        barcolor = ', fill=I("#FF9999")'; // Defauklt bar color
    }
    // Set border color
    bordercolor = getString("barbordercolor.code.printout");
    if (bordercolor != '') {
        bordercolor = ', colour=I(' + bordercolor + ')';
    }
    // Set grouped mode
    position = '';
    facet = '';
    if (getBoolean("grouped")) {
        groups = getList("groups");
        groupsname = getList("groups.shortname");
        fill = ', aes(fill=' + groupsname.join('.') + ')';
        if (getBoolean("cumulative") || getString("position") === 'faceted') {
            facet = ' + facet_grid(' + groupsname.join('.') + '~.)';
        } else {
            position = ', position="' + getString("position") + '"';
        }
        barcolor = '';
    }
    // Filter
    echo(getString("filter_embed.code.calculate"));
    // Prepare dataframe
    if (getBoolean("grouped")) {
        echo('df <- ldply(frequencyTable(' + dataframe + ', ' + quote(variablename) + ', groups=c(' + groupsname.map(quote) + ')))\n');
        if (groupsname.length > 1) {
            echo('df <- transform(df,' + groupsname.join('.') + '=interaction(df[,c(' + groupsname.map(quote) + ')]))\n');
        }
    } else {
        echo('df <- frequencyTable(' + dataframe + ', ' + quote(variablename) + ')\n');
    }
    // Set frequency type
    y = 'Abs.Freq.';
    if (getBoolean("relative")) {
        y = 'Rel.Freq.';
        ylab = ', y="Relative frequency"';
        if (getBoolean("grouped") && getString("position") === 'stack') {
            echo('df <- transform(df,Rel.Freq.=Abs.Freq./sum(Abs.Freq.))\n');
        }
    }
    if (getBoolean("cumulative")) {
        y = 'Cum.Abs.Freq.';
        ylab = ', y="Cumulative frequency"';
        if (getBoolean("relative")) {
            y = 'Cum.Rel.Freq.';
            ylab = ', y="Cumulative relative frequency"';
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
        echo('rk.header ("Bar chart of ' + variablename + '", list ("Variable" = rk.get.description(' + variable + ')' + getString("filter_embed.code.printout"));
        if (getBoolean("grouped")) {
            echo(', "Grouping variable(s)" = rk.get.description(' + groups + ', paste.sep=", ")');
        }
        echo('))\n');
        echo('rk.graph.on()\n');
    }
    // Plot
    echo('try ({\n');
    echo('p <- ggplot(data=df, aes(x=' + variablename + ', y=' + y + ')) +  geom_bar(stat="identity"' + fill + barcolor + bordercolor + position + ') + labs(' + xlab + ylab + getString("plotoptions.code.printout") + ')' + facet + getString("plotoptions.code.calculate") + '\n');

    if (getBoolean("polygon")) {
        if (getBoolean("cumulative")) {
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
