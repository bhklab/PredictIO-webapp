from flask_restful import Resource
from flask import request
import traceback
from db.models.analysis_request import AnalysisRequest


class UserAnalysisStatus(Resource):
    def get(self):
        result = {
            'analyses': []
        }
        req_status = 200
        email = request.args.get('email')
        try:
            analyses = AnalysisRequest.query.filter(
                AnalysisRequest.email == email
            ).order_by(
                AnalysisRequest.time_submitted.desc()
            ).all()

            def parse_object(analysis):
                status = 'processing'
                time_completed = None
                notes = None
                if (hasattr(analysis, 'error') and analysis.error):
                    status = 'error'
                    notes = 'Please contact support@predictio.ca.'
                if (analysis.time_completed):
                    status = 'complete'
                    time_completed = analysis.time_completed.strftime(
                        '%Y-%m-%d, %H:%M:%S')
                return ({
                    'analysis_id': analysis.analysis_id,
                    'analysis_type': analysis.analysis_type,
                    'time_submitted': analysis.time_submitted.strftime('%Y-%m-%d, %H:%M:%S'),
                    'time_completed': time_completed,
                    'status': status,
                    'notes': notes
                })
            result['analyses'] = list(
                map((lambda analysis: parse_object(analysis)), analyses))
        except Exception as e:
            print('Exception ', e)
            print(traceback.format_exc())
            req_status = 500
        finally:
            return result, req_status

    def post(self):
        return "Only get method is allowed", 400
