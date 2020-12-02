#####
# A script used to extract 'result' folder from each raw dataset, and parse CSV files into database seed files.
# Raw dataset can be obtained from 'IO Meta Analysis' capsule in CodeOcean: https://codeocean.com/capsule/6711882/tree ('raw_data' folder)

library(stringr)

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


##### create clinical_info seed file
colnames_clin <- c("dataset_id", "patient", "sex", "age", "primary", "histo", "stage", "response.other.info", "recist", "response", "drug_type", "dna", "rna", "t.pfs", "pfs", "t.os", "os")
clinical_info <- data.frame(matrix(ncol=length(colnames_clin), nrow=0))
colnames(clinical_info) <- colnames_clin

for(result in results){
  df <- read.csv(paste0(result, '/CLIN.csv'), sep=';', header=T)
  df <- cbind(dataset_id=tolower(str_remove(result, 'results/')), df)
  if(!'response.other.info' %in% names(df)){
    df$response.other.info <- NA
  }
  clinical_info <- rbind(clinical_info, df)
}

rownames(clinical_info) <- paste0(clinical_info$dataset_id, '_', clinical_info$patient)

##### create cna_features seed file
colnames_cna_features <- c("dataset_id", "patient", 'cna_tot', 'amp', 'del')
cna_features <- data.frame(matrix(ncol=length(colnames_cna_features), nrow=0))
colnames(cna_features) <- colnames_cna_features

for(result in results){
  files <- list.files(result, recursive=FALSE)
  if('CNA_Features.csv' %in% files){
    df <- read.csv(paste0(result, '/CNA_Features.csv'), sep=';', header=T)
    df <- cbind(dataset_id=tolower(str_remove(result, 'results/')), df)
    cna_features <- rbind(cna_features, df)
  }
}

rownames(cna_features) <- paste0(cna_features$dataset_id, '_', cna_features$patient)

##### create snv_features seed file
colnames_snv_features <- c("dataset_id", "patient", 'nsTMB_perMb', 'indel_TMB_perMb', 'indel_nsTMB_perMb')
snv_features <- data.frame(matrix(ncol=length(colnames_snv_features), nrow=0))
colnames(snv_features) <- colnames_snv_features

for(result in results){
  files <- list.files(result, recursive=FALSE)
  if('SNV_Features.csv' %in% files){
    df <- read.csv(paste0(result, '/SNV_Features.csv'), sep=';', header=T)
    df$patient <- rownames(df)
    df <- df[, c('patient', 'nsTMB_perMb', 'indel_TMB_perMb', 'indel_nsTMB_perMb')]
    df <- cbind(dataset_id=tolower(str_remove(result, 'results/')), df)
    snv_features <- rbind(snv_features, df)
  }
}

rownames(snv_features) <- paste0(snv_features$dataset_id, '_', snv_features$patient)


##### create expression seed file
colnames_expression <- c("dataset_id", "gene_id", "patient", "exp_value")
expression <- data.frame(matrix(ncol=length(colnames_expression), nrow=0))
colnames(expression) <- colnames_expression

##### create cna seed file

##### create snv seed file

##### create genes seed file