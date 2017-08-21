#' Title
#'
#' @param regModel is the regression model to predict with.
#' @param data is the data frame with the values of the independent variables. 
#' @param interval is a string to indicate if compute or not the confidence intervals for the predictions. Different of "none" will compute the confidence intervals.
#' @param ... 
#'
#' @return a data frame with the values of the independent variables and the prediction of the dependent one using the regression model.
#' @export
#'
#' @examples
predictions <- function(regModel, data, interval="none", ...){
	nvars <- length(regModel$model)
	xnames <- names(regModel$model)[2:nvars]
	xnames <- gsub("I\\(", "", xnames)
	xnames <- gsub("1/", "", xnames)
	xnames <- gsub("log\\(", "", xnames)
	xnames <- gsub("\\)", "", xnames)
	yname <- names(regModel$model)[1]
	d <- data.frame(data)
	names(d) <- xnames[1]
	t <- predict(regModel, d, interval=interval, ...)
	t <- cbind(d, t)
	if (interval == "none") {
		names(t) <- c(xnames[1], paste("pred.", yname, sep=""))
	}
	else {
		names(t) <- c(xnames[1], paste("pred.", yname,sep=""), "lwr.conf.int", "upr.conf.int")
	}
	return(t)
}