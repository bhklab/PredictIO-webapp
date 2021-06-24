import math
from os import set_blocking
from flask import request
from flask_restful import Resource
from db.models.analysis_request import AnalysisRequest
from db.models.signature_user_requested import UserRequested
from db.models.signature_network import SignatureNetwork
from db.models.signature_kegg_network import SignatureKeggNetwork
from db.models.signature_meta import Meta

class BiomarkerEvaluationResult(Resource):
    def get(self, analysis_id):
        print(analysis_id)
        result = {}

        # get analysis by id
        analysis = AnalysisRequest.query.filter(AnalysisRequest.analysis_id == analysis_id).first()
        result['reqInfo'] = analysis.serialize()
        
        # get dropdown options for outcome and model that exist in the analysis
        dropdown_values = UserRequested.query.with_entities(
            UserRequested.model,
            UserRequested.outcome
        ).filter(
            UserRequested.analysis_id == analysis_id,
            UserRequested.meta_analysis == 1,
            UserRequested.subgroup == 'All',
            UserRequested.n >= 3
        ).all()
        model = list(set(map((lambda item: item[0]), dropdown_values)))
        outcome = list(set(map((lambda item: item[1]), dropdown_values)))
        result['outcomeDropdown'] = sorted(
            list(map((lambda item: {'label': item, 'value': item}), outcome)), 
            key=lambda k: k["label"]
        )
        result['modelDropdown'] = sorted(
            list(map((lambda item: {'label': item, 'value': item}), model)), 
            key=lambda k: k["label"]
        )

        # Get network data
        network_data = SignatureNetwork.query.filter(
            SignatureNetwork.analysis_id == analysis_id
        ).all()
        network_data = SignatureNetwork.serialize_list(network_data)

        # Get kegg network data
        kegg_data = SignatureKeggNetwork.query.filter(
            SignatureKeggNetwork.analysis_id == analysis_id
        ).all()
        kegg_data = SignatureKeggNetwork.serialize_list(kegg_data)

        result['network'] = {
            'network': network_data,
            'kegg': kegg_data
        }

        return result, 200

    def post(self):
        return "Only get method is allowed", 400

class BiomarkerEvaluationVolcanoPlot(Resource):
    def get(self, analysis_id):
        outcome = request.args.get('outcome')
        model = request.args.get('model')
        # get user requested data
        user_requested = UserRequested.query.filter(
            UserRequested.analysis_id == analysis_id,
            UserRequested.meta_analysis == 1,
            UserRequested.outcome == outcome,
            UserRequested.model == model,
            UserRequested.subgroup == 'All',
            UserRequested.n >= 3
        ).all()
        user_requested = UserRequested.serialize_list(user_requested)
        for row in user_requested:
            del row['analysis_request']
            row['signature'] = 'Custom'

        # get pre-computed data
        if model == 'LogReg':
            model = 'Log_regression'
            
        precomputed = Meta.query.filter(
            Meta.outcome == outcome,
            Meta.model == model,
            Meta.subgroup == 'ALL',
            Meta.n >= 3
        )
        precomputed = Meta.serialize_list(precomputed)
        volcano = user_requested + precomputed
        for row in volcano:
            row['logPval'] = -math.log10(row['pval'])
    
        return volcano, 200

    def post(self):
        return "Only get method is allowed", 400

class BiomarkerEvaluationForestPlot(Resource):
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