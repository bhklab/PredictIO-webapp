csv.to.gmt <- function(filename="Lapointe-tfh.csv"){
  library(org.Hs.eg.db)
  library("tools")
  hs <- org.Hs.eg.db
  
  fiel_no_ext<-file_path_sans_ext(filename)
  
  df <- read.csv(filename, header = TRUE, stringsAsFactors=F, sep=",")
  
  
  list_names<-names(df)
  
  
  for (i in 1:length(df)){
    genes<-AnnotationDbi::select(hs, 
                                 keys = df[,i],
                                 columns = c("ENTREZID", "SYMBOL"),
                                 keytype = "SYMBOL")
    
    out_line<-paste(c(list_names[i], "Converted_from_CSV"),collapse = "\t")
    for (gene in genes[[2]]){
      if (!is.na(gene)){
        out_line<-paste(c(out_line, gene), collapse = "\t")
      }
    } 
    if (i==1){
      write(out_line,file=paste0(fiel_no_ext,".gmt"),append=FALSE)
    }else{
      write(out_line,file=paste0(fiel_no_ext,".gmt"),append=TRUE)
    }
  }
}
# csv.to.gmt(filename="Lapointe-tfh.csv")
