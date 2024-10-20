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
  groupsName,
  data;

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
  echo('library(tidyverse)\n');
  echo('library(broom)\n');
  echo('library(knitr)\n');
  echo('library(kableExtra)\n');
}

function calculate() {
  // Filter
  filter();
  // Grouped mode
  if (grouped) {
    data = "data";
    echo('models <- ' + dataframe + ' |>\n');
    echo('\tnest_by(' + groupsName + ') |>\n');
    echo('\tmutate(\n');
  } else {
    data = dataframe;
    echo('models <- tibble(\n');
  }
  // Models
  
  if (getString("linear"))
    echo('\tlineal = list(lm(' + yName + ' ~ ' + xName + ', data = ' + data + ')),\n');
  if (getString("quadratic"))
    echo('\tquadratic = list(lm(' + yName + ' ~ poly(' + xName + ', 2), data = ' + data + ')),\n');
  if (getString("cubic"))
    echo('\tcubic = list(lm(' + yName + ' ~ poly(' + xName + ', 3), data = ' + data + ')),\n');
  if (getString("exponential"))
    echo('\texponential = list(lm(log(' + yName + ') ~ ' + xName + ', data = ' + data + ')),\n');
  if (getString("logarithmic"))
    echo('\tlogarithmic = list(lm(' + yName + ' ~ log(' + xName + '), data = ' + data + ')),\n');
  if (getString("inverse"))
    echo('\tinverse = list(lm(' + yName + ' ~ I(1/' + xName + '), data = ' + data + ')),\n');
  if (getString("potential"))
    echo('\tpotential = list(lm(log(' + yName + ') ~ log(' + xName + '), data = ' + data + ')),\n');
  if (getString("sigmoid"))
    echo('\tsigmoid = list(lm(log(' + yName + ') ~ I(1/' + xName + '), data = ' + data + ')),\n');
  echo('\t) |>\n');
  if (grouped) {
    echo('\tpivot_longer(-c(' + groupsName + ', data), names_to = "Model Type", values_to= "Model") |>\n');
  } else {
    echo('\tpivot_longer(everything(), names_to = "Model Type", values_to= "Model") |>\n');
  }
  echo('\tmutate(Summary = map(Model, glance)) |>\n');
  echo('\tunnest(Summary) |>\n');
  if (grouped) {
    echo('\tselect(' + groupsName + ', "Model Type", "r.squared", "adj.r.squared", "sigma", "statistic", "p.value") |>\n');
  } else {  
    echo('\tselect("Model Type", "r.squared", "adj.r.squared", "sigma", "statistic", "p.value") |>\n');
  }
  echo('\tarrange(-r.squared)\n');
  if (grouped) {
    echo('models <- split(models, list(models$' + groupsName.join(",models$") + '), drop = TRUE)\n');
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
    echo('for (i in 1:length(models)){\n');
		echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(models)[i]), level=3)\n');
    echo('\trk.print.literal(models[[i]] |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
    echo('}\n');
  } else {
    echo('rk.print.literal(models |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n'); 
  }
}
