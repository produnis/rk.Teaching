frequencyTable <- function(data, variable, groups=NULL, decimals=4){
	require(plyr)
	if (!is.data.frame(data)) {
		stop("data must be a data frame")
	}
	if (!variable %in% colnames(data)) {
		stop(paste(variable, "is not a column of data frame"))
	}
	if (!is.null(groups)) {
		for (i in 1:length(groups)) {
			if (!groups[i] %in% colnames(data)) {
				stop(paste(groups[i], "is not a column of data frame", data))
			}
			if (!is.factor(data[[groups[i]]])) {
				stop(paste(groups[i], "is not a factor"))
			}
		}
	}
	if (is.null(groups)){
		result <- na.omit(data[variable])
		result <- count(result, variable)
		colnames(result)[2] <- "Abs.Freq."
		result <- mutate(result,Rel.Freq.=round(Abs.Freq./sum(Abs.Freq.),decimals),Cum.Abs.Freq.=cumsum(Abs.Freq.),Cum.Rel.Freq.=round(Cum.Abs.Freq./sum(Abs.Freq.),decimals))
	}
	else {
		f <- function(df){
			output <- na.omit(df[variable])
			output <- count(output,variable)
			colnames(output)[2] <- "Abs.Freq."
			mutate(output,Rel.Freq.=round(Abs.Freq./sum(Abs.Freq.),decimals),Cum.Abs.Freq.=cumsum(Abs.Freq.),Cum.Rel.Freq.=round(Cum.Abs.Freq./sum(Abs.Freq.),decimals))
		}
		result <- dlply(data,groups,f)
	}
	return(result)
}