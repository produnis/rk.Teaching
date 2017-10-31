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
  modelName;

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
  echo('require(plyr)\n');
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
  var formula = yName + '~' + intercept;
  for (i = 0; i < xName.length; i++) {
    formula += '+' + xName[i];
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
  header = new Header(i18n("Linear regression model of %1 on %2", yName, xName.join(", ")));
  header.add(i18n("Data frame"), dataframe);
  header.add(i18n("Dependent variable"), yName);
  header.add(i18n("Independent variables"), xName.join(", "));
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
    if (includeIntercept) {
      echo('\t rk.print (c("' + yName + '", " = ", paste(round(result[[i]]$coeff[1,1],4), paste(round(result[[i]]$coeff[-1,1],4), rownames(result[[i]]$coeff)[-1], collapse=" + "), sep=" + ")))\n');
    } else {
      echo('\t rk.print (c("' + yName + '", " = ", paste(round(result[[i]]$coeff[,1],4), rownames(result[[i]]$coeff), collapse=" + ")))\n');
    }
    // Estimations
    echo('\t rk.header (' + i18n("Model coefficients") + ', level=4)\n');
    echo('\t rk.results (list(');
    if (includeIntercept) {
      echo(i18n("Coefficient") + ' = c(' + i18n("Intercept") + ', rownames(result[[i]]$coeff)[-1])');
    } else {
      echo(i18n("Coefficient") + ' = rownames(result[[i]]$coeff)');
    }
    echo(', ' + i18n("Estimation") + ' = result[[i]]$coeff[,1]');
    echo(', ' + i18n("Std.Error") + ' = result[[i]]$coeff[,2]');
    echo(', ' + i18n("t-statistic") + ' = result[[i]]$coeff[,3]');
    echo(', ' + i18n("p-value") + ' = result[[i]]$coeff[,4]))\n');
    // Model fit
    echo('\t rk.header (' + i18n("Model goodness of fit") + ', level=4)\n');
    echo('\t rk.results (list(');
    echo('"R<sup>2</sup>" = result[[i]]$r.squared,');
    echo(i18n("R<sup>2</sup> adjusted") + ' = result[[i]]$adj.r.squared,');
    echo(i18n("F-statistic") + ' = result[[i]]$fstatistic[1],');
    echo(i18n("p-value") + ' = pf(result[[i]]$fstatistic[1],result[[i]]$fstatistic[2],result[[i]]$fstatistic[3],lower.tail=FALSE)))\n');
    echo('}\n');
    // Non grouped mode
  } else {
    // Model equation
    echo('rk.header (' + i18n("Model equation") + ', level=4)\n');
    if (includeIntercept) {
      echo('rk.print (c("' + yName + '", " = ", paste(round(result$coeff[1,1],4), paste(round(result$coeff[-1,1],4), rownames(result$coeff)[-1], collapse=" + "), sep=" + ")))\n');
    } else {
      echo('rk.print (c("' + yName + '", " = ", paste(round(result$coeff[,1],4), rownames(result$coeff), collapse=" + ")))\n');
    }
    // Estimations
    echo('rk.header (' + i18n("Model coefficients") + ', level=4)\n');
    echo('rk.results (list(');
    if (includeIntercept) {
      echo(i18n("Coefficient") + ' = c(' + i18n("Intercept") + ', rownames(result$coeff)[-1])');
    } else {
      echo(i18n("Coefficient") + '= rownames(result$coeff)');
    }
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
