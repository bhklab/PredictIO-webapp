make.forest.plot.data <- function(subtype="ALL",pathway_list=c("EXTREMES"), gmt="c7.all.v7.0.entrez.gmt",outfile="Results/"){
  print(paste0("Subtype = ", subtype))
  
  #pathway_list="myel.3"
  #pathway_list<-names(pathways)
  
  Project_name=strsplit(outfile , split="/")[[1]][2]
  gsea_location=paste0("Results/",Project_name,"/GSEA-",gmt)
  gmt<-substr(gmt, 1, nchar(gmt)-4)
  NES_file=paste0(gsea_location,"/GSEA_",subtype,"_NES_",gmt,".csv")
  Pval_file=paste0(gsea_location,"/GSEA_",subtype,"_Pval_",gmt,".csv")
  
  NES<-read.csv(NES_file)
  Pval<-read.csv(Pval_file)
  rownames(NES)<-NES$X
  rownames(Pval)<-Pval$X
  ####### FILTER ONLY *IMMUN* ##########################
  #NES<-subset(NES, (str_detect(NES[,1], "IMMUN")))
  #Pval<-subset(Pval, (str_detect(Pval[,1], "IMMUN")))
  ######################################################
  NES<-NES[-1]
  Pval<-Pval[-1]
  datasets <- colnames(NES)[-length(NES)]
  
  ######### GET COHORT NUMBERS ################
  n<-get.cohort.numbers()
  n<-as.data.frame(n) %>% filter(row.names(n) %in% (datasets))
  rownames(n)<-datasets
  
  ###############################################
  
  NES_text=paste0(subtype,"_NES_AVE")
  Pval_text=paste0(subtype,"_Pval_AVE")
  
  if (pathway_list=="EXTREMES"){
    
    ######## Get best pathways to look at for up/down plots ###########
    top_10_NES <- NES[order(-NES[[NES_text]]),][1:10,]
    top_10_Pval<-Pval[order(-NES[[NES_text]]),][1:10,]
    Highest <-row.names(top_10_Pval[order(top_10_Pval[[Pval_text]]),][1,])
    
    
    bottom_10_NES <-NES[order(NES[[NES_text]]),][1:10,]
    bottom_10_Pval<-Pval[order(NES[[NES_text]]),][1:10,]
    Lowest <-row.names(bottom_10_Pval[order(bottom_10_Pval[[Pval_text]]),][1,])
    
    Most_uncertain<-row.names(Pval[order(-Pval[[Pval_text]]),][1,])
    Most_certain<-row.names(Pval[order(Pval[[Pval_text]]),][1,])
    
    pathway_list<-c(Highest,Lowest)
  }
  
  for(pathway in pathway_list){
    
    for (cohorts in rownames(n)){
      if (is.na(NES[pathway,cohorts])){
        n[cohorts,subtype]=0
      }
    }
    ########## Forrest plot ############################
    c1<-t(n[,subtype])
    c2<-NES[pathway,-length(NES)]
    #c2[is.na(c2)] <- 0 #show NA as a dot at 0
    c3<-Pval[pathway,-length(Pval)]
    
    c2<-round(as.numeric(c2),digits=2)
    c3<-as.numeric(c3)
    
    c1_mean<-sum(c1, na.rm = TRUE)
    c2_mean<-round(NES[pathway,length(NES)],digits=2)
    c3_mean<-Pval[pathway,length(Pval)]
    ############## colours ##################
    # boxcolors <- c()
    # for(items in c2){
    #   if(is.na(items)){
    #     next
    #   }
    #   if(items < 0) {
    #     boxcolors <- c(boxcolors, "#91bfdb")
    #   } else if(items > 0){
    #     boxcolors <- c(boxcolors, "#fc8d59")
    #   } else {
    #     boxcolors <- c(boxcolors, "grey50")
    #   }
    # }
    # 
    # c_fn <- local({
    #   i = 0
    #   col =  boxcolors
    #   function(..., clr.line, clr.marker){
    #     i <<- i + 1
    #     fpDrawCircleCI(..., clr.line = col[i], clr.marker = col[i])
    #   }
    # })
    # ### ave colours
    # if(is.na(c2_mean)){
    #   c2_mean=0
    # }
    # 
    # if(c2_mean > 0) {
    #   diamond_color <- "red"
    # } else if(c2_mean < 0) {
    #   diamond_color <- "blue"
    # } else {
    #   diamond_color <- "grey30"
    # }
    # 
    # c_fn1 <- local({
    #   i = 0
    #   clr = diamond_color
    #   function(..., col){
    #     i <<- i + 1
    #     fpDrawDiamondCI(...,clr.marker=clr[i], clr.line=clr[i])
    #   }
    # })
    ###########################
    
    forrest_data <- 
      structure(list(
        mean  = c( NA, c2,      NA, c2_mean), 
        lower = c( NA, c2-0.01, NA, c2_mean-0.01),
        upper = c( NA, c2+0.01, NA, c2_mean+0.01)),
        .Names = c("mean", "lower", "upper"), 
        row.names = c(NA, -length(c2)-3), 
        class = "data.frame")
    
    tabletext<-cbind(
      c("Dataset", as.matrix(t(datasets)), NA, "Overall"),
      c("N",c1, NA, c1_mean),
      c("NES",c2, NA, c2_mean),
      c("P Value",formatC(c3, format = "e", digits = 1), NA, formatC(c3_mean, format = "e", digits = 1)))
    
    ifelse(!dir.exists(file.path(outfile, pathway)), dir.create(file.path(outfile, pathway)), FALSE)
    
    write.csv(forrest_data, paste0(outfile,"/",pathway,"/",pathway,"_",subtype,".csv"))
    write.csv(tabletext, paste0(outfile,"/",pathway,"/",pathway,"_",subtype,"_","tabletext",".csv"))
    
    # png(file = paste0(outfile,"/",pathway,"/",pathway,"_",subtype,".png"), width = 700, height = 350) 
    # forestplot(tabletext, 
    #            hrzl_lines = gpar(col="#444444"),
    #            forrest_data,new_page = TRUE,
    #            is.summary=c(TRUE,rep(FALSE,length(datasets)+1),TRUE), #bold first 2 and last line
    #            clip=c(-5,5), 
    #            boxsize=c(0,sqrt(unlist(n[subtype]/sum(n[subtype]))*10),0,max(sqrt(unlist(n[subtype]/sum(n[subtype]))*10))),
    #            xlog=FALSE, 
    #            title=paste0("Subtype: ",subtype,"\n Gene set: ",pathway),
    #            fn.ci_norm=c_fn,  fn.ci_sum=c_fn1,
    #            zero = c(-0.5,0.5),
    #            lwd.zero=2,
    #            col=fpColors(text="black")
    # )
    # dev.off() 
  }
}



make.forest.plot <- function(subtype="ALL",pathway_list=c("EXTREMES"), gmt="c7.all.v7.0.entrez.gmt",outfile="Results/"){
  print(paste0("Subtype = ", subtype))
  
  #pathway_list="myel.3"
  #pathway_list<-names(pathways)
  
  
  
  Project_name=strsplit(outfile , split="/")[[1]][2]
  gsea_location=paste0("Results/",Project_name,"/GSEA-",gmt)
  gmt<-substr(gmt, 1, nchar(gmt)-4)
  NES_file=paste0(gsea_location,"/GSEA_",subtype,"_NES_",gmt,".csv")
  Pval_file=paste0(gsea_location,"/GSEA_",subtype,"_Pval_",gmt,".csv")
  
  
  NES<-read.csv(NES_file)
  Pval<-read.csv(Pval_file)
  rownames(NES)<-NES$X
  rownames(Pval)<-Pval$X
  ####### FILTER ONLY *IMMUN* ##########################
  #NES<-subset(NES, (str_detect(NES[,1], "IMMUN")))
  #Pval<-subset(Pval, (str_detect(Pval[,1], "IMMUN")))
  ######################################################
  NES<-NES[-1]
  Pval<-Pval[-1]
  datasets <- colnames(NES)[-length(NES)]
  
  ######### GET COHORT NUMBERS ################
  n<-get.cohort.numbers()
  n<-as.data.frame(n) %>% filter(row.names(n) %in% (datasets))
  rownames(n)<-datasets
  

  ###############################################
  
  NES_text=paste0(subtype,"_NES_AVE")
  Pval_text=paste0(subtype,"_Pval_AVE")
  
  if (pathway_list=="EXTREMES"){
    
    
    
    ######## Get best pathways to look at for up/down plots ###########
    top_10_NES <- NES[order(-NES[[NES_text]]),][1:10,]
    top_10_Pval<-Pval[order(-NES[[NES_text]]),][1:10,]
    Highest <-row.names(top_10_Pval[order(top_10_Pval[[Pval_text]]),][1,])
    
    
    bottom_10_NES <-NES[order(NES[[NES_text]]),][1:10,]
    bottom_10_Pval<-Pval[order(NES[[NES_text]]),][1:10,]
    Lowest <-row.names(bottom_10_Pval[order(bottom_10_Pval[[Pval_text]]),][1,])
    
    Most_uncertain<-row.names(Pval[order(-Pval[[Pval_text]]),][1,])
    Most_certain<-row.names(Pval[order(Pval[[Pval_text]]),][1,])
  
    pathway_list<-c(Highest,Lowest)
  }

  for(pathway in pathway_list){
    
    for (cohorts in rownames(n)){
      if (is.na(NES[pathway,cohorts])){
        n[cohorts,subtype]=0
      }
    }
    ########## Forrest plot ############################
    c1<-t(n[,subtype])
    c2<-NES[pathway,-length(NES)]
    #c2[is.na(c2)] <- 0 #show NA as a dot at 0
    c3<-Pval[pathway,-length(Pval)]
    
    c2<-round(as.numeric(c2),digits=2)
    c3<-as.numeric(c3)
    
    c1_mean<-sum(c1, na.rm = TRUE)
    c2_mean<-round(NES[pathway,length(NES)],digits=2)
    c3_mean<-Pval[pathway,length(Pval)]
    ############## colours ##################
    boxcolors <- c()
    for(items in c2){
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
    if(is.na(c2_mean)){
      c2_mean=0
    }
    
    if(c2_mean > 0) {
      diamond_color <- "red"
    } else if(c2_mean < 0) {
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
        mean  = c( NA, c2,      NA, c2_mean), 
        lower = c( NA, c2-0.01, NA, c2_mean-0.01),
        upper = c( NA, c2+0.01, NA, c2_mean+0.01)),
        .Names = c("mean", "lower", "upper"), 
        row.names = c(NA, -length(c2)-3), 
        class = "data.frame")
    
    tabletext<-cbind(
      c("Dataset", as.matrix(t(datasets)), NA, "Overall"),
      c("N",c1, NA, c1_mean),
      c("NES",c2, NA, c2_mean),
      c("P Value",formatC(c3, format = "e", digits = 1), NA, formatC(c3_mean, format = "e", digits = 1)))
    
    
    ifelse(!dir.exists(file.path(outfile, pathway)), dir.create(file.path(outfile, pathway)), FALSE)
    png(file = paste0(outfile,"/",pathway,"/",pathway,"_",subtype,".png"), width = 700, height = 350) 
    forestplot(tabletext, 
               hrzl_lines = gpar(col="#444444"),
               forrest_data,new_page = TRUE,
               is.summary=c(TRUE,rep(FALSE,length(datasets)+1),TRUE), #bold first 2 and last line
               clip=c(-5,5), 
               boxsize=c(0,sqrt(unlist(n[subtype]/sum(n[subtype]))*10),0,max(sqrt(unlist(n[subtype]/sum(n[subtype]))*10))),
               xlog=FALSE, 
               title=paste0("Subtype: ",subtype,"\n Gene set: ",pathway),
               fn.ci_norm=c_fn,  fn.ci_sum=c_fn1,
               zero = c(-0.5,0.5),
               lwd.zero=2,
               col=fpColors(text="black")
    )
    dev.off() 
  }
}

