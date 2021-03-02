library(jsonlite)

test1 <- function(input){

    x = FALSE
    if(as.numeric(input[3]) == 1){
        x = TRUE
    }

    n = c(2, 3, 5) 
    s = c(input[1], input[2], 'cc')
    b = c(TRUE, FALSE, x) 
    df = data.frame(n, s, b)

    json <- jsonlite::toJSON(df)

    return(json)
    # return(base::simpleError("Something went wrong!"))
}

tryCatch({
    args <- commandArgs(trailingOnly = TRUE)
    test1(args)
}, error=function(c){
    errorOut <- list(
        "error"=TRUE,
        "message"=c$message
    )
    jsonError <- jsonlite::toJSON(errorOut)
    return(jsonError)
})

