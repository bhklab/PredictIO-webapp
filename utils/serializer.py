from sqlalchemy.inspection import inspect

'''
Contains methods used to serialize sqlalchemy results 
in order to be consumed by the front-end as json objects
'''
class Serializer(object):

    '''
    Serialize one object
    '''
    def serialize(self):
        return {name: getattr(self, name) for name in inspect(self).attrs.keys()}

    '''
    Serialize a list of objects
    '''
    @staticmethod
    def serialize_list(obj_list):
        return [item.serialize() for item in obj_list]