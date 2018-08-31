//author: Alfredo Sánchez Alberca (asalber@ceu.es)

function prepareLabel(labelname) {
	var label = getString(labelname).split('\n');
	label = label.join('\\n');
	if (label != '') {
		if (!getBoolean(labelname + '_expression')) {
			label = quote(label);
		}
	}
	return label;
}

function preprocess() {}

function calculate() {
	// Title and subtitle
	var title = prepareLabel('title');
	if (title != '') {
		title = ' + labs(title=' + title;
		var subtitle = prepareLabel('subtitle');
		if (subtitle != '') {
			title += ', subtitle=' + subtitle;
		}
		title += ')';
	}

	// X axis
	// X axis label
	var xLab = prepareLabel("xLab");
	if (xLab != '') {
		xLab = ' + xlab(' + xLab + ')';
	}
	// X range 
	var xMinValue = getString("xMinValue");
	var xMaxValue = getString("xMaxValue");
	var xLim = '';
	if ((xMinValue != '') && (xMaxValue != '')) {
		xLim = 'xlim=c(' + xMinValue + ',' + xMaxValue + ')';
	}
	// X ticks labels orientation
	var xLabOrientation = getString("xLabOrientation");
	if (xLabOrientation !== '') {
		xLabOrientation = ' + theme(axis.text.x=element_text(angle=' + xLabOrientation + ', vjust=0.5))';
	}

	// X logarithmic scale
	var xLog = '';
	if (getBoolean("xLog")) {
		xLog = ' + scale_x_continuous(trans="log2")';
	}

	// Y axis
	// X axis label
	var yLab = prepareLabel("yLab");
	if (yLab != '') {
		yLab = ' + ylab(' + yLab + ')';
	}
	// Y range
	var yMinValue = getString("yMinValue");
	var yMaxValue = getString("yMaxValue");
	var yLim = '';
	if ((yMinValue != '') && (yMaxValue != '')) {
		yLim = 'ylim=c(' + yMinValue + ',' + yMaxValue + ')';
	}

	var coord = '';
	if (xLim!="" | yLim!="") {
		coord = ' + coord_cartesian(' + xLim + ',' + yLim + ')';
	} 

	// Y ticks labels orientation
	var yLabOrientation = getString("yLabOrientation");
	if (yLabOrientation !== '') {
		yLabOrientation = ' + theme(axis.text.y=element_text(angle=' + yLabOrientation + ', hjust=0.5))';
	}

	// X logarithmic scale
	var yLog = '';
	if (getBoolean("yLog")) {
		yLog = ' + scale_y_continuous(trans="log2")';
	}

	// flip axis
	var switchAxes = '';
	if (getBoolean("switchAxes")) {
		switchAxes = ' + coord_flip()';
	}

	// legend
	var legend = getString("legend");
	if (legend != '') {
		legend = ' + theme(legend.position="' + legend + '")';
	}

	// grid
	var gridHorizontalMajor = '';
	if (!getBoolean("gridHorizontalMajor")) {
		gridHorizontalMajor = ' + theme(panel.grid.major.x=element_blank())';
	}
	var gridHorizontalMinor = '';
	if (!getBoolean("gridHorizontalMinor")) {
		gridHorizontalMinor = ' + theme(panel.grid.minor.x=element_blank())';
	}
	var gridVerticalMajor = '';
	if (!getBoolean("gridVerticalMajor")) {
		gridVerticalMajor = ' + theme(panel.grid.major.y=element_blank())';
	}
	var gridVerticalMinor = '';
	if (!getBoolean("gridVerticalMinor")) {
		gridVerticalMinor = ' + theme(panel.grid.minor.y=element_blank())';
	}
	var gridBackgroundColor = getString("gridBackgroundColor.code.printout");
	if (gridBackgroundColor != '') {
		gridBackgroundColor = ' + theme(panel.background=element_rect(fill=' + gridBackgroundColor + '))';
	}
	var gridMajorLineColor = getString("gridMajorLineColor.code.printout");
	if (gridMajorLineColor != '') {
		gridMajorLineColor = ' + theme(panel.grid.major=element_line(colour=' + gridMajorLineColor + '))';
	}
	var gridMinorLineColor = getString("gridMinorLineColor.code.printout");
	if (gridMinorLineColor != '') {
		gridMinorLineColor = ' + theme(panel.grid.minor=element_line(colour=' + gridMinorLineColor + '))';
	}

	echo(title + xLab + yLab + xLog + yLog + coord + switchAxes + xLabOrientation + yLabOrientation + legend + gridHorizontalMajor + gridHorizontalMinor + gridVerticalMajor + gridVerticalMinor + gridMajorLineColor + gridMinorLineColor + gridBackgroundColor);
}
