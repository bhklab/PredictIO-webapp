
library(reshape2)
library(apcluster)
# library(RColorBrewer)
# library(ggfortify)
library(enrichR)


##################################################################
##################################################################
Get_Network = function( gene ){
	signature = as.data.frame( t( read.csv( file= "../data/biomarker_eval/ALL_sig.csv" , sep=";" , header=FALSE , stringsAsFactor=FALSE) ) )
	data = melt( signature, id.vars= "V1" )
	data = as.data.frame( rbind( as.matrix( data[ !( data$value %in% "" ) , ][ , -2 ] ) , cbind( "custom" , gene ) ) )
	colnames( data ) = c( "signature" , "value" )

	data$signature = as.character( data$signature )
	data$value = as.character( data$value )

	data = data[ order( data$signature ) , ]

	##################################################################
	##################################################################

	signature = sort( unique( data$signature ) )

	overlap = matrix( nrow = length( signature ) , ncol = length( signature ) , 0 )
	colnames( overlap ) = rownames( overlap ) = signature

	for( i in 1:length( signature ) ){
		for( j in 1:length( signature ) ){

			s1 = data[ data$signature %in% signature[i] , ]$value
			s2 = data[ data$signature %in% signature[j] , ]$value

			int = intersect( s1 , s2 )

			overlap[ i , j ] = length( int )

		}
	}

	pca=prcomp( overlap , scale = TRUE)

	x1 = pca$x[ , 1:2]

	apres = apcluster( negDistMat( r = 2 ) , x1 )


	cl = apres@clusters
	cluster = NULL
	for( i in 1:length( cl ) ){
		c = unlist( cl[ i ] )
		cluster = rbind( cluster , cbind( names( c ) , i ) )
	}
	cluster = as.data.frame( cluster )
	colnames(cluster ) = c( "signature" , "cluster" )

	cluster$signature = as.character( cluster$signature )
	cluster$cluster = as.character( cluster$cluster )

	rownames( cluster ) =  cluster$signature

	output = as.data.frame( cbind( x1 , cluster[ rownames(x1) , ]$cluster ) )
	colnames(output) = c( "x" , "y" , "cluster" )
	output$x = as.numeric( as.character( output$x ) )
	output$y = as.numeric( as.character( output$y ) )
	output$cluster = as.character( output$cluster ) 

	output
}

##################################################################
##################################################################

get_KEGG_network = function( network , gene ){

	signature = as.data.frame( t( read.csv( file= "../data/biomarker_eval/ALL_sig.csv" , sep=";" , header=FALSE , stringsAsFactor=FALSE) ) )

	data = melt( signature, id.vars= "V1" )
	data = as.data.frame( rbind( as.matrix( data[ !( data$value %in% "" ) , ][ , -2 ] ) , cbind( "custom" , gene ) ) )
	colnames( data ) = c( "signature" , "value" )

	data$signature = as.character( data$signature )
	data$value = as.character( data$value )

	data = data[ order( data$signature ) , ]

	######################################################
	######################################################
	setEnrichrSite("Enrichr") # Human genes
	dbs <- c( "KEGG_2016" )
	
	clust = sort( unique( network$cluster ) )

	kegg = NULL
	for( i in 1:length( clust ) ){

		sig = rownames( network[ network$cluster %in% clust[ i ] , ] )

		gene = sort( unique( data[ data$signature %in% sig , ]$value ) )
		enriched <- enrichr( gene , dbs )

		kegg = rbind( kegg , cbind( clust[ i ] , enriched[[1]][ 1:3 , 1 ] ) )
	}
	kegg = as.data.frame( kegg )
	colnames(kegg) = c( "cluster" , "pathway" )
	
	kegg$cluster = as.character( kegg$cluster )
	kegg$pathway = as.character( kegg$pathway )

	kegg
}