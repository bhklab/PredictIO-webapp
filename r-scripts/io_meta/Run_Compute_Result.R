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

	output = NULL

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

		}
	}

	json <- list(
		error=FALSE,
		analysis_id=input[2],
		data=output
	)

	json <- jsonlite::toJSON(json)
	return(json)
}

tryCatch({
	# process input arguments
	args <- commandArgs(trailingOnly = TRUE)
	
	# set working directory to the script directory
	setwd(args[1])

	# import functions
	source("Get_Outcome_Gene.R")
	source("Get_Outcome_Signature.R")

   	run(args)
	
}, error=function(c){
    errorOut <- list(
        "error"=TRUE,
        "message"=c$message
    )
    jsonError <- jsonlite::toJSON(errorOut)
    return(jsonError)
})
