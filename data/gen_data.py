from martapy import BusClient
import json
import cherrypy
from cherrypy import tools

'''
    In order to generate new json files, run this script.
    Update: actually sets up a CherryPy server which simulates the server the frontend will be contacting
'''

def error_page_404(status, message, traceback, version):
    return "404 Error!"

class HomeController():
    @cherrypy.expose
    @cherrypy.tools.json_out()
    def GetBuses(self, **kwargs):
        bus_client = BusClient()
        # buses = bus_client.buses()
        # print(buses[0])
        # return buses
        with open('new_data.json', 'r') as newFile:
            buses = json.load(newFile)
        with open('old_data.json', 'r') as oldFile:
            oldBuses = json.load(oldFile)
            # oldfile = open("old_data.json", "w")
            # oldfile.write(buses.__repr__())
            # oldfile.close()
        return {"buses": buses, "oldBuses": oldBuses}


def start_server():
    cherrypy.tree.mount(HomeController(), '/')
    cherrypy.config.update({'error_page.404': error_page_404})
    cherrypy.config.update({'server.socket_port': 8080})
    cherrypy.config.update({'tools.response_headers.headers': [('Access-Control-Allow-Origin', 'http://localhost:8000')]})
    cherrypy.config.update({'tools.response_headers.on': True})
    cherrypy.engine.start()


if __name__ == '__main__':
    start_server()

    # https://simpletutorials.com/c/2165/How%20to%20Create%20a%20Simple%20JSON%20Service%20with%20CherryPy