ci.heatmap <- function(subtype="PRO",gmt="FH_FL.gmt",pathway_name="FAP_LOW",outfile=paste0("Results/")){
  
  data_dir = "../data/"
  
  print (subtype)
  all_files <- list.files(path= data_dir, pattern="OV2_", recursive = TRUE)
  all_files<- all_files %>% str_subset(pattern = ".txt")
  all_files<- all_files %>% str_subset(pattern = subtype)
  datasets<-c()
  for(one_file in all_files){
    cohort_name<-strsplit(one_file , split="/")[[1]][1]
    datasets<-c(datasets,cohort_name)
  }
  
  
  
  pathways<-gmtPathways(gmt)
  pathway=pathways[[pathway_name]]
  
  ################################################################
  ci<-as.data.frame(datasets)
  for (gene in pathway){
    ci_temp<-c()
    for(one_file in all_files){
      one_file<-paste0(data_dir,one_file)
      cohort_name<-strsplit(one_file , split="/")[[1]][3]
      
      data <- read.table(one_file, header=T, sep="\t", stringsAsFactor=F)
      
      if (gene %in% data$Entrez.ID){
        data<-data %>% filter(data$Entrez.ID == gene)
        ci_temp <- rbind(ci_temp, data.frame(Cohort = cohort_name, CI = data$C.index, stringsAsFactors = FALSE)) 
      }else{
        ci_temp <- rbind(ci_temp, data.frame(Cohort = cohort_name, CI = NA, stringsAsFactors = FALSE)) 
      }
    }
    colnames(ci_temp)<-c("Cohort",gene)
    ci<-merge(x = ci, y = ci_temp, by.x = "datasets", by.y = "Cohort", all.x = T)
  }
  
  
  
  n<-get.cohort.numbers()
  n<-as.data.frame(n) %>% filter(row.names(n) %in% (datasets))
  rownames(n)<-datasets
  
  sigma_weights<-1/n[,subtype]
  
  rownames(ci)<-ci$datasets
  ci_matrix<-t(ci[,2:ncol(ci)])
  
  ##########################################################
  ci_average<-c()
  for (gene in  rownames(ci_matrix)){
    #ci_average[gene] = mean(ci_matrix[gene,], na.rm=TRUE)
    ci_average[gene]<-combine.est(unlist(ci_matrix[gene,]), sigma_weights, na.rm = TRUE)[[1]]
  }
  ci_matrix<-(cbind(ci_matrix,ci_average))
  ci_matrix <-ci_matrix[order(-ci_matrix[, ncol(ci_matrix)]),]
  ##########################################################
  
  
  
  ######################## Convert back to human readable gene names  ########################################
  my.symbols <- rownames(ci_matrix)
  gene_names<-AnnotationDbi::select(hs, keys = my.symbols, columns = c("ENTREZID", "SYMBOL"), keytype = "ENTREZID")[2]
  rownames(ci_matrix)<-gene_names$SYMBOL
  ci_matrix[is.na(ci_matrix)]<-0.5
  ##############################################################################
  
  
  ######################## HEATMAP #############################################
  col_fun = colorRamp2(c(0.25,0.5, 0.75), c("blue", "grey", "red"))
  #col_fun(seq(-3, 3))
  
  #png(file = paste0("FAP_LOW.png"), width = 700, height = 2000)
  
  p<-Heatmap(ci_matrix,#[1:30,], 
             column_title = paste0(pathway_name), 
             cluster_rows = FALSE, 
             cluster_columns = FALSE, 
             col = col_fun,  
             row_title_side = "left", 
             name="CI",
             show_column_dend = FALSE,
             show_row_dend = FALSE,
             show_column_names = TRUE)
  ##############################################################################
  #dev.off()
  write.csv(ci_matrix, paste0(outfile,"/ci_rank_",subtype,"_",pathway_name,".csv"), row.names = TRUE)
  return(p)
  
}