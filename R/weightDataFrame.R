weightDataFrame <- function(data, freq){
  if (ncol(data)<2) {
    stop("The data frame must contain at least two variables.")
  }
  if (!is.numeric(data[[freq]])) {
    stop("The freq variable should contain frequencies and must be numeric.")
  }
  times <- as.integer(data[[freq]])
  data[[freq]] <- NULL
  result <- data[rep(seq_len(nrow(data)), times),]
  return(result)
}

