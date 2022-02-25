from flask import request
from flask_restful import Resource
from db.models.dataset import Dataset
from db.models.dataset_identifier import DatasetIdentifier
from db.models.dataset_gene import DatasetGene
from db.models.patient import Patient

class SingleDataset(Resource): 
    def get(self, dataset_id):
        dataset = Dataset.query\
            .join(DatasetIdentifier, Dataset.dataset_id == DatasetIdentifier.dataset_id)\
            .add_columns(
                Dataset.dataset_name,
                Dataset.pmid,
                Dataset.summary,
                Dataset.authors,
                DatasetIdentifier.identifier,
                DatasetIdentifier.link
            )\
            .filter(Dataset.dataset_id == dataset_id)\
            .one()

        patient = Patient.query.filter(Patient.dataset_id == dataset_id).all()
        patient = Patient.serialize_list(patient)
        for p in patient:
            del p["dataset"]

        num_genes = DatasetGene.query.filter(DatasetGene.dataset_id == dataset_id).count()

        result = {
            "dataset": {
                "dataset_name": dataset.dataset_name,
                "pmid": dataset.pmid,
                "summary": dataset.summary,
                "authors": dataset.authors,
                "identifier": dataset.identifier,
                "link": dataset.link
            },
            "dataset_patient": patient,
            "num_genes": num_genes
        }

        return result, 200

    def post(self):
        return "only get request is allowed", 400