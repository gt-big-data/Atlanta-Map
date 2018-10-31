from martapy import BusClient

'''
    To run the server, just call `python api.py`
    The server will run on http://127.0.0.1:5000/
    The only route I have assigned is
    http://127.0.0.1:5000/get_buses. You can only run GET
    request on it. You can test it using `python test.py`

    pip install flask, martapy, requests
'''

def get_bus_data(): # method that returns data to send to the client
    return [1,2,3]



from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route("/get_buses", methods=['GET'])
def get_buses():
    if request.method == 'GET':
        return jsonify(get_bus_data()) #Transforms data stored
    else:
        return "405: Restricted method"

if __name__ == '__main__':
    app.run()
