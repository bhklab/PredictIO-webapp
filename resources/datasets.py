from flask import request
from flask_restful import Resource
from db.models.dataset import Dataset

class Datasets(Resource): 
    def get(self):
        dataset = Dataset.query.filter()
        result = Dataset.serialize_list(dataset.all())
        return result, 200

    def post(self):
        return "only get request is allowed", 400