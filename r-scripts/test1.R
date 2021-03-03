library(jsonlite)

run_sync <- function(input){
    wd <- paste0(getwd(), '/r-scripts/itnt')

    setwd(wd)

    print(getwd())

    print('beginning')
    x = FALSE
    if(as.logical(input[3])){
        x = TRUE
    }

    n = c(2, 3, 5) 
    s = c(input[1], input[2], 'cc')
    b = c(TRUE, FALSE, x) 
    df = data.frame(n, s, b)

    json <- jsonlite::toJSON(df)

    return(json)
}

run_async <- function(input){
    x = FALSE
    
    if(as.logical(input[3])){
        x = TRUE
    }

    Sys.sleep(5)

    n = c(2, 3, 5) 
    s = c(input[1], input[2], 'cc')
    b = c(TRUE, FALSE, x) 
    df = data.frame(n, s, b)

    json <- jsonlite::toJSON(df)

    return(json)
}

tryCatch({
    args <- commandArgs(trailingOnly = TRUE)
    if(as.logical(args[4])){
        run_async(args)
    }else{
        run_sync(args)
    }
}, error=function(c){
    errorOut <- list(
        "error"=TRUE,
        "message"=c$message
    )
    jsonError <- jsonlite::toJSON(errorOut)
    return(jsonError)
})

