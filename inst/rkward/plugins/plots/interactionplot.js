// author : Alfredo Sánchez Alberca(asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
  variable,
  variableName,
  xGroups,
  xGroupsName,
  trace,
  traceName,
  points,
  getLines,
  lines;

function setGlobalVars() {
  variable = getString("variable");
  variableName = getString("variable.shortname");
  dataframe = getDataframe(variable);
  xGroups = getString("xGroups");
  xGroupsName = getString("xGroups.shortname");
  traceGroups = getString("trace");
  traceGroupsName = getString("trace.shortname");
  getLines = getBoolean("lines");
}

function preprocess() {
  setGlobalVars();
  echo('library(tidyverse)\n');
}

function calculate() {
  // Filter
  filter();
  // Means
  points = ' +\n\tgeom_point(stat = "summary", fun = mean)';
  // Lines
  lines = '';
  if (getLines) {
    lines = ' +\n\tgeom_line(stat = "summary", fun = mean, aes(group = ' + traceGroupsName + '))';
  }
  echo('plot <- ' + dataframe + ' |>\n');
  echo('\tggplot(aes(x = ' + xGroupsName + ', y = ' + variableName + ', colour = ' + traceGroupsName + '))' + points + lines + getString("plotoptions.code.calculate") + '\n');
}

function preview() {
  preprocess();
  calculate();
  printout(true);
}

function printout(isPreview) {
  // Print header
  if (!isPreview) {
    header = new Header(i18n("Interaction plot of %1 and %2 on %3", xGroupsName, traceGroupsName, variableName));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Response variable"), variableName);
    header.add(i18n("x-axis grouping variable"), xGroupsName);
    header.add(i18n("Trace grouping variable"), traceGroupsName);
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
  if (!isPreview) {
    echo('rk.graph.off ()\n');
  }
}
