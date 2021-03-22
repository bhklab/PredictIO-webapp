
output.gsea <- function(subtype="DIF", gmt="c7.all.v7.0.entrez_all.gmt",outdir="../data/GSEA_output/"){
  #gmt<-"Lapointe-NK.gmt"
  print(subtype)
  pathways<-gmtPathways(gmt)
  gmt<-substr(gmt, 1, nchar(gmt)-4)
  ######### GET COHORT NUMBERS ################
  n<-get.cohort.numbers()
  sigma<-1/(n)
  
  ######## perform GSEA and store ###########################################################################
  formatted_data<-list()
  GSEA_DIF<-list()
  
  all_files=rnk_files <- list.files(path="../data",pattern="*.rnk", recursive = TRUE) # get a list of all .rnk files in all dirs#
  all_files<-all_files[grepl(subtype, all_files)]
  
  GSEA_DIF_NES_matrix<-data.frame(pathway=names(pathways))
  GSEA_DIF_Pval_matrix<-data.frame(pathway=names(pathways))
  
  for(files in all_files){
    tryCatch({
      print(files)
      #files="PMID19318476/OV2_pmid19318476_consensusov_DIF_consensus.rnk"
      rnk_file <- read_delim(paste0("../data/",files), "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
      formatted_data[[files]]<-(column_to_rownames(rnk_file,"Entrez.ID"))
      formatted_data[[files]]<-array(unlist(formatted_data[[files]], use.names = FALSE))
      rownames(formatted_data[[files]])<-rnk_file[[1]]
      
      fgseaRes <- fgsea(pathways, formatted_data[[files]], minSize = 1, maxSize = 500, nperm=10000) #can choose specific pathways with pathways[1] or whatever
      
      fgseaRes_nes<-c(fgseaRes[,"pathway"],fgseaRes[,"NES"])
      names(fgseaRes_nes)<-c("pathway",files)
      fgseaRes_Pval<-c(fgseaRes[,"pathway"],fgseaRes[,"pval"])
      names(fgseaRes_Pval)<-c("pathway",files)
      
      GSEA_DIF_NES_matrix <- merge(x = GSEA_DIF_NES_matrix, y = fgseaRes_nes, by.x = "pathway", by.y = "pathway", all.x = T)
      GSEA_DIF_Pval_matrix <- merge(x = GSEA_DIF_Pval_matrix, y = fgseaRes_Pval, by.x = "pathway", by.y = "pathway", all.x = T)
    }, error=function(e){cat("ERROR :",conditionMessage(e), "\n")})
  }
  
  rownames(GSEA_DIF_NES_matrix)<-GSEA_DIF_NES_matrix[[1]]
  
  GSEA_DIF_NES_matrix<-GSEA_DIF_NES_matrix[-1]
  rownames(GSEA_DIF_Pval_matrix)<-GSEA_DIF_Pval_matrix[[1]]
  GSEA_DIF_Pval_matrix<-GSEA_DIF_Pval_matrix[-1]
  
  
  ######## Get/Set name of cohorts #########
  temp<-colnames(GSEA_DIF_NES_matrix)
  DIF_cohort_names<-c()
  for(names in temp){
    DIF_cohort_names<-c(DIF_cohort_names,toupper(strsplit(names , split="_")[[1]][2]))
  }
  colnames(GSEA_DIF_NES_matrix)<-DIF_cohort_names
  colnames(GSEA_DIF_Pval_matrix)<-DIF_cohort_names
  
  

  
  
  
  DIF_NES_AVE<-vector()
  DIF_Pval_AVE<-vector()
  temp_names<-vector()
  
  for(pathway_names in names(pathways)){
    #print(pathway_names)
    ########### COMBINE RESULTS ##################
    sigma_weights<-vector()
    n_weights<-vector()
    for(cohorts in colnames(GSEA_DIF_NES_matrix)){
      sigma_weights<-c(sigma_weights,sigma[cohorts,subtype])
      n_weights<-c(n_weights,n[cohorts,subtype])
    }
    ##### CHANGE SIGMA WEIGHTS IF THER IS NO NES AVAILAbl
    for (j in seq(1, length(GSEA_DIF_NES_matrix[pathway_names,]),1)){
      if(is.na(GSEA_DIF_NES_matrix[pathway_names,j])){
        sigma_weights[j]<-1
        n_weights[j]<-0
      }
    }
    ###################################################################################################3
    
    DIF_NES_AVE<-c(DIF_NES_AVE, combine.est(unlist(GSEA_DIF_NES_matrix[pathway_names,]), sigma_weights, na.rm = TRUE)[[1]]) 
    names(DIF_NES_AVE)[match(pathway_names,names(pathways))]<-pathway_names

    
    # if values are on other side of 0, make p value 1-pvalue
    test_input<-vector()
    
    for(cohorts in names(GSEA_DIF_Pval_matrix[pathway_names,])){
      if((is.na(GSEA_DIF_NES_matrix[pathway_names,cohorts])==FALSE) & (is.na(DIF_NES_AVE[pathway_names])==FALSE)){
        if ((GSEA_DIF_NES_matrix[pathway_names,cohorts]<0 & DIF_NES_AVE[pathway_names]>0)|(GSEA_DIF_NES_matrix[pathway_names,cohorts]>0 & DIF_NES_AVE[pathway_names]<0)){
          test_input <- c(test_input, 1 - (GSEA_DIF_Pval_matrix[pathway_names,cohorts]))
        } else{
          test_input <- c(test_input, (GSEA_DIF_Pval_matrix[pathway_names,cohorts]))
        }
      }else{
        test_input <- c(test_input, 0.5)
      }
    }
    test_input[test_input<0.0001]<-0.0001
    test_input[test_input>0.9999]<-0.9999
    
    ## debugging section
    #if (pathway_names=="NK_4"){
    #  print("inputs")
    #  print(test_input)
    #  print("n_w")
    #  print(n_weights)
    #  print("output")
    #  print(combine.test(test_input, n_weights, method = "z.transform", na.rm = TRUE))
    #}
      
    #DIF_Pval_AVE<-c(DIF_Pval_AVE, combine.test(GSEA_DIF_Pval_matrix[i,], n_weight, method = "fisher", na.rm = TRUE)) 
    DIF_Pval_AVE<-c(DIF_Pval_AVE, combine.test(test_input, n_weights, method = "z.transform", na.rm = TRUE)) 
    names(DIF_Pval_AVE)[match(pathway_names,names(pathways))]<-pathway_names
  }

  #GSEA_DIF_NES<-cbind(GSEA_DIF_NES_matrix, DIF_NES_AVE)
  #GSEA_DIF_Pval<-cbind(GSEA_DIF_Pval_matrix, DIF_Pval_AVE)
  
  GSEA_DIF_NES <- merge(x = GSEA_DIF_NES_matrix, y = DIF_NES_AVE, by = 0)
  GSEA_DIF_Pval <- merge(x = GSEA_DIF_Pval_matrix, y = DIF_Pval_AVE, by = 0)
  GSEA_DIF_NES<-column_to_rownames(GSEA_DIF_NES, var = "Row.names")
  GSEA_DIF_Pval<-column_to_rownames(GSEA_DIF_Pval, var = "Row.names")
  
  colnames(GSEA_DIF_NES)<-c(DIF_cohort_names,paste0(subtype,"_NES_AVE"))
  colnames(GSEA_DIF_Pval)<-c(DIF_cohort_names,paste0(subtype,"_Pval_AVE"))
  
  write.csv(GSEA_DIF_NES, paste0(outdir,"GSEA_",subtype,"_NES_",gmt,".csv"), row.names = TRUE)
  write.csv(GSEA_DIF_Pval, paste0(outdir,"GSEA_",subtype,"_Pval_",gmt,".csv"), row.names = TRUE)
}

#This function aggregates all of the results into a single output file GSEA_table.csv
combine.gsea <- function(gmt="c7.all.v7.0.entrez_all.gmt",outdir="../data/GSEA_output/"){

  all_files <- list.files(path=paste0(outdir,"GSEA-",gmt,"/"),pattern=".csv", recursive = TRUE) # get a list of all NES files in all dirs#
  pathways<-gmtPathways(gmt)
  result_table<- matrix(,length(pathways),0)
  
  
  for (files in all_files){
    temp<-read.csv(paste0(outdir,"GSEA-",gmt,"/", files), stringsAsFactors = F)
    result_table<- cbind(result_table,temp[ncol(temp)])
  }
  row.names(result_table)<-temp[[1]] 
  
  write.csv(result_table, paste0(outdir, "GSEA_table.csv"), row.names = TRUE)
}
