from martapy import BusClient

'''
    In order to generate new json files, run this script.
'''

bus_client = BusClient()
buses = bus_client.buses()


file = open("new_data.json", "r")

file.write(buses.__repr__())
file.close()
