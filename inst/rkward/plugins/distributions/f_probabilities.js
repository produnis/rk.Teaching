// author: Alfredo Sánchez Alberca (asalber@ceu.es)

var q, 
df1, 
df2, 
tail, 
plot,
max;

function setGlobals() {
	q = getString("q");
	df1 = getString("df1");
	df2 = getString("df2");
	tail = getString("tail");
	plot = getBoolean("plot");
	if(parseFloat(df2)<5){
		max = 10
	}
	else{
		max = parseFloat(df2)/(parseFloat(df2)-2)+4*Math.sqrt(2*Math.pow(parseFloat(df2),2)*(parseFloat(df1)+parseFloat(df2)-2)/(parseFloat(df1)*Math.pow((parseFloat(df2)-2),2)*(parseFloat(df2)-4)));
	}
}

function calculate() {
	setGlobals();
	echo ('result <- (pf(q = c(' + q + '), df1 = ' + df1 + ', df2 = ' + df2 + ', ' + tail + '))\n');
}

function printout () {
		// Header
		header = new Header(i18n("Fisher-Snedecor F cumulative probabilities F(%1,%2)", df1, df2));	
		header.add(i18n("Numerator degrees of freedom"), df1);
		header.add(i18n("Denominator degrees of freedom"), df2);
		if (tail === "lower.tail=TRUE") {
			header.add(i18n("Accumulation tail"), i18n("Left (&le;)"));
		} else {
			header.add(i18n("Accumulation tail"), i18n("Right (>)"));
		}
		header.print();
		// Results
		echo('rk.results (list(' + i18n("Values") + ' = c(' + q + '), ' + i18n("Cumulative prob") + ' = result))\n');
		// Plot
	if (plot){
		if (tail=="lower.tail=TRUE" ){
			echo('x <- seq(0,' + q + '[1], length.out= 100)\n');
		} else {
			echo('x <- seq(' + q + '[1],' + max + ', length.out= 100)\n');
		}
		echo('y <- df(x,' + df1 + ',' + df2 + ')\n');
		echo('rk.graph.on()\n');
		echo('try ({\n');
		echo('p <- qplot(x=c(0, ' + max + '), geom="blank") + geom_area(aes(x=c(x[1],x,x[100]), c(0,y,0)), fill=I("#FF9999"), alpha=0.5) + stat_function(fun=df, colour="#FF5555", n=201, args=list(df1=' + df1 + ', df2=' + df2 + ')) + xlab(expression(italic("X"))) + ylab(expression(paste(' + i18n("Density") + ', " ", italic(f(x))))) + scale_x_continuous(breaks=c(' + q + '[1]))'); 
		if (tail=="lower.tail=TRUE" ){
			echo(' + labs(title=paste("P(X<",' + q + '[1], ")=", round(result[1],4)))\n');
		} else {
			echo(' + labs(title=paste("P(X>",' + q + '[1], ")=", round(result[1],4)))\n');
		}
		echo('print(p)\n');
		echo ('})\n');
		echo('rk.graph.off()\n');
	}
	
}
