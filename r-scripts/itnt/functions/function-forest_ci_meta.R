forestplot.ci.meta <- function(gene=1234, subtype="ALL", outfile=paste0("Results/Default/CI_FORESTPLOT")){
  
  data_dir = '../data/'
  
  print (subtype)
  all_files <- list.files(path= data_dir, pattern="OV2_", recursive = TRUE)
  all_files<- all_files %>% str_subset(pattern = ".txt")
  all_files<- all_files %>% str_subset(pattern = subtype)
  datasets<-c()
  for(one_file in all_files){
    cohort_name<-strsplit(one_file , split="/")[[1]][1]
    datasets<-c(datasets,cohort_name)
  }
  
  
  ci<-c()
  for(one_file in all_files){
    one_file<-paste0(data_dir,one_file)
    cohort_name<-strsplit(one_file , split="/")[[1]][3]
    
    data <- read.table(one_file, header=T, sep="\t", stringsAsFactor=F)
    
    if (gene[[2]] %in% data$Entrez.ID){
      data<-data %>% filter(data$Entrez.ID == gene[[2]])
      ci <- rbind(ci, data.frame(Cohort = cohort_name, CI = data$C.index, CI_lower = data$Lower, CI_upper = data$Upper, n=data$N, stringsAsFactors = FALSE)) 
    }else{
      ci <- rbind(ci, data.frame(Cohort = cohort_name, CI = NA, CI_lower = NA, CI_upper = NA, n=NA, stringsAsFactors = FALSE)) 
    }
  }    
  
  
  
  CI<-ci$CI
  #CI[is.na(CI)] <- 0 #show NA as a dot at 0
  CI<-round(as.numeric(CI),digits=2)
  
  n_sum<-sum(ci$n, na.rm = TRUE)
  CI_mean<-round(combine.est(CI,(1/ci$n), na.rm = TRUE)[[1]], digits=2)
  CI_mean_error=round(combine.est(CI,(1/ci$n), na.rm = TRUE)[[2]], digits=4)
  
  
  CI_mean_error <- qnorm(p=0.05 / 2, lower.tail=FALSE) * CI_mean_error
  
  
  
  
  
  ############## colours ##################
  boxcolors <- c()
  for(items in CI){
    if(is.na(items)){
      next
    }
    if(items < 0) {
      boxcolors <- c(boxcolors, "#91bfdb")
    } else if(items > 0){
      boxcolors <- c(boxcolors, "#fc8d59")
    } else {
      boxcolors <- c(boxcolors, "grey50")
    }
  }
  
  c_fn <- local({
    i = 0
    col =  boxcolors
    function(..., clr.line, clr.marker){
      i <<- i + 1
      fpDrawCircleCI(..., clr.line = col[i], clr.marker = col[i])
    }
  })
  ### ave colours
  if(CI_mean > 0) {
    diamond_color <- "red"
  } else if(CI_mean < 0) {
    diamond_color <- "blue"
  } else {
    diamond_color <- "grey30"
  }
  
  c_fn1 <- local({
    i = 0
    clr = diamond_color
    function(..., col){
      i <<- i + 1
      fpDrawDiamondCI(...,clr.marker=clr[i], clr.line=clr[i])
    }
  })
  ###########################
  
  forrest_data <- 
    structure(list(
      mean  = c( NA, CI,      NA, CI_mean), 
      lower = c( NA, ci$CI_lower, NA, CI_mean-CI_mean_error),
      upper = c( NA, ci$CI_upper, NA, CI_mean+CI_mean_error)),
      .Names = c("mean", "lower", "upper"), 
      row.names = c(NA, -length(CI)-3), 
      class = "data.frame")
  
  tabletext<-cbind(
    c("Dataset", as.matrix(t(datasets)), NA, "Overall"),
    c("N",ci$n, NA, n_sum),
    c("C.Index.",CI, NA, CI_mean))
  
  
  
  png(file = paste0(outfile, "/forestplot_",subtype,"_",gene[1],".png"), width = 700, height = 350) 
  forestplot(tabletext, 
             hrzl_lines = gpar(col="#444444"),
             forrest_data,new_page = TRUE,
             is.summary=c(TRUE,rep(FALSE,length(datasets)+1),TRUE), #bold first 2 and last line
             clip=c(-1,1), 
             boxsize=c(0,sqrt(unlist(ci$n/sum(ci$n, na.rm=TRUE))*10),0,max(sqrt(unlist(ci$n/sum(ci$n, na.rm=TRUE))*10), na.rm=TRUE)),
             xlog=FALSE, 
             title=paste0("Subtype: ",subtype,"\n Gene: ",gene[1]),
             fn.ci_norm=c_fn,  fn.ci_sum=c_fn1,
             zero = c(0.5,0.5),
             lwd.zero=2,
             col=fpColors(text="black")
  )
  dev.off() 
  
}