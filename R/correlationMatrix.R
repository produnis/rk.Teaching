#' Function that computes the correlation matrix and the p-values of a set of variables in a data frame.
#'
#' @param data data frame
#' @param use an optional character string giving a method for computing covariances in the presence of missing values. This must be (an abbreviation of) one of the strings "everything", "all.obs", "complete.obs", "na.or.complete", or "pairwise.complete.obs".
#' @param method a character string indicating which correlation coefficient (or covariance) is to be computed. One of "pearson" (default), "kendall", or "spearman": can be abbreviated.
#'
#' @return a list with the correlation coefficients matrix, the p-values matrix, and the non-numeric transformed variables.
correlationMatrix <- function(data, use = "everything", method = c("pearson", "kendall", "spearman"), ...) {
  # Non-numeric variables will be treated as ordered data and transformed into numeric ranks
  transformed<- list()
  for (i in names(data)) {
    if(!is.numeric(data[[i]])){
      before <- as.character(unique(data[[i]]))
      data[[i]] <- xtfrm(data[[i]])
      after <- unique(data[[i]])
      names(after) <- before
      # Keep track of all transformations
      transformed[[i]] <- data.frame(rank=sort(after))
    } else {}
  }
  
  # calculate correlation matrix
  result.cor <- cor (data, use=use, method=method, ...)
  # calculate matrix of probabilities
  result.p <- matrix (nrow = length (data), ncol = length (data), dimnames=list (names (data), names (data)))
  for (i in 1:length (data)) {
    for (j in i:length (data)) {
      if (i != j) {
        t <- cor.test (data[[i]], data[[j]], method=method)
        result.p[i, j] <- t$p.value
        result.p[j, i] <- sum (complete.cases (data[[i]], data[[j]]))
      }
    }
  }
  result = list(cor=result.cor, p=result.p, transformed=transformed)
  return (result)
}
