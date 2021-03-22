##########################################################################################################################################################
##########################################################################################################################################################

require(survcomp)
require(genefu)

#Remove rows if count is < zero in 50% of sample
rem <- function(x){
  x <- as.matrix(x)
  x <- t(apply(x,1,as.numeric))
  r <- as.numeric(apply(x,1,function(i) sum(i == 0) ))
  remove <- which(r > dim(x)[2]*0.5)
  return(remove)
}


get_Scale = function( x ){
	rid = rownames(x)
	cid = colnames(x)
	out = t( apply( x , 1 , scale ) )
	rownames(out) = rid
	colnames(out) = cid
	out
}

##########################################################################################################################################################
##########################################################################################################################################################

##########################################################################################################################################################
##########################################################################################################################################################

Get_Outcome_SNV_Signature = function( sex , primary , drug_type , sequencing_type , gene , study_type ){

	source( 'Get_HR.R' )
	source( 'Get_DI.R' )
	source( 'Meta_Analysis.R' )

	load( "../data/io_meta/ICB_snv_filtered.RData" )
	snv

	study = names(snv)


	output = NULL

	for( i in 1:length( study ) ){

		if( study[i] %in% study_type ){

			tumor = names( table( phenoData( snv[[i]] )$primary )[ table( phenoData( snv[[i]] )$primary ) >= 20 ] )
			tumor = tumor[ tumor %in% primary ]

			if( length(tumor) > 0 ){

				for( j in 1:length(tumor)){
					patient_ID = 	phenoData( snv[[i]] )$sex %in% c( sex , NA ) &
									phenoData( snv[[i]] )$primary %in% tumor[j] &
									phenoData( snv[[i]] )$drug_type %in% drug_type &
									toupper( phenoData( snv[[i]] )$dna ) %in% sequencing_type 

					data = 	exprs( snv[[i]] )[ , patient_ID ]
					os = phenoData( snv[[i]] )$os[ patient_ID ]
					t.os = phenoData( snv[[i]] )$t.os[ patient_ID ]
					pfs = phenoData( snv[[i]] )$pfs[ patient_ID ]
					t.pfs = phenoData( snv[[i]] )$t.pfs[ patient_ID ]													
					response = phenoData( snv[[i]] )$response[ patient_ID ]

					if( gene[ gene %in% rownames( data ) ] / length( gene ) > .7 ){
						data = data[ rownames( data ) %in% gene , ]
						data = colSums( ifelse( is.na( data ) , 0 , 1 ) )
						data[ data > 0 ] = 1
					} else{
						data = NULL
					}

				
					if( length( data[ !is.na( os ) ]  ) >= 20 ){

						hr = Get_HR_continous( surv= os , time= t.os , time_censor=36 , variable= data )
						output = rbind( output , 
								c( 	study[i] , tumor[j] , 
									"OS" , "COX" , unique( toupper( phenoData( snv[[i]] )$dna ) ) , 
									0 , NA , NA , length( data[ !is.na( os ) ] ) , hr ,
									NA , NA ) )

					}
					if( length( data[ !is.na( pfs ) ]  ) >= 20 ){

						hr = Get_HR_continous( surv= pfs , time= t.pfs , time_censor=24 , variable= data )
						output = rbind( output , 
								c( 	study[i] , tumor[j] , 
									"PFS" , "COX" , unique( toupper( phenoData( snv[[i]] )$dna ) ) , 
									0 , NA , NA , length( data[ !is.na( pfs ) ] ) , hr ,
									NA , NA ) )
							
					}
					if( sum( data , na.rm= TRUE ) / length( data[ !is.na( data ) ] ) >= .10 & length( data[ !is.na( response ) ]  ) >= 20 ){

						x = ifelse( response %in% "R" , 0 , ifelse( response %in% "NR" , 1 , NA ) )
						fit = glm( x ~ data , family=binomial( link="logit" ) )

						output = rbind( output , 
								c( study[i] , tumor[j] , 
									"Response" , "LogReg" , unique( toupper( phenoData( snv[[i]] )$dna ) ) , 
									0 , NA , NA , length( data[ !is.na( response ) ]  ) , 
									round( summary(fit)$coefficients[ 2 , c( 1 , 2 ) ] , 2 ) , 
									round( confint(fit)[ 2 , ] , 2 ) , 
									summary(fit)$coefficients[ 2 , 4 ] ,
									NA , NA ) )			
					}
				}
			}
		}
	}

	colnames(output) = c( "study" , "Primary" , "Outcome" , "Model" , "Sequencing" , "Meta_Analysis" , "Subgroup" , "Type" , "N" , "Effect_size" , "SE" , "CI95_low" , "CI95_high"  , "Pval" , "I2" , "Pval_I2" )
	output = as.data.frame( output )
	output$study = as.character( output$study )
	output$Primary = as.character( output$Primary )
	output$Outcome = as.character( output$Outcome )
	output$Model = as.character( output$Model )
	output$Sequencing = as.character( output$Sequencing )
	output$Meta_Analysis = as.character( output$Meta_Analysis )
	output$Subgroup = as.character( output$Subgroup )
	output$Type = as.character( output$Type )
	output$N = as.numeric( as.character( output$N ) )
	output$Effect_size = as.numeric( as.character( output$Effect_size ) )
	output$SE = as.numeric( as.character( output$SE ) )
	output$CI95_low = as.numeric( as.character( output$CI95_low ) )
	output$CI95_high = as.numeric( as.character( output$CI95_high ) )
	output$I2 = as.numeric( as.character( output$I2 ) )
	output$Pval_I2 = as.numeric( as.character( output$Pval_I2 ) )

	output = get_Meta_Output( input = output )			
	output
}

##########################################################################################################################################################
##########################################################################################################################################################

Get_Outcome_EXP_Signature = function( sex , primary , drug_type , sequencing_type , gene , study_type ){

	source( 'Get_HR.R' )
	source( 'Get_DI.R' )
	source( 'Meta_Analysis.R' )
	require(GSVA)

	load( "../data/io_meta/ICB_exp_filtered.RData" )
	expr

	study = names(expr)

	output = NULL

	for( i in 1:length( study ) ){

		if( study[i] %in% study_type ){

			tumor = names( table( phenoData( expr[[i]] )$primary )[ table( phenoData( expr[[i]] )$primary ) >= 20 ] )
			tumor = tumor[ tumor %in% primary ]

			if( length(tumor) > 0 ){

				for( j in 1:length(tumor)){
					patient_ID = 	phenoData( expr[[i]] )$sex %in% c( sex , NA ) &
									phenoData( expr[[i]] )$primary %in% tumor[j] &
									phenoData( expr[[i]] )$drug_type %in% drug_type &
									toupper( phenoData( expr[[i]] )$rna ) %in% sequencing_type 

					data = exprs( expr[[i]] )[ , patient_ID ]
					os = phenoData( expr[[i]] )$os[ patient_ID ]
					t.os = phenoData( expr[[i]] )$t.os[ patient_ID ]
					pfs = phenoData( expr[[i]] )$pfs[ patient_ID ]
					t.pfs = phenoData( expr[[i]] )$t.pfs[ patient_ID ]													
					response = phenoData( expr[[i]] )$response[ patient_ID ]

					if( length( gene[ gene %in% rownames( data ) ] ) / length( gene ) > .7 ){
						geneSig <- as.numeric( gsva( get_Scale( x= data ) , list( gene ) , verbose=FALSE ) )
						names( geneSig ) = colnames(data)
						data = geneSig
					} else{
						data = NULL
					}

				
					if( length( data[ !is.na( os ) ]  ) >= 20 ){

						hr = Get_HR_continous( surv= os , time= t.os , time_censor=36 , variable= data )
						output = rbind( output , 
								c( 	study[i] , tumor[j] , 
									"OS" , "COX" , unique( toupper( phenoData( expr[[i]] )$rna ) ) , 
									0 , NA , NA , length( data[ !is.na( os ) ] ) , hr ,
									NA , NA ) )


						hr = Get_DI_continous( surv= os , time= t.os , time_censor=36 , variable= data )
						output = rbind( output , 
								c( 	study[i] , tumor[j] , 
									"OS" , "DI" , unique( toupper( phenoData( expr[[i]] )$rna ) ) , 
									0 , NA , NA , length( data[ !is.na( os ) ] ) , hr ,
									NA , NA ) )

					}
					if( length( data[ !is.na( pfs ) ]  ) >= 20 ){

						hr = Get_HR_continous( surv= pfs , time= t.pfs , time_censor=24 , variable= data )
						output = rbind( output , 
								c( 	study[i] , tumor[j] , 
									"PFS" , "COX" , unique( toupper( phenoData( expr[[i]] )$rna ) ) , 
									0 , NA , NA , length( data[ !is.na( pfs ) ] ) , hr ,
									NA , NA ) )

						hr = Get_DI_continous( surv= pfs , time= t.pfs , time_censor=24 , variable= data )
						output = rbind( output , 
								c( 	study[i] , tumor[j] , 
									"PFS" , "DI" , unique( toupper( phenoData( expr[[i]] )$rna ) ) , 
									0 , NA , NA , length( data[ !is.na( pfs ) ] ) , hr ,
									NA , NA ) )
							
					}
					if( length( data[ !is.na( response ) ]  ) >= 20 ){

						x = ifelse( response %in% "R" , 0 , ifelse( response %in% "NR" , 1 , NA ) )
						fit = glm( x ~ data , family=binomial( link="logit" ) )

						output = rbind( output , 
								c( study[i] , tumor[j] , 
									"Response" , "LogReg" , unique( toupper( phenoData( expr[[i]] )$rna ) ) , 
									0 , NA , NA , length( data[ !is.na( response ) ]  ) , 
									round( summary(fit)$coefficients[ 2 , c( 1 , 2 ) ] , 2 ) , 
									round( confint(fit)[ 2 , ] , 2 ) , 
									summary(fit)$coefficients[ 2 , 4 ] ,
									NA , NA ) )			
					}
				}
			}
		}
	}

	colnames(output) = c( "study" , "Primary" , "Outcome" , "Model" , "Sequencing" , "Meta_Analysis" , "Subgroup" , "Type" , "N" , "Effect_size" , "SE" , "CI95_low" , "CI95_high"  , "Pval" , "I2" , "Pval_I2" )
	output = as.data.frame( output )
	output$study = as.character( output$study )
	output$Primary = as.character( output$Primary )
	output$Outcome = as.character( output$Outcome )
	output$Model = as.character( output$Model )
	output$Sequencing = as.character( output$Sequencing )
	output$Meta_Analysis = as.character( output$Meta_Analysis )
	output$Subgroup = as.character( output$Subgroup )
	output$Type = as.character( output$Type )
	output$N = as.numeric( as.character( output$N ) )
	output$Effect_size = as.numeric( as.character( output$Effect_size ) )
	output$SE = as.numeric( as.character( output$SE ) )
	output$CI95_low = as.numeric( as.character( output$CI95_low ) )
	output$CI95_high = as.numeric( as.character( output$CI95_high ) )
	output$I2 = as.numeric( as.character( output$I2 ) )
	output$Pval_I2 = as.numeric( as.character( output$Pval_I2 ) )

	output = get_Meta_Output( input = output )		
	output
}

