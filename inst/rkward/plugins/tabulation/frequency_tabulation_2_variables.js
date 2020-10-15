// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    varRows,
    varColumns,
    varRowsname,
    varColumnsname,
    grouped,
    groups,
    groupsnames,
    intervalsRowsChecked,
    intervalsColumnsChecked,
    relativeFreq,
    marginalFreq;

function setGlobalVars() {
    varRows = getString("varRows");
    dataframe = getDataframe(varRows);
    varRowsname = getString("varRows.shortname");
    varColumns = getString("varColumns");
    varColumnsname = getString("varColumns.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsnames = getList("groups.shortname");
    intervalsRowsChecked = getBoolean("intervalsRowsFrame.checked");
    intervalsColumnsChecked = getBoolean("intervalsColumnsFrame.checked");
    relativeFreq = getBoolean("relativeFreq");
    marginalFreq = getBoolean("marginalFreq");
}

function preprocess() {
    setGlobalVars();
    echo("library(plyr)\n");
}

function calculate() {
    // Filter
    filter();
    // Interval classes
    if (intervalsRowsChecked) {
        echo(varRows + ' <- ' + 'cut(' + varRows + getString("cells_rows.code.calculate") + ', include.lowest=TRUE)\n');
    }
    if (intervalsColumnsChecked) {
        echo(varColumns + ' <- ' + 'cut(' + varColumns + getString("cells_columns.code.calculate") + ', include.lowest=TRUE)\n');
    }
    if (grouped) {
        if (relativeFreq) {
            if (marginalFreq) {
                echo('result <- dlply(' + dataframe + ', c(' + groupsnames.map(quote) + '), function(x) with(x,round(addmargins(prop.table(table(' + varRowsname + ', ' + varColumnsname + '))),4)))\n');
            } else {
                echo('result <- dlply(' + dataframe + ', c(' + groupsnames.map(quote) + '), function(x) with(x,round(prop.table(table(' + varRowsname + ', ' + varColumnsname + ')),4)))\n');
            }
        } else {
            if (marginalFreq) {
                echo('result <- dlply(' + dataframe + ', c(' + groupsnames.map(quote) + '), function(x) with(x,addmargins(table(' + varRowsname + ', ' + varColumnsname + '))))\n');
            } else {
                echo('result <- dlply(' + dataframe + ', c(' + groupsnames.map(quote) + '), function(x) with(x,table(' + varRowsname + ', ' + varColumnsname + ')))\n');
            }
        }
    } else {
        if (relativeFreq) {
            echo('result <- with(' + dataframe + ', prop.table(table(' + varRowsname + ', ' + varColumnsname + ')))\n');
        } else {
            echo('result <- with(' + dataframe + ', table(' + varRowsname + ', ' + varColumnsname + '))\n');
        }
        if (marginalFreq) {
            echo('result <- addmargins(result)\n');
        }
        echo('result <- round(result,4)\n');
    }

}

function printout() {
    if (relativeFreq) {
        header = new Header(i18n("Two-dimensional relative frequency table of %1 and %2", varRowsname, varColumnsname));
    } else {
        header = new Header(i18n("Two-dimensional absolute frequency table of %1 and %2", varRowsname, varColumnsname));
    }
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Rows variable"), varRowsname);
    header.add(i18n("Columns variable"), varColumnsname);
    if (grouped) {
        header.add(i18n("Grouping variable(s)"), groupsnames.join(", "));
    }
    if (filtered) {
        header.addFromUI("condition");
    }
    header.print();

    if (grouped) {
        echo('for (i in 1:length(result)){\n');
        echo('\t rk.header(paste("Group ' + groupsnames.join('.') + ' = ", names(result)[i]),level=3)\n');
        echo('\t\t rk.results(result[[i]])\n');
        echo('}\n');
    } else {
        echo('\t rk.results(result)\n');
    }
}
