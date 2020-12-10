#####
# A script used to extract 'result' folder from each raw dataset, and parse CSV files into database seed files.
# Raw dataset can be obtained from 'IO Meta Analysis' capsule in CodeOcean: https://codeocean.com/capsule/6711882/tree ('raw_data' folder)

library(stringr)
library(tidyr)

##### copy all the fils in 'result' dir of each raw dataset directory.
dir.create('results')
dirs <- list.dirs('raw_data', recursive=FALSE)

lapply(dirs, function(dir){
  dest <- paste0('results/', str_remove(dir, 'raw_data/'))
  print(dest)
  dir.create(dest)
  files <- list.files(paste0(dir, '/result'), recursive=FALSE)
  file.copy(file.path(paste0(dir, '/result'), files), dest)
})

##### create dataset seed file
results <- list.dirs('results', recursive=FALSE)
dataset <- data.frame(matrix(ncol=1, nrow=length(results)))
colnames(dataset) <- c('dataset_id')

tmp <- lapply(results, function(result){
  return(tolower(str_remove(result, 'results/')))
})

dataset$dataset_id <- unlist(tmp)
dataset$expr <- 0
dataset$cna <- 0
dataset$snv <- 0

rownames(dataset) <- dataset$dataset_id

for(result in results){
  dataset_id <- tolower(str_remove(result, 'results/'))
  files <- list.files(result)
  if("EXPR.csv.gz" %in% files){
    dataset[dataset_id, 'expr'] <- 1
  }
  if("CNA_gene.csv.gz" %in% files){
    dataset[dataset_id, 'cna'] <- 1
  }
  if("SNV.csv.gz" %in% files){
    dataset[dataset_id, 'snv'] <- 1
  }
}


##### create clinical_info seed file
colnames_clin <- c("dataset_id", "patient", "sex", "age", "primary", "histo", "stage", "response.other.info", "recist", "response", "drug_type", "dna", "rna", 'expr', 'cna', 'snv')
clinical_info <- data.frame(matrix(ncol=length(colnames_clin), nrow=0))
colnames(clinical_info) <- colnames_clin

for(result in results){
  dataset_id <- tolower(str_remove(result, 'results/'))
  df_clin <- read.csv(paste0(result, '/CLIN.csv'), sep=';', header=T)
  df_seq <- read.csv(paste0(result, '/cased_sequenced.csv'), sep=';', header=T)
  
  df_clin <- cbind(dataset_id=dataset_id, df_clin)
  if(!'response.other.info' %in% names(df_clin)){
    df_clin$response.other.info <- NA
  }
  df_clin <- df_clin[, c("dataset_id", "patient", "sex", "age", "primary", "histo", "stage", "response.other.info", "recist", "response", "drug_type", "dna", "rna")]
  rownames(df_clin) <- paste0(df_clin$dataset_id, '_', df_clin$patient)
  df_clin$expr <- 0
  df_clin$cna <- 0
  df_clin$snv <- 0
  
  rownames(df_seq) <- paste0(dataset_id, '_', df_seq$patient)
  for(row in rownames(df_seq)){
    df_clin[row, 'expr'] <- df_seq[row, 'expr']
    df_clin[row, 'cna'] <- df_seq[row, 'cna']
    df_clin[row, 'snv'] <- df_seq[row, 'snv']
  }
  
  clinical_info <- rbind(clinical_info, df_clin)
}
colnames(clinical_info)[5] <- 'primary_tissue'
colnames(clinical_info)[8] <- 'response_other_info'
clinical_info <- clinical_info[!is.na(clinical_info$dataset_id), ]

##### create dataset_gene seed file
colnames_dataset_gene <- c('dataset_id', 'gene_id')
dataset_gene <- data.frame(matrix(ncol=length(colnames_dataset_gene), nrow=0))
colnames(dataset_gene) <- colnames_dataset_gene

for(result in results){
  dataset_id <- tolower(str_remove(result, 'results/'))
  ds_genes <- c()
  if(dataset[dataset_id, 'expr'] == 1){
    tmp <- read.csv(paste0(result, '/EXPR.csv.gz'), sep=';', header=T)
    expr_genes <- rownames(tmp)
    expr_genes <- expr_genes[validUTF8(expr_genes)]
    expr_genes <- expr_genes[grep('^[A-z0-9]{2,}', expr_genes)]
    ds_genes <- unique(c(ds_genes, expr_genes))
  }
  if(dataset[dataset_id, 'cna'] == 1){
    tmp <- read.csv(paste0(result, '/CNA_gene.csv.gz'), sep=';', header=T)
    cna_genes <- rownames(tmp)
    cna_genes <- cna_genes[validUTF8(cna_genes)]
    cna_genes <- cna_genes[grep('^[A-z0-9]{2,}', cna_genes)]
    ds_genes <- unique(c(ds_genes, cna_genes))
  }
  # if(dataset[dataset_id, 'snv'] == 1){
  #   tmp <- read.csv(paste0(result, '/SNV.csv.gz'), sep=';', header=T)
  #   snv_genes <- unique(tmp$Gene)
  #   cleaned_snv_genes <- c()
  #   for(gene in snv_genes){
  #     str <- str_split(gene, ', ')
  #     cleaned_snv_genes <- unique(c(cleaned_snv_genes, str[[1]]))
  #   }
  #   ds_genes <- unique(c(ds_genes, cleaned_snv_genes))
  # }
  
  
  
  tmp <- data.frame(matrix(ncol=length(colnames_dataset_gene), nrow=length(ds_genes)))
  colnames(tmp) <- colnames_dataset_gene
  tmp$dataset_id <- dataset_id
  tmp$gene_id <- ds_genes
  dataset_gene <- rbind(dataset_gene, tmp)
}



##### create gene seed file
unique_genes <- unique(dataset_gene$gene_id)
gene <- data.frame(matrix(ncol=1, nrow=length(unique_genes)))
colnames(gene) <- c('gene_id')
gene$gene_id <- unique_genes
rownames(gene) <- gene$gene_id

##### write dataframes to csv files
write.csv(dataset, 'csv/dataset.csv', row.names=F)
write.csv(gene, file='csv/gene.csv', row.names=F)
write.csv(dataset_gene, 'csv/dataset_gene.csv', row.names=F)
write.csv(clinical_info, 'csv/clinical_info.csv', row.names=F)

tmp <- read.csv('results/Liu/SNV.csv.gz', sep=';', header=T)
