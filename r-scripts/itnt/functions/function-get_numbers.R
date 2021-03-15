get.cohort.numbers <- function(){
  all_files <- list.files(path="../data", pattern="*subtype.txt", recursive = TRUE) # perform on all .rnk files in all dirs

  cohort_num<-length(all_files)

  DIF_count<-vector()
  MES_count<-vector()
  PRO_count<-vector()
  IMR_count<-vector()
  file_names<-vector()
  
  # count number of patients in each category in each cohort
  for(files in all_files){
    contentes<-read.table(paste0("../data/",files), header = TRUE, sep = "", dec = ".")
    file_names<-c(file_names, strsplit(files , split="/")[[1]][1] ) 
    DIF_count[files]<-0
    MES_count[files]<-0
    PRO_count[files]<-0
    IMR_count[files]<-0
    for(patients in contentes[[2]]){
      if(patients=="DIF_consensus"){
        DIF_count[files] <- DIF_count[files]+1
      } else if(patients=="MES_consensus"){
        MES_count[files] <- MES_count[files]+1
      } else if(patients=="PRO_consensus"){
        PRO_count[files] <- PRO_count[files]+1
      } else if(patients=="IMR_consensus"){
        IMR_count[files] <- IMR_count[files]+1
      }else{
        print("error")
      }
    }
  }
  
  #format data
  specie<- c(rep(file_names,4))
  subtype <- c(rep("DIF",length(file_names)),rep("MES",length(file_names)),rep("PRO",length(file_names)),rep("IMR",length(file_names)))
  
  
  
  
  
  #######################3
  value<-matrix(0, nrow=length(all_files), ncol = 5)
  row.names(value)<-file_names
  colnames(value)<-c("DIF","MES","PRO","IMR", "ALL")
  for (i in seq(1,length(all_files))){
    value[i,1]<- DIF_count[i][[1]]
    value[i,2]<- MES_count[i][[1]]
    value[i,3]<- PRO_count[i][[1]]
    value[i,4]<- IMR_count[i][[1]]
    value[i,5]<- sum(value[i,])
  }
  
  #### output data numbers ###################
  #write.csv(value,"cohort_numbers.txt", row.names = TRUE)
  return(value)
}





