//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    variable,
    variableName,
    grouped,
    groups,
    groupsName,
    // cells,
    xlab,
    ylab,
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
    relative = getString("relative");
    cumulative = getBoolean("cumulative");
    position = getString("position");
    polygon = getBoolean("polygon");
}

function preprocess() {
    setGlobalVars();
    echo('require(rk.Teaching)\n');
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
    if (barColor != '') {
        barColor = ', fill=I(' + barColor + ')';
    } else {
        barColor = ', fill=I("#FF9999")';
    }
    // Set border color
    borderColor = getString("barBorderColor.code.printout");
    if (borderColor != '') {
        borderColor = ', colour=I(' + borderColor + ')';
    } else {
        borderColor = ', colour=I("white")';
    }
    // Set grouped mode
    pos = '';
    facet = '';
    if (grouped) {
        fill = ', fill=' + groupsName.join('.');
        if (cumulative || position === 'faceted') {
            facet = ' + facet_grid(' + groupsName.join('.') + '~.)';
        } else {
            pos = ', position=' + quote(position);
            if (position === 'identity') {
                pos += ', alpha=.5';
            }
        }
        barColor = '';
    }
    // Interval breaks
    // cells = getString("cells.code.calculate");
    echo('.breaks <- ' + getString("cells.code.preprocess") + '\n');
    // Calculate frequencies
    if (grouped) {
        echo('.df <- ldply(frequencyTableIntervals(' + dataframe + ', ' + quote(variableName) + ', breaks=.breaks, center=TRUE, width=TRUE, groups=c(' + groupsName.map(quote) + ')))\n');
        echo('.df <- transform(.df,' + groupsName.join('.') + '=interaction(.df[,c(' + groupsName.map(quote) + ')]))\n');
        echo('.df <- .df[!is.na(.df[["' + groupsName.join(".") + '"]]),]\n');
    } else {
        echo('.df <- frequencyTableIntervals(' + dataframe + ', ' + quote(variableName) + ', breaks=.breaks, center=TRUE, width=TRUE)\n');
    }
    // Set frecuency type
    y = 'Abs.Freq.';
    if (getBoolean("relative")) {
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
	// Header
	if (full) {
        header = new Header(i18n("Histogram of %1", variableName));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("Variable"), variableName);
        if (grouped) {
            header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
        }
				header.add(i18n("Class intervals method"), getString("cells.code.printout"));
        if (filtered) {
            header.addFromUI("condition");
        }
        header.print();

        echo('rk.graph.on()\n');
    }
    // Plot
    echo('try ({\n');
    echo('p <- ggplot(data=.df, aes(x=Center, y=' + y + fill + ')) + geom_bar(width=diff(.breaks), stat="identity", orientation="x"' + barColor + borderColor + pos + ')' + ' + scale_x_continuous(breaks=.breaks)' + xlab + ylab + facet + getString("plotOptions.code.calculate") + '\n');
    // Polygon
    if (polygon) {
        if (cumulative) {
            if (relative) {
                echo('.df <- data.frame(x=.breaks, y=c(0,.df[["Cum.Rel.Freq."]]))\n');
            } else {
                echo('.df <- data.frame(x=.breaks, y=c(0,.df[["Cum.Abs.Freq."]]))\n');
            }
            echo('p <- p + geom_line(aes(x=x, y=y), data=.df)\n');
        } else {
            echo('p <- p + geom_line()\n');
        }
    }
    echo('print(p)\n');
    echo('})\n');
    if (full) {
        echo('rk.graph.off ()\n');
    }
}
