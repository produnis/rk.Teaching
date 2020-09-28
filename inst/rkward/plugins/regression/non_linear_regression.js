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
  modelName,
  model,
  modelType;

function setGlobalVars() {
  x = getString("x");
  xName = getString("x.shortname");
  y = getString("y");
  yName = getString("y.shortname");
  dataframe = getDataframe(x);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  model = getString("model");
  saveModel = getBoolean("save.active");
  modelName = getString("save");
}

function preprocess() {
  setGlobalVars();
  echo('require(plyr)\n');
}

function calculate() {
  // Filter
  filter();
  // Set the regression formula
  var formula = '';
  if (model == "linear") {
    modelType = "Linear"
    formula += yName + ' ~ ' + xName;
  } else if (model == "quadratic") {
    modelType = "Quadratic"
    formula += yName + ' ~ ' + xName + ' + I(' + xName + '^2)';
  } else if (model == "cubic") {
    modelType = "Cubic"
    formula += yName + ' ~ ' + xName + ' + I(' + xName + '^2) + I(' + xName + '^3)';
  } else if (model == "potential") {
    modelType = "Potential"
    formula += 'log(' + yName + ') ~ log(' + xName + ')';
  } else if (model == "exponential") {
    modelType = "Exponential"
    formula += 'log(' + yName + ') ~ ' + xName;
  } else if (model == "logarithmic") {
    modelType = "Logarithmic"
    formula += yName + ' ~ log(' + xName + ')';
  } else if (model == "inverse") {
    modelType = "Inverse"
    formula += yName + ' ~ I(1/' + xName + ')';
  } else if (model == "sigmoid") {
    modelType = "Sigmoidal"
    formula += 'log(' + yName + ') ~ I(1/' + xName + ')';
  }
  // Grouped mode
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) lm(' + formula + ', data=df))\n');
    // Save model
    if (saveModel) {
      echo('for (i in 1:length(result)){\n');
      echo('\t assign(paste("' + modelName + '", names(result)[i], sep="."), result[[i]], .GlobalEnv)\n');
      echo('}\n');
    }
    echo('result <- lapply(result,summary)\n');
  } else {
    echo('result <- lm (' + formula + ', data=' + dataframe + ')\n');
    // Save model
    if (saveModel) {
      echo('assign("' + modelName + '", result, .GlobalEnv)\n');
    }
    echo('result <- summary(result)\n');
  }
}

function printout() {
  header = new Header(i18n("%3 regression model of %1 on %2", yName, xName, modelType));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Dependent variable"), yName);
  header.add(i18n("Independent variable"), xName);
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
    echo('for (i in 1:length(result)){\n');
    echo('\t rk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
    // Model equation
    echo('\t rk.header (' + i18n("Model equation") + ', level=4)\n');
    if (model == "linear") {
      echo('rk.print (c("' + yName + '", " = ", round(result[[i]][[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xName + '"))\n');
    }
    if (model == "quadratic") {
      echo('rk.print (c("' + yName + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xName + ' + ", round(result[[i]]$coeff[3,1],4), "' + xName + '^2"))\n');
    }
    if (model == "cubic") {
      echo('rk.print (c("' + yName + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xName + ' + ", round(result[[i]]$coeff[3,1],4), "' + xName + '^2 + ", round(result[[i]]$coeff[4,1],4), "' + xName + '^3"))\n');
    }
    if (model == "potential") {
      echo('rk.print (c("log(' + yName + ')", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "log(' + xName + ')"))\n');
    }
    if (model == "exponential") {
      echo('rk.print (c("log(' + yName + ')", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "' + xName + '"))\n');
    }
    if (model == "logarithmic") {
      echo('rk.print (c("' + yName + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "log(' + xName + ')"))\n');
    }
    if (model == "inverse") {
      echo('rk.print (c("' + yName + '", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "/ ' + xName + '"))\n');
    }
    if (model == "sigmoid") {
      echo('rk.print (c("log(' + yName + ')", " = ", round(result[[i]]$coeff[1,1],4), " + ", round(result[[i]]$coeff[2,1],4), "/ ' + xName + '"))\n');
    }
    // Estimations
    echo('\t rk.header (' + i18n("Model coefficients") + ', level=4)\n');
    echo('rk.results (list(');
    echo(i18n("Coefficient") + ' = rownames(result[[i]]$coeff)');
    echo(', ' + i18n("Estimation") + ' = result[[i]]$coeff[,1]');
    echo(', ' + i18n("Std.Error") + ' = result[[i]]$coeff[,2]');
    echo(', ' + i18n("t-statistic") + ' = result[[i]]$coeff[,3]');
    echo(', ' + i18n("p-value") + ' = result[[i]]$coeff[,4]))\n');
    // Model fit
    echo('\t rk.header (' + i18n("Model goodness of fit") + ', level=4)\n');
    echo('\t rk.results (list(');
    echo('"R<sup>2</sup>" = result[[i]]$r.squared,');
    echo(i18n("R<sup>2</sup> ajusted") + ' = result[[i]]$adj.r.squared,');
    echo(i18n("F-statistic") + ' = result[[i]]$fstatistic[1],');
    echo(i18n("p-value") + ' = pf(result[[i]]$fstatistic[1],result[[i]]$fstatistic[2],result[[i]]$fstatistic[3],lower.tail=FALSE)))\n');
    echo('}\n');
  } else {
    // Model equation
    echo('rk.header (' + i18n("Model equation") + ', level=4)\n');
    if (model == "linear") {
      echo('rk.print (c("' + yName + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xName + '"))\n');
    }
    if (model == "quadratic") {
      echo('rk.print (c("' + yName + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xName + ' + ", round(result$coeff[3,1],4), "' + xName + '^2"))\n');
    }
    if (model == "cubic") {
      echo('rk.print (c("' + yName + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xName + ' + ", round(result$coeff[3,1],4), "' + xName + '^2 + ", round(result$coeff[4,1],4), "' + xName + '^3"))\n');
    }
    if (model == "potential") {
      echo('rk.print (c("log(' + yName + ')", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "log(' + xName + ')"))\n');
    }
    if (model == "exponential") {
      echo('rk.print (c("log(' + yName + ')", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "' + xName + '"))\n');
    }
    if (model == "logarithmic") {
      echo('rk.print (c("' + yName + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "log(' + xName + ')"))\n');
    }
    if (model == "inverse") {
      echo('rk.print (c("' + yName + '", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "/ ' + xName + '"))\n');
    }
    if (model == "sigmoid") {
      echo('rk.print (c("log(' + yName + ')", " = ", round(result$coeff[1,1],4), " + ", round(result$coeff[2,1],4), "/ ' + xName + '"))\n');
    }
    // Estimations
    echo('rk.header (' + i18n("Model coefficients") + ', level=4)\n');
    echo('rk.results (list(');
    echo(i18n("Coefficient") + '= rownames(result$coeff)');
    echo(', ' + i18n("Estimation") + ' = result$coeff[,1]');
    echo(', ' + i18n("Std.Error") + ' = result$coeff[,2]');
    echo(', ' + i18n("t-statistic") + ' = result$coeff[,3]');
    echo(', ' + i18n("p-value") + ' = result$coeff[,4]))\n');
    // Model fit
    echo('rk.header (' + i18n("Model goodness of fit") + ', level=4)\n');
    echo('rk.results (list(');
    echo('"R<sup>2</sup>" = result$r.squared,');
    echo(i18n("R<sup>2</sup> ajusted") + ' = result$adj.r.squared,');
    echo(i18n("F-statistic") + ' = result$fstatistic[1],');
    echo(i18n("p-value") + ' = pf(result$fstatistic[1],result$fstatistic[2],result$fstatistic[3],lower.tail=FALSE)))\n');
  }
}
