from flask_restful import Resource
from db.models.analysis_request import AnalysisRequest
from db.models.predictio_result import PredictIOResult


class PredictIO(Resource):
    def get(self, analysis_id):
        result = {
            'found': False,
            'not_ready': True
        }
        analysis = AnalysisRequest.query.filter(
            AnalysisRequest.analysis_id == analysis_id, AnalysisRequest.analysis_type == 'predictio'
        ).first()
        if (analysis and analysis.time_completed):
            print(analysis.analysis_id)
            result['reqInfo'] = {
                'analysis_id': analysis.analysis_id,
                'analysis_type': analysis.analysis_type,
                'time_submitted': analysis.time_submitted.strftime('%Y-%m-%d, %H:%M:%S'),
                'time_completed': analysis.time_completed.strftime('%Y-%m-%d, %H:%M:%S')
            }
            predictio = PredictIOResult.query.filter(
                PredictIOResult.analysis_id == analysis_id
            ).all()
            predictio = PredictIOResult.serialize_list(predictio)
            for row in predictio:
                del row['id']
                del row['analysis_id']
                del row['predictio_result']
            result['predictio'] = predictio
            result['found'] = True
            result['not_ready'] = False
        elif (analysis and analysis.time_completed is None):
            result['found'] = True
            result['not_ready'] = True

        if (analysis and hasattr(analysis, 'error') and analysis.error):
            result['found'] = True
            result["error"] = True
            result['not_ready'] = False
            result["analysis_id"] = analysis.analysis_id

        return result, 200

    def post(self):
        return "Only get method is allowed", 400
