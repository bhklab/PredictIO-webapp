library(jsonlite)

run <- function(analysis_id, input_expression_file) {
  expr = read.table( file = paste0("../data/tmp/", input_expression_file) , sep="\t" , stringsAsFactors=FALSE , header = TRUE )
  rownames(expr) = expr[ , 1 ]
  expr = expr[ , -1 ]
  
  expr = expr[ rownames(expr) %in% predictIO_gene$gene , ]
  
  PredictIO = NULL
  if( ncol( expr ) ){ PredictIO <- getIOscore_GSVA( data = expr , meta_res= predictIO_gene ) }
  
  # convert results to json string
  predictio_df <- data.frame(PredictIO)
  predictio_df$patient_id <- rownames(predictio_df )
  predictio_df$analysis_id <- analysis_id
  json <- jsonlite::toJSON(predictio_df)
  return(json)
}

tryCatch({
  # process input arguments
  # args <- commandArgs(trailingOnly = TRUE)
  args <- c(
    "~/Documents/IOdb/r-scripts/predictio",
    "12345678",
    "EXPR.txt"
  )
  
  # set working directory to the script directory
  setwd(args[1])
  
  # import functions and load data
  source("Get_PredictIO.R")
  load( "../data/predictio/PredictIO_gene.RData" )
  
  run(args[2], args[3])
  
}, error=function(c){
  errorOut <- list(
    "analysis_id"=args[2],
    "error"=TRUE,
    "message"=c$message
  )
  jsonError <- jsonlite::toJSON(errorOut)
  return(jsonError)
})