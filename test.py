import pandas as pd
import time

def main():
	data = pd.read_json('temp.json')
	start = time.time()
	#print(data.columns)
	trimmed = data[['x', 'y']]
	trimmed = trimmed.sort_values(by = 'x')
	trimmed.to_json('sorted.json')

if __name__ == '__main__':
	main()


