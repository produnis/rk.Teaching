// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variables,
  variablesNames,
  grouped,
  groups,
  groupsName;

function setGlobalVars() {
  variables = getList("variables");
  variablesNames = getList("variables.shortname");
  dataframe = getDataframe(variables);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
}

function preprocess() {
  setGlobalVars();
  echo('library(tidyverse)\n');
  echo('library(GGally)\n');
}

function calculate() {
  // Filter
  filter();
  echo('plot <- ' + dataframe + ' |>\n');
  // Set grouped mode
  if (grouped) {
    echo('\tmutate(' + groupsName.join(".") + ' = interaction(' + groupsName.join(",") + ')) |>\n');
  }
  // Set plot
  echo('\tggpairs(columns = c(' + variablesNames.map(quote) + ')');
  if (grouped) {
    echo(', mapping = aes(colour = ' + groupsName.join(".") + ', alpha = 0.3)');
  }
  echo(')\n');

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
    header = new Header(i18n("Scatter plot matrix of %1", variablesNames.join(", ")));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variables"), variablesNames.join(", "));
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
    echo('\n');
    echo('rk.graph.off()\n');
  }
}
