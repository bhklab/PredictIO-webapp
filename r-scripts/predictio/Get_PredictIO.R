##########################################################################################################################################################
##########################################################################################################################################################

library(GSVA)

#Remove rows if count is < zero in 50% of sample
rem <- function( x ){
  x <- as.matrix( x )
  x <- t( apply( x , 1 , as.numeric ) )
  r <- as.numeric( apply( x , 1 , function( i ) sum( i == 0 ) ) )
  remove <- which( r > dim( x )[2] * 0.5 )
  return( remove )
}

getIOscore_GSVA <- function( data , meta_res ){
	
	library(GSVA)
		
	remove <- rem(data)
	if( length(remove) ){
		data <- data[-remove,]
	}		
	
	sensitive = meta_res[ meta_res$coef < 0 , ]$gene
	resistance = meta_res[ meta_res$coef > 0 , ]$gene

	IO_resistance = NULL
	if( ifelse( is.null( nrow( as.matrix( data[ rownames(data) %in% resistance , ] ) ) ) , 1 , nrow( as.matrix( data[ rownames(data) %in% resistance , ] ) ) ) / length( resistance ) > 0.7 ){
		IO_resistance = as.numeric( gsva( as.matrix( data ) , list(resistance) , verbose=FALSE ) )
	}
	
	IO_sensitive = NULL
	if( ifelse( is.null( nrow( as.matrix( data[ rownames(data) %in% sensitive , ] ) ) ) , 1 , nrow( as.matrix( data[ rownames(data) %in% sensitive , ] ) ) ) / length( sensitive ) > 0.7 ){
		IO_sensitive = as.numeric( gsva( as.matrix( data ) , list( sensitive ) , verbose=FALSE ) )
	}

	####################################################################################
	####################################################################################
	## Compte IO Meta-Score
	signature = NULL
	if( !is.null( IO_resistance ) & !is.null( IO_sensitive ) ){
		signature = IO_sensitive - IO_resistance
		names(signature) = colnames(data)
	}
	signature
}

