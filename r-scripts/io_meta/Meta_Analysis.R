########################################################################################################################
########################################################################################################################


# library(Cairo)
library(meta)
library(metafor)
library(genefu)
# ibrary(forestplot)
library(dmetar)


get_Meta_HR = function( data ){

	data$study <- as.character( data$study )
	data$Sequencing <- as.character( data$Sequencing )
	data$Primary <- as.character( data$Primary )
	data$Effect_size <- as.numeric(as.character( data$Effect_size ))
	data$SE <- as.numeric(as.character( data$SE ))
	data$Pval <- as.numeric(as.character( data$Pval )) 

	meta <- metagen( TE = Effect_size,
                  seTE = SE,
                  data = data,
                  studlab = study,
                  comb.fixed = FALSE,
                  comb.random = TRUE)

	######################################################################
	######################################################################
	## Save the merged HR and Pvalue
	meta_res <- c(  nrow(data) ,
					meta$TE.random ,  
					meta$seTE.random ,   
					meta$lower.random ,   
					meta$upper.random ,
					meta$pval.random , 
					meta$I2 ,
					meta$pval.Q )
	names(meta_res) <- c( "N" , "Effect_size" , "SE" , "CI95_low" , "CI95_high" , "Pval" , "I2" , "Pval_I2" )
	meta_res
}

get_Meta_OR = function( data ){

	data$study <- as.character( data$study )
	data$Sequencing <- as.character( data$Sequencing )
	data$Primary <- as.character( data$Primary )
	data$Effect_size <- as.numeric(as.character( data$Effect_size ))
	data$SE <- as.numeric(as.character( data$SE ))
	data$Pval <- as.numeric(as.character( data$Pval )) 

	meta <- metagen( TE = Effect_size,
                  seTE = SE,
                  data = data,
                  studlab = study,
                  comb.fixed = FALSE,
                  comb.random = TRUE)

	######################################################################
	######################################################################
	## Save the merged coef and Pvalue
	meta_res <- c( nrow(data) ,
					meta$TE.random ,  
					meta$seTE.random ,   
					meta$lower.random ,   
					meta$upper.random ,
					meta$pval.random , 
					meta$I2 ,
					meta$pval.Q )
	names(meta_res) <- c( "N" , "Effect_size" , "SE" , "CI95_low" , "CI95_high" , "Pval" , "I2" , "Pval_I2" )
	meta_res
}

get_Meta_DI = function( data ){

	data$study <- as.character( data$study )
	data$Sequencing <- as.character( data$Sequencing )
	data$Primary <- as.character( data$Primary )
	data$Effect_size <- as.numeric(as.character( data$Effect_size ))
	data$SE <- as.numeric(as.character( data$SE ))
	data$Pval <- as.numeric(as.character( data$Pval )) 

	meta <- metagen( TE = Effect_size,
                  seTE = SE,
                  data = data,
                  studlab = study,
                  comb.fixed = FALSE,
                  comb.random = TRUE)

	######################################################################
	######################################################################
	## Save the merged DI and Pvalue
	meta_res <- c( nrow(data) ,
					meta$TE.random ,  
					meta$seTE.random ,   
					meta$lower.random ,   
					meta$upper.random ,
					meta$pval.random , 
					meta$I2 ,
					meta$pval.Q )
	names(meta_res) <- c( "N" , "Effect_size" , "SE" , "CI95_low" , "CI95_high" , "Pval" , "I2" , "Pval_I2" )
	meta_res
}

########################################################################################################################
########################################################################################################################

get_Meta_Output = function( input ){

	res_meta = NULL
	
	########################################################################################################################
	########################################################################################################################
	## OS analysis with COX model

	result = input[ input$Outcome %in% "OS" & input$Model %in% "COX" & input$SE <= 10 & !is.na( input$Pval ) , ]

	if( nrow( result ) ){
		tumorID = unique( sort( result$Primary ) )
		sequencingID = unique( sort( result$Sequencing ) )

		#######################
		## Global meta-analysis
		meta_res = c( NA , NA , "OS" , "COX" , NA , 1 , "ALL" , "ALL" , get_Meta_HR( data=result ) )


		#######################################
		## Subgroup meta-analysis :  Tumor Type
		for( j in 1:length(tumorID) ){
			data = result[ result$Primary %in% tumorID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_HR( data=data ) 
				meta_res = rbind( meta_res , c( NA , NA , "OS" , "COX" , NA , 1 , "Tumor" , tumorID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c( NA , NA , "OS" , "COX" , NA , 1 , "Tumor" , tumorID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		## Subgroup meta-analysis : Sequencing Type
		for( j in 1:length(sequencingID) ){
			data = result[ result$Sequencing %in% sequencingID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_HR( data=data ) 
				meta_res = rbind( meta_res , c(  NA , NA , "OS" , "COX" , NA , 1 , "Sequencing" , sequencingID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c(  NA , NA , "OS" , "COX" , NA , 1 , "Sequencing" , sequencingID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		###########################################
		## Result merging

		colnames( meta_res ) = colnames( data )
		res_meta = rbind( res_meta , meta_res )	
	}

	########################################################################################################################
	########################################################################################################################
	## OS analysis with DI model

	result = input[ input$Outcome %in% "OS" & input$Model %in% "DI" & input$SE <= 10 & !is.na( input$Pval ) , ]

	if( nrow( result ) ){
		tumorID = unique( sort( result$Primary ) )
		sequencingID = unique( sort( result$Sequencing ) )

		#######################
		## Global meta-analysis
		meta_res = c( NA , NA , "OS" , "DI" , NA , 1 , "ALL" , "ALL" , get_Meta_DI( data=result ) )


		#######################################
		## Subgroup meta-analysis :  Tumor Type
		for( j in 1:length(tumorID) ){
			data = result[ result$Primary %in% tumorID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_DI( data=data ) 
				meta_res = rbind( meta_res , c( NA , NA , "OS" , "DI" , NA , 1 , "Tumor" , tumorID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c( NA , NA , "OS" , "DI" , NA , 1 , "Tumor" , tumorID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		## Subgroup meta-analysis : Sequencing Type
		for( j in 1:length(sequencingID) ){
			data = result[ result$Sequencing %in% sequencingID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_DI( data=data ) 
				meta_res = rbind( meta_res , c(  NA , NA , "OS" , "DI" , NA , 1 , "Sequencing" , sequencingID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c(  NA , NA , "OS" , "DI" , NA , 1 , "Sequencing" , sequencingID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		###########################################
		## Result merging

		colnames( meta_res ) = colnames( data )
		res_meta = rbind( res_meta , meta_res )
	}

	########################################################################################################################
	########################################################################################################################
	## PFS analysis with COX model

	result = input[ input$Outcome %in% "PFS" & input$Model %in% "COX" & input$SE <= 10 & !is.na( input$Pval ) , ]

	if( nrow( result ) ){
		tumorID = unique( sort( result$Primary ) )
		sequencingID = unique( sort( result$Sequencing ) )

		#######################
		## Global meta-analysis
		meta_res = c( NA , NA , "PFS" , "COX" , NA , 1 , "ALL" , "ALL" , get_Meta_HR( data=result ) )


		#######################################
		## Subgroup meta-analysis :  Tumor Type
		for( j in 1:length(tumorID) ){
			data = result[ result$Primary %in% tumorID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_HR( data=data ) 
				meta_res = rbind( meta_res , c( NA , NA , "PFS" , "COX" , NA , 1 , "Tumor" , tumorID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c( NA , NA , "PFS" , "COX" , NA , 1 , "Tumor" , tumorID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		## Subgroup meta-analysis : Sequencing Type
		for( j in 1:length(sequencingID) ){
			data = result[ result$Sequencing %in% sequencingID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_HR( data=data ) 
				meta_res = rbind( meta_res , c(  NA , NA , "PFS" , "COX" , NA , 1 , "Sequencing" , sequencingID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c(  NA , NA , "PFS" , "COX" , NA , 1 , "Sequencing" , sequencingID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		###########################################
		## Result merging

		colnames( meta_res ) = colnames( data )
		res_meta = rbind( res_meta , meta_res )	
	}

	########################################################################################################################
	########################################################################################################################
	## PFS analysis with DI model

	result = input[ input$Outcome %in% "PFS" & input$Model %in% "DI" & input$SE <= 10 & !is.na( input$Pval ) , ]

	if( nrow( result ) ){

		tumorID = unique( sort( result$Primary ) )
		sequencingID = unique( sort( result$Sequencing ) )

		#######################
		## Global meta-analysis
		meta_res = c( NA , NA , "PFS" , "DI" , NA , 1 , "ALL" , "ALL" , get_Meta_DI( data=result ) )


		#######################################
		## Subgroup meta-analysis :  Tumor Type
		for( j in 1:length(tumorID) ){
			data = result[ result$Primary %in% tumorID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_DI( data=data ) 
				meta_res = rbind( meta_res , c( NA , NA , "PFS" , "DI" , NA , 1 , "Tumor" , tumorID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c( NA , NA , "PFS" , "DI" , NA , 1 , "Tumor" , tumorID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		## Subgroup meta-analysis : Sequencing Type
		for( j in 1:length(sequencingID) ){
			data = result[ result$Sequencing %in% sequencingID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_DI( data=data ) 
				meta_res = rbind( meta_res , c(  NA , NA , "PFS" , "DI" , NA , 1 , "Sequencing" , sequencingID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c(  NA , NA , "PFS" , "DI" , NA , 1 , "Sequencing" , sequencingID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		###########################################
		## Result merging

		colnames( meta_res ) = colnames( data )
		res_meta = rbind( res_meta , meta_res )
	}

	########################################################################################################################
	########################################################################################################################
	## Response analysis with LogRegression model

	result = input[ input$Outcome %in% "Response" & input$Model %in% "LogReg" & input$SE <= 10 & !is.na( input$Pval ) , ]

	if( nrow( result ) ){
		tumorID = unique( sort( result$Primary ) )
		sequencingID = unique( sort( result$Sequencing ) )

		#######################
		## Global meta-analysis
		meta_res = c( NA , NA , "Response" , "LogReg" , NA , 1 , "ALL" , "ALL" , get_Meta_OR( data=result ) )


		#######################################
		## Subgroup meta-analysis :  Tumor Type
		for( j in 1:length(tumorID) ){
			data = result[ result$Primary %in% tumorID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_OR( data=data ) 
				meta_res = rbind( meta_res , c( NA , NA , "Response" , "LogReg" , NA , 1 , "Tumor" , tumorID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c( NA , NA , "Response" , "LogReg" , NA , 1 , "Tumor" , tumorID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		## Subgroup meta-analysis : Sequencing Type
		for( j in 1:length(sequencingID) ){
			data = result[ result$Sequencing %in% sequencingID[j] , ]
			if( nrow( data ) >= 3 ){
				res = get_Meta_OR( data=data ) 
				meta_res = rbind( meta_res , c(  NA , NA , "Response" , "LogReg" , NA , 1 , "Sequencing" , sequencingID[j] , res ) )
			} else{
				meta_res = rbind( meta_res , c(  NA , NA , "Response" , "LogReg" , NA , 1 , "Sequencing" , sequencingID[j] , nrow(data) , rep( NA , 7 ) ) )
			}
		}

		###########################################
		###########################################
		## Result merging

		colnames( meta_res ) = colnames( data )
		res_meta = rbind( res_meta , meta_res )
	}

	########################################################################################################################
	########################################################################################################################
	## Generate Output

	rownames( res_meta ) = 1:nrow(res_meta)

	output = as.data.frame( rbind( input , res_meta ) )

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

	output
}


