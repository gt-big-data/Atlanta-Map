from martapy import BusClient

bus_client = BusClient()
buses = bus_client.buses()

print(buses)
