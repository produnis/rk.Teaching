// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

var dataframe,
  x,
  y,
  xName,
  yName,
  grouped,
  groups,
  groupsName,
  intercept,
  modelName,
  formula;

function setGlobalVars() {
  x = getList("x");
  xName = getList("x.shortname");
  y = getString("y");
  yName = getString("y.shortname");
  dataframe = getDataframe(x);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  includeIntercept = getBoolean("intercept");
  saveModel = getBoolean("save.active");
  modelName = getString("save");
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
  // Set the intercept
  if (includeIntercept) {
    intercept = "";
  } else {
    intercept = "0";
  }
  // Set regression formula
  formula = yName + ' ~ ' + intercept + xName.join(' + ');
  // Grouped mode
  if (grouped) {
    echo('model <- ' + dataframe + ' |>\n');
    echo('\tnest_by(' + groupsName + ') |>\n');
    echo('\tmutate(Model = list(lm(' + formula + ', data = data)))\n');
    echo('parameters <- model |>\n');
    echo('\tmutate(Parameters = list(tidy(Model))) |>\n');
    echo('\tunnest(Parameters) |>\n');
    echo('\tselect(-c(data, Model))\n');
    echo('parameters <- split(parameters, list(parameters$' + groupsName.join(",parameters$") + '), drop = TRUE)\n');
    echo('summary <- model |>\n');
    echo('\tmutate(Summary = list(glance(Model))) |>\n');
    echo('\tunnest(Summary) |>\n'); 
    echo('\tselect(-c(data, Model))\n');  
    echo('summary <- split(summary, list(summary$' + groupsName.join(",summary$") + '), drop = TRUE)\n');
    if (saveModel) {
      echo('models <- split(model, list(model$' + groupsName.join(",model$") + '), drop = TRUE)\n');
      echo('for (i in 1:length(models)){\n');
      echo('\t assign(paste("' + modelName + '", names(models)[i], sep="."), models[[i]]$Model[[1]], .GlobalEnv)\n');
      echo('}\n');
    }
  } else {
    echo('model <- lm (' + formula + ', data = ' + dataframe + ')\n');
    echo('parameters <- tidy(model)\n');
    echo('summary <- glance(model)\n');
    if (saveModel) {
      echo('assign("' + modelName + '", model, .GlobalEnv)\n');
    }
  }
}

function printout() {
  header = new Header(i18n("Linear regression model of %1 on %2", yName, xName.join(", ")));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Dependent variable"), yName);
  header.add(i18n("Independent variables"), xName.join(", "));
  header.add(i18n("Model equation"), formula);
  if (grouped) {
    header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
  }
  if (saveModel) {
    header.add(i18n("Model name"), modelName);
  }
  if (filtered) {
    header.addFromUI("condition");
  }
  header.print();
  // Grouped mode
  if (grouped) {
    echo('for (i in 1:length(parameters)){\n');
		echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(parameters)[i]), level=3)\n');
    echo('\trk.header (' + i18n("Model coefficients") + ', level=4)\n');
    echo('\trk.print.literal(parameters[[i]] |> kable("html") |> kable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
    echo('\trk.header (' + i18n("Model goodness of fit") + ', level=4)\n');
    echo('\trk.print.literal(summary[[i]] |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
    echo('}\n');
  } else {
    echo('rk.header (' + i18n("Model coefficients") + ', level=4)\n');
    echo('rk.print.literal(parameters |> kable("html") |> kable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE))\n');
    echo('rk.header (' + i18n("Model goodness of fit") + ', level=4)\n');
    echo('rk.print.literal(summary |>\n');
    echo('\tkable("html", align = "c", escape = F) |>\n');
    echo('\tkable_styling(bootstrap_options = c("striped", "hover"), full_width = FALSE)\n');
    echo(')\n');   
  }
}
