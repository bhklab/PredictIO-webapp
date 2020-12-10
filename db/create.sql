/*
SQL statements to create IO.db datbase and tables.
Schema is found in https://lucid.app/lucidchart/invitations/accept/279ab4e7-6f6a-4ca2-bdbb-fe8355bbf501
*/
USE iodb;

DROP TABLE dataset_gene;
DROP TABLE clinical_info;
DROP TABLE gene;
DROP TABLE dataset;

CREATE TABLE dataset (
	dataset_id varchar(255) NOT NULL,
    expr boolean,
    cna boolean,
    snv boolean,
    PRIMARY KEY (dataset_id)
);

CREATE TABLE gene (
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
	expr boolean,
    cna boolean,
    snv boolean,
    PRIMARY KEY (dataset_id, patient),
    FOREIGN KEY (dataset_id) REFERENCES dataset(dataset_id)
);

CREATE TABLE dataset_gene (
	dataset_id varchar(255) NOT NULL,
	gene_id varchar(255) NOT NULL,
    PRIMARY KEY (dataset_id, gene_id),
    FOREIGN KEY (dataset_id) REFERENCES dataset(dataset_id),
    FOREIGN KEY (gene_id) REFERENCES gene(gene_id)
);