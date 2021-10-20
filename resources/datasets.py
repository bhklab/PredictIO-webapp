from flask import request
from flask_restful import Resource
from db.models.dataset import Dataset
from db.models.dataset_identifier import DatasetIdentifier

class Datasets(Resource): 
    def get(self):
        join_table = Dataset.query\
            .join(DatasetIdentifier, Dataset.dataset_id == DatasetIdentifier.dataset_id, isouter=True)\
            .add_columns(
                DatasetIdentifier.identifier,
                DatasetIdentifier.link
            )
        
        data = join_table.all()
        result = list()
        for item in data:
            found = next((i for i, x in enumerate(result) if x["dataset_id"] == item[0].dataset_id), -1)
            if found == -1:
                result.append({
                    "dataset_id": item[0].dataset_id,
                    "dataset_name": item[0].dataset_name,
                    "pmid": item[0].pmid,
                    "title": item[0].title,
                    "summary": item[0].summary,
                    "authors": item[0].authors,
                    "identifiers": [] if item[1] is None else [{"identifier": item[1], "link": item[2]}]
                })
            else:
                result[found]["identifiers"].append({"identifier": item[1], "link": item[2]})
        return result, 200

    def post(self):
        return "only get request is allowed", 400