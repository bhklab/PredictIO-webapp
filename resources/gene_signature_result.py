import math
from flask import request
from flask_restful import Resource
from db.models.analysis_request import AnalysisRequest
from db.models.signature_user_requested import UserRequested

class GeneSignatureResult(Resource):
    def get(self, analysis_id):
        print(analysis_id)
        result = {}

        analysis = AnalysisRequest.query.filter(AnalysisRequest.analysis_id == analysis_id).first()

        volcano = UserRequested.query.filter(
            UserRequested.analysis_id == analysis_id,
            UserRequested.meta_analysis == 1,
            UserRequested.subgroup == 'All',
            UserRequested.n >= 3
        ).all()
        volcano = UserRequested.serialize_list(volcano)
        for row in volcano:
            del row['analysis_request']
            row['logPval'] = -math.log10(row['pval'])
        
        result['reqInfo'] = analysis.serialize()
        result['result'] = volcano

        return result, 200

    def post(self):
        return "Only get method is allowed", 400

class GeneSignatureVolcanoPlot(Resource):
    def get(self, analysis_id):
        volcano = UserRequested.query.filter(
            UserRequested.analysis_id == analysis_id,
            UserRequested.meta_analysis == 1,
            UserRequested.subgroup == 'All',
            UserRequested.n >= 3
        ).all()
        volcano = UserRequested.serialize_list(volcano)
        for row in volcano:
            del row['analysis_request']
            row['logPval'] = -math.log10(row['pval'])

        return volcano, 200

    def post(self):
        return "Only get method is allowed", 400

class GeneSignatureForestPlot(Resource):
    def get(self, analysis_id):
        result = {}

        model = request.args.get('model')
        outcome = request.args.get('outcome')
        
        total_list = UserRequested.query.filter(
            UserRequested.analysis_id == analysis_id,
            UserRequested.model == model,
            UserRequested.outcome == outcome
        ).all()
        total_list = UserRequested.serialize_list(total_list)
        for row in total_list:
            del row['analysis_request']

        result['individuals'] = [item for item in total_list if item['meta_analysis'] == 0]
        result['meta'] = [item for item in total_list if item['meta_analysis'] == 1]

        return result, 200

    def post(self):
        return "Only get method is allowed", 400