import requests

print(requests.get("http://127.0.0.1:5000/get_buses").text)
