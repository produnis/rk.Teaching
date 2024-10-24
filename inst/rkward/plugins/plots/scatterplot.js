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
    pointColor,
    pointSymbol,
    pointSize,
    confidenceStrip,
    stripColor,
    facet,
    smooth,
    smoothColor,
    legend,
    regression,
    model,
    formula,
    linear,
    quadratic,
    cubic,
    potential,
    exponential,
    logarithmic,
    inverse,
    sigmoid;

function setGlobalVars() {
    x = getString("x");
    y = getString("y");
    dataframe = getDataframe(x);
    xName = getString("x.shortname");
    yName = getString("y.shortname");
    grouped = getBoolean("grouped");
    groups = getList("groups");
    groupsName = getList("groups.shortname");
    pointSize = getString("pointSize");
    confidenceStrip = getBoolean("confidenceStrip");
    linear = getBoolean("linear");
    quadratic = getBoolean("quadratic");
    cubic = getBoolean("cubic");
    potential = getBoolean("potential");
    exponential = getBoolean("exponential");
    logarithmic = getBoolean("logarithmic");
    inverse = getBoolean("inverse");
    sigmoid = getBoolean("sigmoid");
}

function preprocess() {
    setGlobalVars();
    echo('library(tidyverse)\n');
}

function calculate() {
    // Filter
    filter();
    // Set point color
    pointColor = getString("pointColor.code.printout");
    if (pointColor != '') {
        pointColor = 'colour = ' + pointColor;
    } else {
        pointColor = 'colour = "#FF9999"'; // Default bar color
    }
    // Set point symbol
    pointSymbol = getString("pointSymbol.code.printout");
    if (pointSymbol != '') {
        pointSymbol = ', shape = ' + pointSymbol;
    }
    // Set point size
    pointSize = ', size = ' + pointSize;
    // Set grouped mode
    facet = '';
    legend = '';
    // Scatter plot
    echo('# Plot scatter plot\n');
    echo('plot <- ' + dataframe + ' |>\n');
    if (grouped) {
        if (groupsName.length > 1) {  
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tggplot(aes(x = ' + xName + ', y = ' + yName + ', colour = ' + groupsName.join('.') + ', shape = ' + groupsName.join('.') + ')) +\n');
        } else {
            echo('\tggplot(aes(x = ' + xName + ', y = ' + yName + ', colour = ' + groupsName + ', shape = ' + groupsName + ')) +\n');
        }
        echo('\tgeom_point(' + pointSize + ')\n');
        // legend = ' + scale_colour_discrete(name = ' + quote(groupsName.join('.')) + ') + scale_shape_discrete(name = ' + quote(groupsName.join('.')) + ')';
        // if (confidenceStrip){
        //     legend += ' + scale_fill_discrete(name = ' + quote(groupsName.join('.')) + ')';
        // }
        if (getString("position") === 'faceted') {
            facet = ' + facet_grid(. ~ ' + groupsName.join('.') + ')';
        }
    } else {
        echo('\tggplot(' + 'aes(x = ' + xName + ', y = ' + yName + ')) +\n');
        echo('\tgeom_point(' + pointColor + pointSymbol + pointSize + ')\n'); 
    }
    regression = linear | quadratic | cubic | potential | exponential | logarithmic | inverse | sigmoid;
    smooth = '';
    model = [];
    formula = '';
    if (regression) {
        smooth = ' +\n\tscale_linetype(' + i18n("Regression model") + ')';
    }
    if (linear) {
        echo('# Plot linear model\n');
        if (grouped) {
            echo('df_linear <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(' + yName + ' ~ ' + xName + ', data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_linear, aes(x = ' + xName + ', y = fit, colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Linear") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_linear, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr, fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('linear_model <- lm(' + yName + ' ~ ' + xName + ', data = na.omit(' + dataframe + '))\n');
            echo('df_linear <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_linear <- cbind(df_linear, predict(linear_model, newdata = df_linear, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_linear, aes(x = ' + xName + ', y = fit, linetype = ' + i18n("Linear") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_linear, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Linear").slice(1,-1) + ' (' + yName + ' = a+b*' + xName + ')');
    }
    if (quadratic) {
        echo('# Plot quadratic model\n');
        if (grouped) {
            echo('df_quadratic <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(' + yName + ' ~ ' + xName + ' + I(' + xName + '^2), data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_quadratic, aes(x = ' + xName + ', y = fit, colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Quadratic") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_quadratic, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr, fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('quadratic_model <- lm(' + yName + ' ~ ' + xName + ' + I(' + xName + '^2), data = na.omit(' + dataframe + '))\n');
            echo('df_quadratic <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_quadratic <- cbind(df_quadratic, predict(quadratic_model, newdata = df_quadratic, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_quadratic, aes(x = ' + xName + ', y = fit, linetype = ' + i18n("Quadratic") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_quadratic, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Quadratic").slice(1,-1) + ' (' + yName + ' = a+b*' + xName + '+c*' + xName + '<sup>2</sup>)');
    }
    if (cubic) {
        echo('# Plot quadratic model\n');
        if (grouped) {
            echo('df_cubic <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(' + yName + ' ~ ' + xName + ' + I(' + xName + '^2) + I(' + xName + '^3), data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_cubic, aes(x = ' + xName + ', y = fit, colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Cubic") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_cubic, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr, fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('cubic_model <- lm(' + yName + ' ~ ' + xName + ' + I(' + xName + '^2) + I(' + xName + '^3), data = na.omit(' + dataframe + '))\n');
            echo('df_cubic <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_cubic <- cbind(df_cubic, predict(cubic_model, newdata = df_cubic, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_cubic, aes(x = ' + xName + ', y = fit, linetype = ' + i18n("Cubic") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_cubic, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Cubic").slice(1,-1) + ' (' + yName + ' = a+b*' + xName + '+c*' + xName + '<sup>2</sup>+d*' + xName + '<sup>3</sup>)');
    }
    if (potential) {
        echo('# Plot potential model\n');
        if (grouped) {
            echo('df_potential <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(log(' + yName + ') ~ log(' + xName + '), data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_potential, aes(x = ' + xName + ', y = exp(fit), colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Potential") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_potential, aes(x = ' + xName + ', y = exp(fit), ymin = exp(lwr), ymax = exp(upr), fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('potential_model <- lm(log(' + yName + ') ~ log(' + xName + '), data = na.omit(' + dataframe + '))\n');
            echo('df_potential <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_potential <- cbind(df_potential, predict(potential_model, newdata = df_potential, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_potential, aes(x = ' + xName + ', y = exp(fit), linetype = ' + i18n("Potential") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_potential, aes(x = ' + xName + ', y = exp(fit), ymin = exp(lwr), ymax = exp(upr)), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Potential").slice(1,-1) +' (' + yName + ' = a*' + xName + '^b)');
    }
    if (exponential) {
        echo('# Plot exponential model\n');
        if (grouped) {
            echo('df_exponential <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(log(' + yName + ') ~ ' + xName + ', data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_exponential, aes(x = ' + xName + ', y = exp(fit), colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Exponential") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_exponential, aes(x = ' + xName + ', y = exp(fit), ymin = exp(lwr), ymax = exp(upr), fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('exponential_model <- lm(log(' + yName + ') ~ ' + xName + ', data = na.omit(' + dataframe + '))\n');
            echo('df_exponential <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_exponential <- cbind(df_exponential, predict(exponential_model, newdata = df_exponential, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_exponential, aes(x = ' + xName + ', y = exp(fit), linetype = ' + i18n("Exponential") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_exponential, aes(x = ' + xName + ', y = exp(fit), ymin = exp(lwr), ymax = exp(upr)), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Exponential").slice(1,-1) +' (' + yName + ' = exp(a+b*' + xName + '))');
    }
    if (logarithmic) {
        echo('# Plot logarithmic model\n');
        if (grouped) {
            echo('df_logarithmic <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(' + yName + ' ~ log(' + xName + '), data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_logarithmic, aes(x = ' + xName + ', y = fit, colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Logarithmic") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_logarithmic, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr, fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('logarithmic_model <- lm(' + yName + ' ~ log(' + xName + '), data = na.omit(' + dataframe + '))\n');
            echo('df_logarithmic <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_logarithmic <- cbind(df_logarithmic, predict(logarithmic_model, newdata = df_logarithmic, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_logarithmic, aes(x = ' + xName + ', y = fit, linetype = ' + i18n("Logarithmic") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_logarithmic, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Logarithmic").slice(1,-1) +' (' + yName + ' = a+b*log(' + xName + '))');
    }
    if (inverse) {
        echo('# Plot inverse model\n');
        if (grouped) {
            echo('df_inverse <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(' + yName + ' ~ I(1/' + xName + '), data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_inverse, aes(x = ' + xName + ', y = fit, colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Inverse") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_inverse, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr, fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('inverse_model <- lm(' + yName + ' ~ I(1/' + xName + '), data = na.omit(' + dataframe + '))\n');
            echo('df_inverse <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_inverse <- cbind(df_inverse, predict(inverse_model, newdata = df_inverse, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_inverse, aes(x = ' + xName + ', y = fit, linetype = ' + i18n("Inverse") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_inverse, aes(x = ' + xName + ', y = fit, ymin = lwr, ymax = upr), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Inverse").slice(1,-1) +' (' + yName + ' = a+b/' + xName + ')');
    }
    if (sigmoid) {
        echo('# Plot sigmoidal model\n');
        if (grouped) {
            echo('df_sigmoidal <- ' + dataframe + ' |>\n');
            echo('\tmutate(' + groupsName.join('.') + ' = interaction(' + groupsName.join(', ') + ')) |>\n');
            echo('\tnest_by(' + groupsName.join('.') + ') |>\n');
            echo('\tmutate(model = list(lm(log(' + yName + ') ~ I(1/' + xName + '), data = na.omit(data)))) |>\n');
            echo('\tmutate(newdata = list(data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100)))) |>\n')
            echo('\tmutate(pred = list(cbind(newdata, predict(model, newdata = newdata, interval = "confidence")))) |>\n');
            echo('\tunnest(pred)\n');
            echo('plot <- plot + geom_line(data = df_sigmoidal, aes(x = ' + xName + ', y = exp(fit), colour = ' + groupsName.join('.') + ', linetype = ' + i18n("Sigmoidal") + '))');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_sigmoidal, aes(x = ' + xName + ', y = exp(fit), ymin = exp(lwr), ymax = exp(upr), fill = ' + groupsName.join('.') + '), alpha = 0.2)\n');
            }
        } else {
            echo('sigmoidal_model <- lm(log(' + yName + ') ~ I(1/' + xName + '), data = na.omit(' + dataframe + '))\n');
            echo('df_sigmoidal <- data.frame(' + xName + ' = seq(min(' + x + '), max(' + x + '), length.out = 100))\n');
            echo('df_sigmoidal <- cbind(df_sigmoidal, predict(sigmoidal_model, newdata = df_sigmoidal, interval = "confidence"))\n');
            echo('plot <- plot + geom_line(data = df_sigmoidal, aes(x = ' + xName + ', y = exp(fit), linetype = ' + i18n("Sigmoidal") + '), colour = "#00BFC4")');
            if (confidenceStrip) {
                echo(' +\n\tgeom_ribbon(data = df_sigmoidal, aes(x = ' + xName + ', y = exp(fit), ymin = exp(lwr), ymax = exp(upr)), fill = "#00BFC4", alpha = 0.2)\n');
            }
        }
        model.push(i18n("Sigmoidal").slice(1,-1) +' (' + yName + ' = exp(a+b/' + xName + '))');
    }
    echo('\nplot <- plot' + smooth + legend + facet + '\n');

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
        header = new Header(i18n("Scatter plot of %1 on %2", yName, xName));
        header.add(i18n("Data frame"), dataframe);
        header.add(i18n("X variable"), xName);
        header.add(i18n("Y variable"), yName);
        if (regression) {
            header.add(i18n("Regression model(s)"), model.join(", "));
        }
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
        echo('rk.graph.off()\n');
    }
}