from resources import create_app
import traceback

try:
    app = create_app()
except Exception as e:
    print('Exception ', e)
    print(traceback.format_exc())

