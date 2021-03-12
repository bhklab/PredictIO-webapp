survival.heatmap <- function(dataset="TCGAOVARIAN", ov_type="ALL", gmt="FAP_HL.gmt", pathway="FAP_HIGH",leadingEdge=TRUE,patients="all"){
  
  data_dir = "../data/"
  
  hs <- org.Hs.eg.db
  #pathways<-gmtPathways(gmt)
  pathway=pathways[pathway]
  
  ############# GSEA #################
  rnk_file <- read_delim(paste0(data_dir,dataset,"/OV2_",tolower(dataset),"_consensusov_",ov_type,"_consensus.rnk"), "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
  
  formatted_data<-(column_to_rownames(rnk_file,"Entrez.ID"))
  formatted_data<-array(unlist(formatted_data, use.names = FALSE))
  rownames(formatted_data)<-rnk_file[[1]]
  
  options(warn=-1)
  fgseaRes <- fgsea(pathway, formatted_data, minSize = 1, maxSize = 200, nperm=10000)
  options(warn=-0)
   ####################################
  
  
  ############# CLINICAL ###################################
  subtype<-read.table(paste0(data_dir,dataset,"/OV_",tolower(dataset),"_subtype.txt"), header= TRUE, sep="\t",stringsAsFactors=FALSE)
  if (ov_type=="ALL"){
    subtype<-read.table(paste0(data_dir,dataset,"/OV_",tolower(dataset),"_subtype_ALL.txt"), header= TRUE, sep="\t",stringsAsFactors=FALSE)
  }
  cohort=esets[[dataset]]
  entrez_ids <- fData(cohort)$EntrezGene.ID
  
  gene_expr <- data.frame(entrez_ids = entrez_ids, best_probe = fData(cohort)$best_probe, expr = exprs(cohort))
  trimmed_gene_expr<-gene_expr %>% filter(best_probe ==TRUE) # take away any non "best_probeset" gene counts
  gene_expr_t<- as.data.frame(t(as.matrix(trimmed_gene_expr)))
  
  clinical <- data.frame(name = colnames(gene_expr[-1:-2]),
                         os = cohort$days_to_death,
                         os_deceased = as.character(cohort$vital_status),
                         subtype = subtype$consensusov, stringsAsFactors = FALSE)
  rownames(clinical)<-clinical$name
  clinical<-rbind(c(0,0,0,0),c(0,0,0,0),clinical)
  combined_data<-cbind(clinical,gene_expr_t)
  ###########################################################
  
  
  ########## FILTER OV_TYPE/DECEASED AND SORT BY DAYS TO DEATH #########
  if (patients=="deceased"){
    trimmed_data<-combined_data %>% filter(subtype==paste0(ov_type,"_consensus")) %>% filter(os_deceased=="deceased")
  }else{
    trimmed_data<-combined_data %>% filter(subtype==paste0(ov_type,"_consensus"))
  }
  trimmed_data<-trimmed_data[order(trimmed_data$os),]
  trimmed_data<- as.data.frame(t(as.matrix(trimmed_data[-1:-4])))
  ######################################################################
  
  ################ FILTER FOR LEADING EDGE GENES ################################
  temp<-cbind(as.numeric(as.character(trimmed_gene_expr$entrez_ids)),trimmed_data)
  if(leadingEdge==TRUE){
    temp<-temp %>% filter(as.numeric(as.character(trimmed_gene_expr$entrez_ids)) %in% as.integer(fgseaRes$leadingEdge[[1]])) #leading edge
  }else{
    temp<-temp %>% filter(as.numeric(as.character(trimmed_gene_expr$entrez_ids)) %in% as.integer(as.character(pathway[[1]]))) #all
  }
  
  rownames(temp)<-temp$`as.numeric(as.character(trimmed_gene_expr$entrez_ids))`
  ##############################################################################
  
  
  ######################### divide by average###################################
  heatmapmatrix<-as.matrix(temp[-1])
  heatmapmatrix_normalized<-as.matrix(temp[-1])
  class(heatmapmatrix) <- "numeric"
  class(heatmapmatrix_normalized) <- "numeric"
  for(i in seq(1, nrow(heatmapmatrix), 1)){
    for(j in seq(1, ncol(heatmapmatrix), 1)){
      heatmapmatrix_normalized[i,j]<-(heatmapmatrix[i,j]-mean(heatmapmatrix[i,]))
    }
  }
  ##############################################################################
  
  ######################## Convert back to human readable gene names  ########################################
  my.symbols <- rownames(heatmapmatrix_normalized)
  gene_names<-AnnotationDbi::select(hs, keys = my.symbols, columns = c("ENTREZID", "SYMBOL"), keytype = "ENTREZID")[2]
  rownames(heatmapmatrix_normalized)<-gene_names$SYMBOL
  ##############################################################################
  
  
  ######################## HEATMAP #############################################
  col_fun = colorRamp2(c(-3,0, 3), c("blue", "grey", "red"))
  col_fun(seq(-3, 3))
  
  #png(file = paste0(dataset,"(",ov_type,") - ",names(pathway),".png"), width = 700, height = 350)

  p<-Heatmap(heatmapmatrix_normalized,#[1:30,], 
          column_title = paste0(dataset,"(",ov_type,") - ",names(pathway)), 
          cluster_rows = TRUE, 
          cluster_columns = FALSE, 
          col = col_fun,  
          row_title_side = "left", 
          name="GE",
          show_column_dend = FALSE,
          show_row_dend = FALSE,
          show_column_names = FALSE)
  ##############################################################################
  #dev.off()
  return(p)
  ####################### PATIENT SURVIVAL TIMELINE ##########################################
  #clinical_trimmed<-clinical %>% filter(subtype==paste0(ov_type,"_consensus")) %>% filter(os_deceased=="deceased")
  #ggplot(data=clinical_trimmed) +
  #  geom_segment(aes(x=os, xend=os+10, y=0., yend=0., color=os_deceased) , linetype=1, size=4) +
  #  xlab("Time")+
  #  theme_minimal() + theme(panel.grid.minor = element_blank(), panel.grid.major =   element_blank(), axis.title.y=element_blank(),axis.text.x=element_blank(),axis.text.y=element_blank(),  axis.ticks.y=element_blank()) +
  #  theme(aspect.ratio = .2)+
  #  ggtitle(paste0("Patient survival time for ",ov_type,"_",dataset))
  
}

survival.heatmap.annotated <- function(dataset="TCGAOVARIAN", ov_type="DIF", gmt="FAP_HL.gmt", pathway="FAP_HIGH",patients="all"){
  
  data_dir = "../data/"
  
  #gmt="test.gmt"
  #pathway="NK_2"
  hs <- org.Hs.eg.db
  pathways<-gmtPathways(gmt)
  pathway_name=pathways[pathway]
  
  ############# GSEA #################
  rnk_file <- read_delim(paste0(data_dir,dataset,"/OV2_",tolower(dataset),"_consensusov_",ov_type,"_consensus.rnk"), "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
  
  formatted_data<-(column_to_rownames(rnk_file,"Entrez.ID"))
  formatted_data<-array(unlist(formatted_data, use.names = FALSE))
  rownames(formatted_data)<-rnk_file[[1]]
  
  options(warn=-1)
  fgseaRes <- fgsea(pathway_name, formatted_data, minSize = 1, maxSize = 1000, nperm=10000)
  options(warn=-0)
  
  ############# CLINICAL ###################################
  subtype<-read.table(paste0(data_dir,dataset,"/OV_",tolower(dataset),"_subtype.txt"), header= TRUE, sep="\t",stringsAsFactors=FALSE)
  if (ov_type=="ALL"){
    subtype<-read.table(paste0(data_dir,dataset,"/OV_",tolower(dataset),"_subtype_ALL.txt"), header= TRUE, sep="\t",stringsAsFactors=FALSE)
  }
  cohort=esets[[dataset]]
  entrez_ids <- fData(cohort)$EntrezGene.ID
  
  gene_expr <- data.frame(entrez_ids = entrez_ids, best_probe = fData(cohort)$best_probe, expr = exprs(cohort))
  trimmed_gene_expr<-gene_expr %>% filter(best_probe ==TRUE) # take away any non "best_probeset" gene counts
  #gene_expr_t<- as.data.frame(t(as.matrix(trimmed_gene_expr)))
  gene_expr_t<-transpose(trimmed_gene_expr)
  rownames(gene_expr_t)<-colnames(trimmed_gene_expr)
  colnames(gene_expr_t)<-rownames(trimmed_gene_expr)
  
  clinical <- data.frame(name = colnames(gene_expr[-1:-2]),
                         os = cohort$days_to_death,
                         os_deceased = as.character(cohort$vital_status),
                         stage= cohort$tumorstage,
                         grade = cohort$grade,
                         age= cohort$age_at_initial_pathologic_diagnosis,
                         recurrance = cohort$days_to_tumor_recurrence,
                         subtype = subtype$consensusov, stringsAsFactors = FALSE)
  rownames(clinical)<-clinical$name
  clinical<-rbind(c(0,0,0,0),c(0,0,0,0),clinical)
  combined_data<-cbind(clinical,gene_expr_t)
  ###########################################################
  
  
  ########## FILTER OV_TYPE/DECEASED AND SORT BY DAYS TO DEATH #########
  if (patients=="deceased"){
    trimmed_data<-as.numeric(as.character(trimmed_gene_expr$entrez_ids)) %>% filter(subtype==paste0(ov_type,"_consensus")) %>% filter(os_deceased=="deceased")
  }else{
    trimmed_data<-combined_data %>% filter(subtype==paste0(ov_type,"_consensus"))
  }
  trimmed_data<-trimmed_data[order(trimmed_data$os),]
  patient_time<-trimmed_data$os
  stage <-trimmed_data$stage
  grade <- trimmed_data$grade
  age <- trimmed_data$age
  reoccurance <- trimmed_data$recurrance
  reoccurance<-reoccurance>182
  patient_status<-c()
  for (times in patient_time){
    if (is.na(times)){
      patient_status<-c(patient_status, "NA")
    }
    else if (times<365*2){
      patient_status<-c(patient_status, "t<2")
    }
    else if (times<365*5){
      patient_status<-c(patient_status, "2<t<5")
    }
    else if (times>365*5){
      patient_status<-c(patient_status, "t>5")
    }
    else{
      patient_status<-c(patient_status, NA)
    }
       
  }
  

  trimmed_data<- as.data.frame(t(as.matrix(trimmed_data[-1:-8])))
  
  ######################################################################

  ################ FILTER FOR LEADING EDGE GENES ################################
  temp<-cbind(as.numeric(as.character(trimmed_gene_expr$entrez_ids)),trimmed_data)
  
  temp<-temp %>% filter(as.numeric(as.character(trimmed_gene_expr$entrez_ids)) %in% as.integer(as.character(pathway_name[[1]]))) #all
  
  rownames(temp)<-temp$`as.numeric(as.character(trimmed_gene_expr$entrez_ids))`
  ##############################################################################
  
  ######################### divide by average###################################
  heatmapmatrix<-as.matrix(temp[-1])
  heatmapmatrix_normalized<-as.matrix(temp[-1])
  class(heatmapmatrix) <- "numeric"
  class(heatmapmatrix_normalized) <- "numeric"
  for(i in seq(1, nrow(heatmapmatrix), 1)){
    for(j in seq(1, ncol(heatmapmatrix), 1)){
      heatmapmatrix_normalized[i,j]<-(heatmapmatrix[i,j]-mean(heatmapmatrix[i,]))
    }
  }
  ##############################################################################
  
  ########################## GET CI FROM FILES #################################
  CI_values <- read_delim(paste0(data_dir,dataset,"/OV2_",tolower(dataset),"_consensusov_",ov_type,"_consensus.rnk"), "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
  CI_values <- CI_values %>% filter(as.numeric(as.character(CI_values$Entrez.ID)) %in% as.integer(as.character(pathway_name[[1]]))) #all
  
  CI_values_sorted<-c()
  for (names in rownames(heatmapmatrix_normalized)){
    for (i in 1:length(CI_values[[1]])){
      cis=CI_values[[1]][i]
      if (cis == names){
        CI_values_sorted<-c(CI_values_sorted, CI_values[[2]][i])
      }
    }
  }
  ##############################################################################
  
  ######################## Convert back to human readable gene names  ########################################
  my.symbols <- rownames(heatmapmatrix_normalized)
  gene_names<-AnnotationDbi::select(hs, keys = my.symbols, columns = c("ENTREZID", "SYMBOL"), keytype = "ENTREZID")[2]
  rownames(heatmapmatrix_normalized)<-gene_names$SYMBOL
  ################################ LEADING EDGE BIN VALUE ##############################################
  leading_edge_list<-AnnotationDbi::select(hs, keys = (fgseaRes$leadingEdge[[1]]), columns = c("ENTREZID", "SYMBOL"), keytype = "ENTREZID")[2]
  leading_edge_bin<-c()
  for (genes in gene_names$SYMBOL){
    if (genes %in% unlist(leading_edge_list)){
      leading_edge_bin<-c(leading_edge_bin, "TRUE")
    }else{
      leading_edge_bin<-c(leading_edge_bin, "FALSE")
    }
  }
  
  ######################## HEATMAP #############################################
  col_fun = colorRamp2(c(-3,0, 3), c("blue", "grey", "red"))
  col_fun(seq(-3, 3))
  

  top_annotation = HeatmapAnnotation(
    #age= age, 
    stage = stage, 
    grade = grade, 
    reoccurance=reoccurance,
    Survival_status = patient_status,
    annotation_name_side = "right",
    na_col = "grey",
    show_legend = T,
    annotation_legend_param = list(Survival_status = list(title = "Survival Time")),
    col=list(Survival_status= c("t<2" = "black", "2<t<5" = "grey", "t>5" = "white", "NA"="red"),
             reoccurance = c("TRUE"="black","FALSE"="white"),
             stage = c("1"="green","2"="cyan", "3"="blue", "4"="black"),
             grade = c("1"="green","2"="cyan", "3"="blue", "4"="black"))
    )
  
  #names(top_annotation)<-paste0("<",cutoff," years")
  
  col_fun2 = colorRamp2(c(0.4, 0.5, 0.6), c("green", "grey", "red"))
  gene_annotation = rowAnnotation(CI = CI_values_sorted, LE = leading_edge_bin, col = list(CI = col_fun2, LE = c("TRUE"="black","FALSE"="white")))
  
  p<-Heatmap(heatmapmatrix_normalized,
          column_title = paste0(dataset,"(",ov_type,") - ",names(pathway_name)), 
          cluster_rows = TRUE, 
          cluster_columns = TRUE, 
          col = col_fun,  
          row_title_side = "left", 
          name="GE",
          show_column_dend = FALSE,
          show_row_dend = FALSE,
          show_column_names = FALSE,
          top_annotation = top_annotation,
          right_annotation=gene_annotation)
  return(p)
}


survival.heatmap.annotated.sc <- function(dataset="TCGAOVARIAN", ov_type="DIF", gmt="FAP_HL.gmt", pathway="FAP_HIGH",patients="all"){
  
  data_dir = "../data/"
  
  #gmt="Lapointe-NK.gmt"
  #pathway="NK_2"
  hs <- org.Hs.eg.db
  pathways<-gmtPathways(gmt)
  pathway_name=pathways[pathway]
  

  
  ############# GSEA #################
  rnk_file <- read_delim(paste0(data_dir,dataset,"/OV2_",tolower(dataset),"_consensusov_",ov_type,"_consensus.rnk"), "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
  
  formatted_data<-(column_to_rownames(rnk_file,"Entrez.ID"))
  formatted_data<-array(unlist(formatted_data, use.names = FALSE))
  rownames(formatted_data)<-rnk_file[[1]]
  
  options(warn=-1)
  fgseaRes <- fgsea(pathway_name, formatted_data, minSize = 1, maxSize = 1000, nperm=10000)
  options(warn=-0)
  
  ############# CLINICAL ###################################
  subtype<-read.table(paste0(data_dir,dataset,"/OV_",tolower(dataset),"_subtype.txt"), header= TRUE, sep="\t",stringsAsFactors=FALSE)
  if (ov_type=="ALL"){
    subtype<-read.table(paste0(data_dir,dataset,"/OV_",tolower(dataset),"_subtype_ALL.txt"), header= TRUE, sep="\t",stringsAsFactors=FALSE)
  }
  cohort=esets[[dataset]]
  entrez_ids <- fData(cohort)$EntrezGene.ID
  
  gene_expr <- data.frame(entrez_ids = entrez_ids, best_probe = fData(cohort)$best_probe, expr = exprs(cohort))
  trimmed_gene_expr<-gene_expr %>% filter(best_probe ==TRUE) # take away any non "best_probeset" gene counts
  #gene_expr_t<- as.data.frame(t(as.matrix(trimmed_gene_expr)))
  gene_expr_t<-transpose(trimmed_gene_expr)
  rownames(gene_expr_t)<-colnames(trimmed_gene_expr)
  colnames(gene_expr_t)<-rownames(trimmed_gene_expr)
  
  clinical <- data.frame(name = colnames(gene_expr[-1:-2]),
                         os = cohort$days_to_death,
                         os_deceased = as.character(cohort$vital_status),
                         stage= cohort$tumorstage,
                         grade = cohort$grade,
                         age= cohort$age_at_initial_pathologic_diagnosis,
                         recurrance = cohort$days_to_tumor_recurrence,
                         subtype = subtype$consensusov, stringsAsFactors = FALSE)
  rownames(clinical)<-clinical$name
  clinical<-rbind(c(0,0,0,0),c(0,0,0,0),clinical)
  combined_data<-cbind(clinical,gene_expr_t)
  ###########################################################
  
  
  ########## FILTER OV_TYPE/DECEASED AND SORT BY DAYS TO DEATH #########
  if (patients=="deceased"){
    trimmed_data<-as.numeric(as.character(trimmed_gene_expr$entrez_ids)) %>% filter(subtype==paste0(ov_type,"_consensus")) %>% filter(os_deceased=="deceased")
  }else{
    trimmed_data<-combined_data %>% filter(subtype==paste0(ov_type,"_consensus"))
  }
  trimmed_data<-trimmed_data[order(trimmed_data$os),]
  patient_time<-trimmed_data$os
  stage <-trimmed_data$stage
  grade <- trimmed_data$grade
  age <- trimmed_data$age
  reoccurance <- trimmed_data$recurrance
  reoccurance<-reoccurance>182
  patient_status<-c()
  for (times in patient_time){
    if (is.na(times)){
      patient_status<-c(patient_status, "NA")
    }
    else if (times<365*2){
      patient_status<-c(patient_status, "t<2")
    }
    else if (times<365*5){
      patient_status<-c(patient_status, "2<t<5")
    }
    else if (times>365*5){
      patient_status<-c(patient_status, "t>5")
    }
    else{
      patient_status<-c(patient_status, NA)
    }
    
  }
  
  
  trimmed_data<- as.data.frame(t(as.matrix(trimmed_data[-1:-8])))
  
  ######################################################################
  
  ################ FILTER FOR LEADING EDGE GENES ################################
  temp<-cbind(as.numeric(as.character(trimmed_gene_expr$entrez_ids)),trimmed_data)
  
  temp<-temp %>% filter(as.numeric(as.character(trimmed_gene_expr$entrez_ids)) %in% as.integer(as.character(pathway_name[[1]]))) #all
  
  rownames(temp)<-temp$`as.numeric(as.character(trimmed_gene_expr$entrez_ids))`
  ##############################################################################
  
  ######################### divide by average###################################
  heatmapmatrix<-as.matrix(temp[-1])
  heatmapmatrix_normalized<-as.matrix(temp[-1])
  class(heatmapmatrix) <- "numeric"
  class(heatmapmatrix_normalized) <- "numeric"
  for(i in seq(1, nrow(heatmapmatrix), 1)){
    for(j in seq(1, ncol(heatmapmatrix), 1)){
      heatmapmatrix_normalized[i,j]<-(heatmapmatrix[i,j]-mean(heatmapmatrix[i,]))
    }
  }
  ##############################################################################
  
  ########################## GET CI FROM FILES #################################
  CI_values <- read_delim(paste0(data_dir,dataset,"/OV2_",tolower(dataset),"_consensusov_",ov_type,"_consensus.rnk"), "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
  CI_values <- CI_values %>% filter(as.numeric(as.character(CI_values$Entrez.ID)) %in% as.integer(as.character(pathway_name[[1]]))) #all
  
  CI_values_sorted<-c()
  for (names in rownames(heatmapmatrix_normalized)){
    for (i in 1:length(CI_values[[1]])){
      cis=CI_values[[1]][i]
      if (cis == names){
        CI_values_sorted<-c(CI_values_sorted, CI_values[[2]][i])
      }
    }
  }
  ##############################################################################
  
  ######################## Convert back to human readable gene names  ########################################
  my.symbols <- rownames(heatmapmatrix_normalized)
  gene_names<-AnnotationDbi::select(hs, keys = my.symbols, columns = c("ENTREZID", "SYMBOL"), keytype = "ENTREZID")[2]
  rownames(heatmapmatrix_normalized)<-gene_names$SYMBOL
  ################################ LEADING EDGE BIN VALUE ##############################################
  leading_edge_list<-AnnotationDbi::select(hs, keys = (fgseaRes$leadingEdge[[1]]), columns = c("ENTREZID", "SYMBOL"), keytype = "ENTREZID")[2]
  leading_edge_bin<-c()
  for (genes in gene_names$SYMBOL){
    if (genes %in% unlist(leading_edge_list)){
      leading_edge_bin<-c(leading_edge_bin, "TRUE")
    }else{
      leading_edge_bin<-c(leading_edge_bin, "FALSE")
    }
  }
  
  ################ Import pct values ##############
  pct_file<-"Lapointe-NK-pct.csv"
  pct <- read_delim(pct_file, "\t", escape_double = FALSE, trim_ws = TRUE, col_types = cols())
  pct<- as.data.frame(pct)
  pct<-column_to_rownames(pct, var = "GENE")
  
  pct1_list<-c()
  pct2_list<-c()
  for (pcts in rownames(heatmapmatrix_normalized)){
    #print(pcts)
    pct1_list<-c(pct1_list, pct[pcts,"pct.1"])
    pct2_list<-c(pct2_list, pct[pcts,"pct.2"])
  }
  #################################################
  
  ######################## HEATMAP #############################################
  col_fun = colorRamp2(c(-3,0, 3), c("blue", "grey", "red"))
  col_fun(seq(-3, 3))
  
  col_fun3 = colorRamp2(c(0,0.5, 1), c("blue", "grey", "red"))
  col_fun3(seq(0, 1))
  
  
  top_annotation = HeatmapAnnotation(
    #age= age,
    stage = stage, 
    grade = grade, 
    reoccurance=reoccurance,
    Survival_status = patient_status,
    annotation_name_side = "right",
    na_col = "grey",
    show_legend = T,
    annotation_legend_param = list(Survival_status = list(title = "Survival Time")),
    col=list(Survival_status= c("t<2" = "black", "2<t<5" = "grey", "t>5" = "white", "NA"="red"),
             reoccurance = c("TRUE"="black","FALSE"="white"),
             stage = c("1"="green","2"="cyan", "3"="blue", "4"="black"),
             grade = c("1"="green","2"="cyan", "3"="blue", "4"="black"))
  )
  
  #names(top_annotation)<-paste0("<",cutoff," years")
  
  col_fun2 = colorRamp2(c(0.4, 0.5, 0.6), c("green", "grey", "red"))
  gene_annotation = rowAnnotation(CI = CI_values_sorted, 
                                  LE = leading_edge_bin,
                                  pct1 = pct1_list,
                                  pct2 = pct2_list,
                                  col = list(CI = col_fun2, LE = c("TRUE"="black","FALSE"="white"), pct1 = col_fun3, pct2 = col_fun3))
  
  p<-Heatmap(heatmapmatrix_normalized,
             column_title = paste0(dataset,"(",ov_type,") - ",names(pathway_name)), 
             cluster_rows = TRUE, 
             cluster_columns = TRUE, 
             col = col_fun,  
             row_title_side = "left", 
             name="GE",
             show_column_dend = FALSE,
             show_row_dend = FALSE,
             show_column_names = FALSE,
             top_annotation = top_annotation,
             right_annotation=gene_annotation)
  return(p)
}
