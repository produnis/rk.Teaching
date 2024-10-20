// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
    varRows,
    varColumns,
    varRowsName,
    varColumnsName,
    grouped,
    groups,
    groupsName,
    intervalsRowsChecked,
    intervalsColumnsChecked,
    relativeFreq,
    marginalFreq;

function setGlobalVars() {
    varRows = getString("varRows");
    dataframe = getDataframe(varRows);
    varRowsName = getString("varRows.shortname");
    varColumns = getString("varColumns");
    varColumnsName = getString("varColumns.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    intervalsRowsChecked = getBoolean("intervalsRowsFrame.checked");
    intervalsColumnsChecked = getBoolean("intervalsColumnsFrame.checked");
    relativeFreq = getBoolean("relativeFreq");
    marginalFreq = getBoolean("marginalFreq");
}

function preprocess() {
    setGlobalVars();
    echo('library(tidyverse)\n');
    echo('library(broom)\n');
    echo('library(knitr)\n');
    echo('library(kableExtra)\n');
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
        echo('result <- ' + dataframe + '|>\n');
        echo('\tnest_by(' + groupsName.join(", ") + ') |>\n');
        if (relativeFreq) {
            if (marginalFreq) {
                echo('\tmutate(table = list(addmargins(table(data$' + varRowsName + ', data$' + varColumnsName + ')) / nrow(data)))\n');
            } else {
                echo('\tmutate(table = list(table(data$' + varRowsName + ', data$' + varColumnsName + ') / nrow(data)))\n');
            }
        } else {
            if (marginalFreq) {
                echo('\tmutate(table = list(addmargins(table(data$' + varRowsName + ', data$' + varColumnsName + '))))\n');
            } else {
                echo('\tmutate(table = list(table(data$' + varRowsName + ', data$' + varColumnsName + ')))\n');
            }
        }
        echo('result <- split(result, list(result$' + groupsName.join(",result$") + '), drop = TRUE)\n');
    } else {
        if (relativeFreq) {
            echo('result <- table(' + varRows + ', ' + varColumns + ') / nrow(' + dataframe + ')\n');
        } else {
            echo('result <- table(' + varRows + ', ' + varColumns + ')\n');
        }
        if (marginalFreq) {
            echo('result <- addmargins(result)\n');
        }
    }

}

function printout() {
    if (relativeFreq) {
        header = new Header(i18n("Two-dimensional relative frequency table of %1 and %2", varRowsName, varColumnsName));
    } else {
        header = new Header(i18n("Two-dimensional absolute frequency table of %1 and %2", varRowsName, varColumnsName));
    }
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Rows variable"), varRowsName);
    header.add(i18n("Columns variable"), varColumnsName);
    if (grouped) {
        header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
    }
    if (filtered) {
        header.addFromUI("condition");
    }
    header.print();

    if (grouped) {
        echo('for (i in 1:length(result)){\n');
        echo('\trk.header(paste("Group ' + groupsName.join('.') + ' = ", names(result)[i]),level=3)\n');
        echo('\trk.print.literal(result[[i]]$table[[1]] |>\n');
        echo('\t\tkable("html", align = "c", escape = F) |>\n');
        echo('\t\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE) |>\n');
        echo('\t\tcolumn_spec(1, bold = TRUE)\n');
        echo('\t)\n');   
        echo('}\n');
    } else {
        echo('rk.print.literal(result |>\n');
        echo('\tkable("html", align = "c", escape = F) |>\n');
        echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE) |>\n');
        echo('\tcolumn_spec(1, bold = TRUE)\n');
        echo(')\n');   
    }
}
