/*
SQL statements to create IO.db datbase and tables.
Schema is found in https://lucid.app/lucidchart/invitations/accept/279ab4e7-6f6a-4ca2-bdbb-fe8355bbf501
*/
USE iodb;

DROP TABLE expression;
DROP TABLE snv;
DROP TABLE cna;
DROP TABLE cna_features;
DROP TABLE snv_features;
DROP TABLE clinical_info;
DROP TABLE genes;
DROP TABLE dataset;

CREATE TABLE dataset (
	dataset_id varchar(255) NOT NULL,
    PRIMARY KEY (dataset_id)
);

CREATE TABLE genes (
	gene_id varchar(255) NOT NULL,
    PRIMARY KEY (gene_id)
);

CREATE TABLE clinical_info (
	dataset_id varchar(255) NOT NULL,
	patient varchar(255) NOT NULL,
	sex varchar(255),
    age int,
    primary_tissue varchar(255),
    histo varchar(255),
    stage varchar(255),
    response_other_info varchar(255),
    recist varchar(255),
    response varchar(255),
    drug_type varchar(255),
    dna varchar(255),
    rna varchar(255),
    t_pfs double,
    pfs boolean,
    t_os double,
    os boolean,
    PRIMARY KEY (dataset_id, patient),
    FOREIGN KEY (dataset_id) REFERENCES dataset(dataset_id)
);

CREATE TABLE cna_features (
	dataset_id varchar(255) NOT NULL,
	patient varchar(255) NOT NULL,
    cna_tot double,
    amp double,
    del double,
    PRIMARY KEY (dataset_id, patient),
    FOREIGN KEY (dataset_id, patient) REFERENCES clinical_info(dataset_id, patient)
);

CREATE TABLE snv_features (
	dataset_id varchar(255) NOT NULL,
	patient varchar(255) NOT NULL,
    nsTMB_perMb double,
    indel_TMB_perMb double,
    indel_nsTMB_perMb double,
    PRIMARY KEY (dataset_id, patient),
    FOREIGN KEY (dataset_id, patient) REFERENCES clinical_info(dataset_id, patient)
);

CREATE TABLE expression (
	dataset_id varchar(255) NOT NULL,
	patient varchar(255) NOT NULL,
    gene_id varchar(255) NOT NULL,
    exp_value double,
    PRIMARY KEY (gene_id, dataset_id, patient),
	FOREIGN KEY (dataset_id, patient) REFERENCES clinical_info(dataset_id, patient),
    FOREIGN KEY (gene_id) REFERENCES genes(gene_id)
);

CREATE TABLE cna (
	dataset_id varchar(255) NOT NULL,
	patient varchar(255) NOT NULL,
    gene_id varchar(255) NOT NULL,
    cna_value double,
    PRIMARY KEY (gene_id, dataset_id, patient),
    FOREIGN KEY (dataset_id, patient) REFERENCES clinical_info(dataset_id, patient),
    FOREIGN KEY (gene_id) REFERENCES genes(gene_id)
);

CREATE TABLE snv (
	dataset_id varchar(255) NOT NULL,
	patient varchar(255) NOT NULL,
    gene_id varchar(255) NOT NULL,
    chr varchar(255) NOT NULL,
    pos int,
    ref varchar(255),
	alt varchar(255),
	effect varchar(255),
    mut_type varchar(255),
    PRIMARY KEY (gene_id, dataset_id, patient),
    FOREIGN KEY (dataset_id, patient) REFERENCES clinical_info(dataset_id, patient),
    FOREIGN KEY (gene_id) REFERENCES genes(gene_id)
);