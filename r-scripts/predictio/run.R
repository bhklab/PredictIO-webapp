library(jsonlite)

run <- function(analysis_id) {
  input_file <- paste0("../data/tmp/", analysis_id, ".txt")
  expr <- read.table(file = input_file, sep = "\t", stringsAsFactors = FALSE, header = TRUE)
  rownames(expr) <- expr[, 1]
  expr <- expr[, -1]

  expr <- expr[rownames(expr) %in% predictIO_gene$gene, ]

  # delete the uploaded file
  if (file.exists(input_file)) {
    file.remove(input_file)
  }

  PredictIO <- NULL
  if (ncol(expr)) {
    PredictIO <- getIOscore_GSVA(data = expr, meta_res = predictIO_gene)
  }

  # convert results to json string
  predictio_df <- NULL
  if (!is.null(PredictIO)) {
    predictio_df <- data.frame(PredictIO)
    predictio_df$patient_id <- rownames(predictio_df)
    predictio_df$analysis_id <- analysis_id
  }

  json <- list(
    error = FALSE,
    analysis_id = analysis_id,
    data = predictio_df
  )
  json <- jsonlite::toJSON(json)

  return(json)
}

tryCatch(
  {
    # process input arguments
    args <- commandArgs(trailingOnly = TRUE)
    # args <- c(
    #   "~/Documents/IOdb/r-scripts/predictio",
    #   "babef5e-0-1d1a-0fab-813a824206ec"
    # )

    # set working directory to the script directory
    setwd(args[1])

    # import functions and load data
    source("Get_PredictIO.R")
    load("../data/predictio/PredictIO_gene.RData")

    run(args[2])
  },
  error = function(c) {
    errorOut <- list(
      "analysis_id" = args[2],
      "error" = TRUE,
      "message" = c$message
    )
    jsonError <- jsonlite::toJSON(errorOut)
    return(jsonError)
  }
)
