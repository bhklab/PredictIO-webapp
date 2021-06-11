# installs all R dependencies for the project.

if (!require("devtools")) {
  install.packages("devtools")
}

if (!requireNamespace("BiocManager", quietly = TRUE)){
    install.packages("BiocManager")
}

install.packages("meta")
install.packages("metafor")
BiocManager::install("genefu")
BiocManager::install("survcomp")
BiocManager::install("GSVA")
devtools::install_github("MathiasHarrer/dmetar")
# install.packages("Cairo")

install.packages("jsonlite")
