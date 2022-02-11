# app-specific libraries
library(jsonlite)

run <- function(input) {

	study = as.character( sapply( as.character( input[3] ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )

	sex = as.character( sapply( as.character( input[4] ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )

	if( sum( sex == c( "M" , "F" ) ) %in% 2 ) { sex = c( "M" , "F" , NA ) }

	primary = as.character( sapply( as.character( input[5] ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )
	drug_type = as.character( sapply( as.character( input[6] ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )
	data_type = as.character( input[7] )
	sequencing_type = as.character( sapply( as.character( input[8] ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )

	if( length( grep( ',' , as.character( input[9] ) ) ) ){
		gene = as.character( sapply( as.character( input[9] ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )
	} else{
		gene = as.character( input[9] )
	}

	output = network = KEGG_network = NULL

	if( length( gene ) %in% 1 ){

		if( data_type %in% "SNV" ){
			output = Get_Outcome_SNV_Gene( 
				study_type = study ,
				sex = sex ,  
				primary = primary ,  
				drug_type = drug_type ,  
				sequencing_type = sequencing_type ,  
				gene = gene 
			)
		}
		if( data_type %in% "CNA" ){
			output = Get_Outcome_CNA_Gene( 
				study_type = study ,
				sex = sex ,  
				primary = primary ,  
				drug_type = drug_type ,  
				sequencing_type = sequencing_type ,  
				gene = gene
			)
		}
		if( data_type %in% "EXP" ){
			output = Get_Outcome_EXP_Gene( 
				study_type = study ,
				sex = sex ,  
				primary = primary ,  
				drug_type = drug_type ,  
				sequencing_type = sequencing_type ,  
				gene = gene
			)

		}

	} else{

		if( data_type %in% "SNV" ){
			output = Get_Outcome_SNV_Signature( 
				study_type = study ,
				sex = sex ,  
				primary = primary ,  
				drug_type = drug_type ,  
				sequencing_type = sequencing_type ,  
				gene = gene
			)

		}

		if( data_type %in% "EXP" ){
			
			output = Get_Outcome_EXP_Signature( 
				study_type = study ,
				sex = sex ,  
				primary = primary ,  
				drug_type = drug_type ,  
				sequencing_type = sequencing_type ,  
				gene = gene
			)
			network = Get_Network( gene = gene )
			KEGG_network = get_KEGG_network( network = network , gene = gene )
		}
	}

	json <- list(
		error=FALSE,
		analysis_id=input[2],
		data=output,
		network=network,
		kegg=KEGG_network
	)

	json <- jsonlite::toJSON(json)
	return(json)
}

tryCatch({
	# process input arguments
	args <- commandArgs(trailingOnly = TRUE)
	
	# args values used to debug the script.
	# input = c(
	#   '~/Documents/GitHub/PredictIO-webapp/r-scripts/biomarker_eval',
	#   '683a3829-5abe-4ea2-87ac-61204235fb07', 
	#   'Braun,Fumet.1,Fumet.2,Gide,Hugo,Hwang,INSPIRE,Jerby_Arnon,Jung,Kim,Liu,Mariathasan,Miao.1,Nathanson,Puch,Riaz,Roh,Shiuan,Snyder,VanDenEnde,Van_Allen', 
	#   'F,M', 
	#   'Bladder,Breast,Esophageal,Gastric,HNC,Kidney,Liver,Lung,Lymph_node,Melanoma,Ovary,Ureteral', 
	#   'CTLA4,Combo,PD-1/PD-L1', 
	#   'EXP', 
	#   'FPKM,TPM', 
	#   'B2M,CDY11P,GZMA'
	# )
	
	# set working directory to the script directory
	setwd(args[1])

	# import functions
	source("Get_Outcome_Gene.R")
	source("Get_Outcome_Signature.R")
	source("Get_Signature_Network.R")

  run(args)
	
}, error=function(c){
    errorOut <- list(
		"analysis_id"=args[2],
        "error"=TRUE,
        "message"=c$message
    )
    jsonError <- jsonlite::toJSON(errorOut)
    return(jsonError)
})
