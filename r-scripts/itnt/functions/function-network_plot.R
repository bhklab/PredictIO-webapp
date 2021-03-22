network.plot <- function(subtype="ALL", ref_gmt_file="c7.all.v7.0.entrez.gmt", your_gmt_file="Lapointe-NK.gmt", numpoints=20, project_name="/Results/"){


ref_gmt<-gmtPathways(ref_gmt_file)
your_gmt<-gmtPathways(your_gmt_file)


Pval_string<-paste0(subtype,"_Pval_AVE")
NES_string<-paste0(subtype,"_NES_AVE")

gene_set_length<-length(your_gmt)
ref_len<-numpoints-gene_set_length


ref_gsea<-as.data.frame(read_delim(paste0("Results/",strsplit(ref_gmt_file, ".",fixed = T)[[1]][1],"/GSEA_table.csv"), delim=",", col_names = TRUE,quote = "\"" ), stringsAsFactors = FALSE)
ref_gsea<-column_to_rownames(ref_gsea, var = "X1")

your_gsea<-as.data.frame(read_delim(paste0("Results/",strsplit(your_gmt_file, ".",fixed = T)[[1]][1],"/GSEA_table.csv"), delim=",", col_names = TRUE,quote = "\"" ), stringsAsFactors = FALSE)
your_gsea<-column_to_rownames(your_gsea, var= "X1")


ordered_gsea<- ref_gsea[order(ref_gsea[,Pval_string]),]
ordered_gsea_pos<-ordered_gsea %>% filter(ordered_gsea[,NES_string] >0)
ordered_gsea_neg<-ordered_gsea %>% filter(ordered_gsea[,NES_string] < (0))

ordered_gsea_pos<-ordered_gsea_pos[0:(ref_len/2+1),]
ordered_gsea_neg<-ordered_gsea_neg[0:(ref_len/2),]

network_gmt<-c()
for (genesets in rownames(ordered_gsea_pos)){
  network_gmt<-c(network_gmt, ref_gmt[genesets])
}
for (genesets in rownames(ordered_gsea_neg)){
  network_gmt<-c(network_gmt, ref_gmt[genesets])
}
network_gmt<-c(network_gmt, your_gmt)


##################################################
ref_len = ref_len+1

nodes<-data_frame(nodes = c(names(network_gmt)), NES=0)
for (i in 1: ref_len){
  nodes$NES[i]<-ordered_gsea[nodes$nodes[i],NES_string]
}
for (i in (ref_len+1): numpoints){
  nodes$NES[i]<-your_gsea[nodes$nodes[i],NES_string]
}



edges<-data_frame(pathway1=character(), pathway2=character(), w=numeric())
for (i in 1:length(network_gmt)){
  for (j in i:(length(network_gmt))){
    if (i ==j){next}
    edges<-add_row(edges, pathway1=names(network_gmt[i]), pathway2=names(network_gmt[j]), w = (length(intersect(network_gmt[i][[1]],network_gmt[j][[1]])))/min(length(network_gmt[i][[1]]),length(network_gmt[j][[1]])))
  } 
}

#edges<-edges %>% filter(edges$w >1) # filter out low number of common genes


g1 <- graph_from_data_frame(edges, vertices=nodes, directed = FALSE)


E(g1)$width <- E(g1)$w/max(edges$w)*10

#### COLOUR BY NES
colfun<- colorRamp2(c(min(nodes$NES, na.rm = TRUE),0, max(nodes$NES, na.rm = TRUE)), c("blue", "grey", "red"))
vcol<- colfun(rescale(nodes$NES, c(min(nodes$NES), max(nodes$NES))))
#### HIGHLIGHT EDGES
#inc.edges <- unlist(incident_edges(g1,  c(V(g1)[nodes=="NK_0"], V(g1)[nodes=="NK_1"]), mode="all"))
#ecol <- rep("gray80", ecount(g1))
#ecol[inc.edges] <- "black"
####

png(file = paste0("Results/",project_name,"/Network_plots/",strsplit(ref_gmt_file, ".",fixed = T)[[1]][1],"-",subtype,".png"), width = 1000, height = 500)
?png

plot(g1, ylim=c(-1,1),xlim=c(-1,1), 
     asp = 0,layout=layout_in_circle, 
     vertex.color=vcol, 
     vertex.label.color="black", 
     vertex.label.dist = 0,
     vertex.label.cex = 0.8,
     margin=c(0,1,0,1),
     layout_on_grid=T,
     #edge.color=ecol,
     vertex.label.font=2, #bold =2
     vertex.label.cex=0.5, 
     #vertex.size = 5,
     )

title(paste0(strsplit(your_gmt_file, ".",fixed = T)[[1]][1], " & ", strsplit(ref_gmt_file, ".",fixed = T)[[1]][1]," (", subtype,")"),cex.main=3,col.main="black")
dev.off()


ifelse(!dir.exists(file.path(paste0("Results/",project_name,"/Network_plots/"), "Cytoscape/")), dir.create(file.path(paste0(paste0("Results/",project_name,"/Network_plots/"), "Cytoscape/"))), FALSE)

plotCytoscapeGML(g1,paste0("Results/",project_name,"/Network_plots/Cytoscape/",strsplit(ref_gmt_file, ".",fixed = T)[[1]][1],"-",subtype,".gml"))
}

