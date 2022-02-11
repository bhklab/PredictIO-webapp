library(survcomp)
library(genefu)


###########################################################################################
###########################################################################################

Get_HR_dicho = function( surv , time , time_censor , variable , cutoff ){
	data = data.frame( surv=surv , time=time , variable=variable )
	data$time = as.numeric(as.character(data$time))
	data$variable = ifelse( as.numeric(as.character(data$variable)) >= cutoff , 1 , 0 )

  	for(i in 1:nrow(data)){
	    if( !is.na(as.numeric(as.character(data[ i , "time" ]))) && as.numeric(as.character(data[ i , "time" ])) > time_censor ){
	      data[ i , "time" ] = time_censor
	      data[ i , "surv" ] = 0
    	}
  	}

	if( length( data$variable[ data$variable == 1 ] )>=5 & length( data$variable[ data$variable == 0 ] ) >= 5 ){

		cox = coxph( formula= Surv( time , surv ) ~ variable , data=data )
		mean <- round( coef( cox )[1] , 2 )
		se = round( summary(cox)$coefficients[3] , 2 )
		low <- round( confint( cox , level=.95 )[ 1 , 1 ] , 2 )
		up <- round( confint( cox , level=.95 )[ 1 , 2 ] , 2 )
		pval <- summary(cox)$coef[1,5]

	} else{
		mean <- NA
		se = NA
		low <- NA
		up <- NA
		pval <- NA	
	}	

	c( mean , se , low , up , pval )
}

###########################################################################################
###########################################################################################

Get_HR_continous = function( surv , time , time_censor , variable ){
	data = data.frame( surv=surv , time=time , variable=variable )
	data$time = as.numeric(as.character(data$time))
	data$variable = as.numeric( as.character(data$variable) )

  	for(i in 1:nrow(data)){
	    if( !is.na(as.numeric(as.character(data[ i , "time" ]))) && as.numeric(as.character(data[ i , "time" ])) > time_censor ){
	      data[ i , "time" ] = time_censor
	      data[ i , "surv" ] = 0
    	}
  	}

	cox = coxph( formula= Surv( time , surv ) ~ variable , data=data )
	mean <- round( coef( cox )[1] , 2 )
	low <- round( confint( cox , level=.95 )[ 1 , 1 ] , 2 )
	up <- round( confint( cox , level=.95 )[ 1 , 2 ] , 2 )
	pval <- summary(cox)$coef[1,5]

	c( mean , round( summary(cox)$coefficients[3] , 2 ) , low , up , pval )
}
