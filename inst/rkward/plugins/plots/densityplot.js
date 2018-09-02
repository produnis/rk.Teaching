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
  fill,
  position,
  pos,
  fillColor,
  borderColor,
  facet;

function setGlobalVars() {
  variable = getString("variable");
  dataframe = getDataframe(variable);
  variableName = getString("variable.shortname");
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  position = getString("position");
}

function preprocess() {
  setGlobalVars();
  echo('require(plyr)\n');
  echo('require(ggplot2)\n');
}

function calculate() {
  // Filter
  filter();
  // Set fill color
  fillColor = getString("fillColor.code.printout")
  if (fillColor !== '') {
    fillColor = 'fill=I(' + fillColor + ')';
  } else {
    fillColor = 'fill=I("#FF9999")'; // Default bar color
  }
  // Set border color
  borderColor = getString("borderColor.code.printout");
  if (borderColor !== '') {
    borderColor = ', colour=I(' + borderColor + ')';
  } else {
    borderColor = ', colour=I("#FF9999")'; // Default bar color
  }
  // Prepare data
  // Set grouped mode
  pos = '';
  facet = '';
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', ' + groupsName.join(".") + '=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo(dataframe + ' <- ' + dataframe + '[!is.na(' + dataframe + '[["' + groupsName.join(".") + '"]]),]\n');
    fillColor = 'aes(fill=' + groupsName.join('.');
    borderColor = ', colour=' + groupsName.join('.') + ')';
    if (position === 'faceted') {
      facet = ' + facet_grid(' + groupsName.join('.') + '~.)';
    } else {
      pos = ', position=' + quote(position);
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
    header = new Header(i18n("Density chart of %1", variableName));
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
  echo('densityplot <- ggplot(data=' + dataframe + ', aes(x=' + variableName + ')) + geom_density(' + fillColor + borderColor + pos + ', alpha=0.5)' + facet + getString("plotOptions.code.calculate") + '\n');
  echo('print(densityplot)\n');
  echo('})\n');

  if (full) {
    echo('rk.graph.off()\n');
  }
}