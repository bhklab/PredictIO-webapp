/*
SQL statements to create IO.db datbase and tables.
Schema is found in https://lucid.app/lucidchart/invitations/accept/279ab4e7-6f6a-4ca2-bdbb-fe8355bbf501
*/
USE iodb;

DROP TABLE signature_metanalysis;
DROP TABLE signature_individual;

CREATE TABLE signature_meta (
	signature varchar(255),
    outcome varchar(255),
    model varchar(255),
    subgroup varchar(255),
    tissue_type varchar(255),
    n int,
    effect_size double,
    se double,
    x95ci_low double,
    x95ci_high double,
    pval double,
    i2 double,
    pval_i2 double,
    PRIMARY KEY (signature, outcome, model, subgroup, tissue_type)
);

CREATE TABLE signature_individual (
	signature varchar(255),
    outcome varchar(255),
    model varchar(255),
    study varchar(255),
    primary_tissue varchar(255),
    sequencing varchar(255),
    n int,
    effect_size double,
    se double,
    x95ci_low double,
    x95ci_high double,
    pval double,
    PRIMARY KEY (signature, outcome, model, study, primary_tissue)
);