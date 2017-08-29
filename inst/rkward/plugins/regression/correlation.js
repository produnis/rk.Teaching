// author: Alfredo Sánchez Alberca (asalber@ceu.es)

include("../common/common_functions.js")
include("../common/filter.js")

// globals
var dataframe,
  variables,
  variablesNames,
  grouped,
  groups,
  groupsName,
  method,
  missing,
  pvalue;

function setGlobalVars() {
  variables = getList("variables");
  variablesNames = getList("variables.shortname");
  dataframe = getDataframe(variables);
  grouped = getBoolean("grouped");
  groups = getList("groups");
  groupsName = getList("groups.shortname");
  method = getString("method");
  missing = getString("missing");
  pvalue = getBoolean("p");
}

function preprocess() {
  setGlobalVars();
  echo('require(rk.Teaching)\n');
  echo('require(plyr)\n');
}

function calculate() {
  // Filter
  filter();
  // Grouped mode
  if (grouped) {
    echo(dataframe + ' <- transform(' + dataframe + ', .groups=interaction(' + dataframe + '[,c(' + groupsName.map(quote) + ')]))\n');
		// Correlation Matrix
    echo('result <- dlply(' + dataframe + ', ".groups", function(df) correlationMatrix(df[c("' + variablesNames.join("\", \"") + '")],  use="' + missing + '", method="' + method + '"))\n');
	} else {
    // Correlation Matrix
    echo('result <- correlationMatrix(' + dataframe + '[c("' + variablesNames.join("\", \"") + '")], use=' + quote(missing) + ', method=' + quote(method) + ')\n');
  }
}

  function printout() {
    // Header
    header = new Header(i18n("Correlation matrix of %1", variablesNames.join(", ")));
    header.add(i18n("Data frame"), dataframe);
    header.add(i18n("Variables"), variablesNames.join(", "));
    header.add(i18n("Method"), method);
    if (missing == "pairwise.complete.obs") {
      header.add(i18n("Omitting missing values"), i18n("Pairwise"));
    } else {
      header.add(i18n("Omitting missing values"), i18n("In all the variables"));
    }
    if (grouped) {
      header.add(i18n("Grouping variable(s)"), groupsName.join(", "));
    }
    if (filtered) {
      header.addFromUI("condition");
    }
    header.print();

    //Grouped mode
    if (grouped) {
      echo('for (i in 1:length(result)){\n');
      echo('\trk.header(paste(' + i18n("Group %1 =", groupsName.join('.')) + ', names(result)[i]), level=3)\n');
      echo('\trk.header (' + i18n("Correlation coefficient") + ', level=3)\n');
      echo('\trk.results (as.data.frame(round(result[[i]]$cor,4)), titles=c(' + i18n("Coefficients") + ', colnames(result[[i]]$cor)))\n');
      if (pvalue) {
        echo('\trk.header (' + i18n("p-value and sample size") + ', level=3)\n');
        echo('\trk.results (as.data.frame(round(result[[i]]$p,4)), titles=c ("n \\\\ p", colnames(result[[i]]$p)))\n');
      }
      echo('\tif(length(result[[i]]$transformed) > 0){\n');
      echo('\t\trk.header(' + i18n("Variables treated as ranks") + ', level=3)\n');
      echo('\t\tfor (j in names(result[[i]]$transformed)) {\n');
      echo('\t\t\trk.print(paste(' + i18n("Variable:") + ', j))\n');
      echo('\t\t\trk.results(result[[i]]$transformed[[j]], titles=c(' + i18n("Real value") + ',' + i18n("Rank assigned") + '))\n');
      echo('\t\t}\n');
      echo('\t}\n');
      echo('}\n');
    } else {
      echo('rk.header (' + i18n("Correlation coefficient") + ', level=3)\n');
      echo('rk.results (as.data.frame(round(result$cor,4)), titles=c(' + i18n("Coefficients") + ', colnames(result$cor)))\n');
      if (pvalue) {
        echo('rk.header (' + i18n("p-value and sample size") + ', level=3)\n');
        echo('rk.results (as.data.frame(round(result$p,4)), titles=c ("n \\\\ p", colnames(result$p)))\n');
      }
      echo('if(length(result$transformed) > 0){\n');
      echo('	rk.header(' + i18n("Variables treated as ranks") + ', level=3)\n');
      echo('	for (i in names(result$transformed)) {\n');
      echo('		rk.print(paste(' + i18n("Variable:") + ', i))\n');
      echo('		rk.results(result$transformed[[i]], titles=c(' + i18n("Real value") + ',' + i18n("Rank assigned") + '))\n');
      echo('	}\n');
      echo('}\n');
    }
  }
