# app-specific libraries
library(jsonlite)

run <- function(input) {

	arg = read.csv( "../data/io_meta/Data_INPUT.txt" , sep= "\t" , stringsAsFactors= FALSE , header= FALSE )
	id = arg[ , 1 ]
	arg = as.data.frame( t( arg[ , -1 ] ) )
	colnames( arg ) = id

	study = as.character( sapply( as.character( arg$study ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )

	sex = as.character( sapply( as.character( arg$sex ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )

	if( sum( sex == c( "M" , "F" ) ) %in% 2 ) { sex = c( "M" , "F" , NA ) }

	primary = as.character( sapply( as.character( arg$primary ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )
	drug_type = as.character( sapply( as.character( arg$drug_type ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )
	data_type = as.character( arg$data_type )
	sequencing_type = as.character( sapply( as.character( arg$sequencing_type ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )

	if( length( grep( ',' , as.character( arg$gene ) ) ) ){
		gene = as.character( sapply( as.character( arg$gene ) , function( x ) unlist( strsplit( x , "," , fixed= TRUE ) ) )[ , 1 ] )
	} else{
		gene = as.character( arg$gene )
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
		# if( data_type %in% "CNA" ){
		# 	output = Get_Outcome_CNA_Signature( 
		# 		sex = sex ,  
		# 		primary = primary ,  
		# 		drug_type = drug_type ,  
		# 		sequencing_type = sequencing_type ,  
		# 		gene = gene
		# 	)

		# }
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

	output <- jsonlite::toJSON(output)
	return(output)
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
