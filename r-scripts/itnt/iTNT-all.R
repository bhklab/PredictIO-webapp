wd <- paste0(getwd(), '/r-scripts/itnt')
setwd(wd)

# Load in all functions
source("functions/function-GSEA.R")
source("functions/function-get_numbers.R")
# source("functions/function-ci_heatmap.R")
# source("functions/function-forest_ci_meta.R")
source("functions/function-forest_plots.R")
# source("functions/function-survival_heatmap.R")
# source("functions/function-network_plot.R")
source("functions/function-csv_to_gmt.R")

# general-use libraries
library(stringr)
library(tidyverse)
library(data.table)

# analysis-specific libraries
library(fgsea)
library(survcomp)

# app-specific libraries
library(jsonlite)

run <- function(){
    
    # set ovaian subtypes and load in MetaGXOvarian data
    subtypes<-c("ALL","DIF","MES","IMR","PRO")
    # esets<- MetaGxOvarian::loadOvarianEsets()[[1]]

    # Name the project.  Right now this will serve as name of the input .csv/.gmt file
    project_name<-"test"
    gmt=paste0(project_name,".gmt")
    csv=paste0(project_name,".csv")

    # Convert the input .csv into a .gmt file format
    csv.to.gmt(filename=csv)

    # Take .gmt and read in the gene lists as pathways
    pathways<-gmtPathways(gmt)
    pathway_list<-names(pathways)

    geneset_forestplot=TRUE

    ###############################################################################
    #  Turn on/off loops for genereating plots (T/F) and set any variables for them ###############################################################################
    gsea<-FALSE
    #-----------------------
    geneset_forestplot=TRUE
    #-----------------------
    ci_heatmap=TRUE
    #-----------------------
    # patient_survival=F # obsolete
    patient_survival_annotated=T # current
    # patient_survival_annotated.sc=F # specalized for that one time for Myra
    dataset="TCGAOVARIAN"
    pathway="tfh_Brad"
    leadingEdge=FALSE
    #-----------------------
    gene_forestplot=T
    gene=("CXCL13")
    #-----------------------
    network_plot=T
    ref_gmt_file="c7.all.v7.0.entrez.gmt"
    
    ###############################################################################
    # Create project folder
    ###############################################################################
    ifelse(!dir.exists(file.path("Results/", project_name)), dir.create(file.path("Results", project_name)), FALSE)
    file.copy(gmt, paste0("Results/", project_name),, overwrite = TRUE)
    ###############################################################################

    ###############################################################################
    # GSEA
    ###############################################################################
    if (gsea==TRUE){
        ifelse(!dir.exists(file.path(paste0("Results/",project_name), paste0("GSEA-",gmt))), dir.create(file.path(paste0("Results/",project_name), paste0("GSEA-",gmt))), FALSE)
        for (subtype in subtypes){
            output.gsea(subtype=subtype, gmt=gmt, outdir=paste0("Results/",project_name,"/GSEA-",gmt,"/"))
            combine.gsea(gmt=gmt,outdir=paste0("Results/",project_name, "/"))
        }
    }

    ###############################################################################
    #Make forest plot for whole geneset  
    ###############################################################################
    if (geneset_forestplot==TRUE){
        print("Making forestplot for geneset")
        ifelse(!dir.exists(file.path(paste0("Results/",project_name), paste0("GENESET-FORESTPLOTS"))), dir.create(file.path(paste0("Results/",project_name), paste0("GENESET-FORESTPLOTS"))), FALSE)
    
        for (subtype in subtypes){
            make.forest.plot.data(
                subtype=subtype, 
                pathway_list = pathway_list, 
                gmt=gmt,
                outfile=paste0("Results/",project_name, "/GENESET-FORESTPLOTS"))
        }
    }
    return('finish run')
}

tryCatch({
    run()
}, error=function(c){
    errorOut <- list(
        "error"=TRUE,
        "message"=c$message
    )
    jsonError <- jsonlite::toJSON(errorOut)
    return(jsonError)
})

