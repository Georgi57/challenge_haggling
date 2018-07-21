import urllib.request
import datetime

def search_text(webpage, location, search_text, end_text):

	ending = 0
	
	if (isinstance(search_text, list)):
		for text in search_text:
			location = webpage.find(text, location)
	elif (isinstance(search_text, str)):
		location = webpage.find(search_text, location)
	
	ending = webpage.find(end_text, location)
	
	return location, webpage[location-1:ending+1]

if __name__ == '__main__':
	
	# Get statistics webpage
	webpage = str(urllib.request.urlopen("https://hola.org/challenges/haggling/scores/standard_1s").read())
	
	my_hashes = [	
				"f764dc3127e0e6d1f1c48562262eff97",
				"d60893281b1f7bd8e83ed0a0a26cf6dd",
				"220f9602116165ff6140914f902beaa3",
				"1d9174637927cad7285022a029e8be21",
				"b4e5f0d39a5d51242f13c2e9a327293d",
				"61c8082ba70a89da82a929632e2a81a2",
				"ba84741d4c44f9162c6c57fc5856f486",
				"9f725de97872f0d65e7a1680a73d7791",
				"5ecafe49994e5412c7288be61d127cab",]
#				"b221a4a178665565d2f00a124ac1adf1",
#				"c674de2b3e82a07c490f6d85859243bf",
#				"742df4fef107d8340bb06d16e3536a89",
#				"6e11d7c9ba210f4e012b995350e79577"]

	print ("My results:")
	my_ratios = []
	
	# Search for my hashes
	for hash in my_hashes:
		location, text = search_text(webpage, 0, hash, '},\\n  "')
		text_array = text.split("\\n")
		print (text_array[0], len(text_array))
		
		if (len(text_array)>1):
		
			sessions = float(text_array[-5][18:].replace(",",""))
			score = float(text_array[-3][15:])
			print ("\t",sessions, score, "\t\t", score/sessions)
			my_ratios.append([score/sessions, sessions, score])
	
	now = datetime.datetime.now()
	date = now.strftime("%Y-%m-%d")
	
	print ("Now some best results overall today,", date)
	
	best_results = []
	location = 1
	i=0
	
	while (location):
	
		location = webpage.find(date, location)
		
		session_start = webpage.find('"sessions":', location + 1) + 12
		session_end = webpage.find(",", session_start)
		sessions = float(webpage[session_start:session_end])
		
		score_start = webpage.find('"score":', location + 1) + 9
		score_end = webpage.find(" ", score_start)
		score = float(webpage[score_start:score_end].replace("\\n",""))
		
		if (sessions>200):
			best_results.append([score/sessions, sessions, score])
		
		location+=1
			
	best_results.sort(reverse=True)
	
	for i in range(0,20):
		print (i, best_results[i])
		if (best_results[i] in my_ratios):
			print ("me")
	
	
	