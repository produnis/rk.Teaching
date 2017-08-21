//author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    variable,
    variablename,
    grouped,
    groups,
    groupsname,
    cells,
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
    variablename = getString("variable.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsname = getList("groups.shortname");
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
    xlab = ' + xlab(' + quote(variablename) + ')';
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
    borderColor = getString("barborderColor.code.printout");
    if (borderColor != '') {
        borderColor = ', colour=I(' + borderColor + ')';
    } else {
        borderColor = ', colour=I("white")';
    }
    // Set grouped mode
    pos = '';
    facet = '';
    if (grouped) {
        fill = ', fill=' + groupsname.join('.');
        if (cumulative || position === 'faceted') {
            facet = ' + facet_grid(' + groupsname.join('.') + '~.)';
        } else {
            pos = ', position=' + quote(position);
            if (position === 'identity') {
                pos += ', alpha=.5';
            }
        }
        barColor = '';
    }
    // Interval breaks
    cells = getString("cells.code.calculate");
    echo('breaks <- ' + getString("cells.code.preprocess") + '\n');
    // Calculate frequencies
    if (grouped) {
        echo('df <- ldply(frequencyTableIntervals(' + dataframe + ', ' + quote(variablename) + ', breaks=breaks, center=TRUE, width=TRUE, groups=c(' + groupsname.map(quote) + ')))\n');
        if (groupsname.length > 1) {
            echo('df <- transform(df,' + groupsname.join('.') + '=interaction(df[,c(' + groupsname.map(quote) + ')]))\n');
        }
    } else {
        echo('df <- frequencyTableIntervals(' + dataframe + ', ' + quote(variablename) + ', breaks=breaks, center=TRUE, width=TRUE)\n');
    }
    // Set frecuency type
    y = 'Abs.Freq.';
    if (getBoolean("relative")) {
        y = 'Rel.Freq.';
        ylab = ' +  ylab(' + i18n("Relative frequency") + ')';
        if (grouped && position === 'stack') {
            echo('df <- transform(df,Rel.Freq.=Abs.Freq./sum(Abs.Freq.))\n');
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
    //	y = '';
    //	if (getBoolean("relative")) {
    //		y = ', y=..density..';
    //		ylab = ', ylab="Frecuencia relativa"';
    //	}
    //	if (getBoolean("cumulative")) {
    //		y = ', y=cumsum(..count..)';
    //		ylab = ', ylab="Frecuencia acumulada"';
    //		if (getBoolean("relative")){
    //			y = ', y=cumsum(..density..)';
    //			ylab = ', ylab="Frecuencia relativa acumulada"';
    //		}
    //	}
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
        header = new Header(i18n("Histogram of %1", variablename));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("Variable"), variablename);
        if (grouped) {
            header.add(i18n("Grouping variable(s)"), groupsname.join(", "));
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
    echo('p <- ggplot(data=df, aes(x=Center, y=' + y + ')' + getString("plotOptions.code.printout") + ') + geom_bar(aes(width=Width' + fill + '), stat="identity"' + barColor + borderColor + pos + ')' + ' + scale_x_continuous(breaks=breaks)' + xlab + ylab + facet + getString("plotOptions.code.calculate") + '\n');
    // Density
    if (getBoolean("density")) {
        echo('p <- p + geom_line(aes(x=' + variablename + ', y = ..density..), data=' + dataframe + ', stat = "density")\n');
    }
    // Polygon
    if (polygon) {
        if (cumulative) {
            if (relative) {
                echo('df <- data.frame(x=breaks, y=c(0,df[["Cum.Rel.Freq."]]))\n');
            } else {
                echo('df <- data.frame(x=breaks, y=c(0,df[["Cum.Abs.Freq."]]))\n');
            }
            echo('p <- p + geom_line(aes(x=x, y=y), data=df)\n');
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
