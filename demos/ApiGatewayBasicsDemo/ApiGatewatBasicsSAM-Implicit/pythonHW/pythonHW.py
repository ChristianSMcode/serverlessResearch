import json


def lambda_handler(event,context):
    body = json.loads(event['body'])
    name=body['name']
    message = f'Hello world {name} from python'
    return {
        'statusCode':200,
        'body':json.dumps(message)       
    } 