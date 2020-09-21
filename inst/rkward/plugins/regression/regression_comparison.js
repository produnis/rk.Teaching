// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  x,
  y,
  xName,
  yName,
  grouped,
  groups,
  groupsName;

function setGlobalVars() {
  x = getString("x");
  xName = getString("x.shortname");
  y = getString("y");
  yName = getString("y.shortname");
  dataframe = getDataframe(x);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
}

function preprocess() {
	setGlobalVars();
  echo('require(rkTeaching)\n');
  echo('require(plyr)\n');
}

function calculate() {
  // Filter
  filter();
  var models = getString("linear") + getString("quadratic") + getString("cubic") + getString("potential") + getString("exponential") + getString("logarithmic") + getString("inverse") + getString("sigmoid");
  models = models.slice(0, -1);
  // Grouped mode
  if (grouped) {
		echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) regcomp(df[["' + yName + '"]], df[["' + xName + '"]]' + ', models=c(' + models + ')))\n');
  } else {
    echo('result <- regcomp(' + y + ', ' + x + ', models=c(' + models + '))\n');
  }
}

function printout() {
	header = new Header(i18n("Comparison of regression models of %1 on %2", yName, xName));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Dependent variable"), yName);
  header.add(i18n("Independent variable"), xName);
  if (grouped) {
    header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
  }
  if (filtered) {
    header.addFromUI("condition");
  }
  header.print();

  // Grouped mode
  if (grouped) {
    echo('for (i in 1:length(result)){\n');
		echo('\t rk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    echo('\t rk.results(result[[i]])\n');
    echo('}\n');
  } else {
    echo('rk.results(result)\n');
  }
}
