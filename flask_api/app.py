from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pandas as pd
import requests
from cache import medical_fields
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
load_dotenv()

api_url = os.getenv("API_URL")
app = Flask(__name__)
response = requests.get(api_url)
if response.status_code == 200:
  data = response.json()
  df = pd.DataFrame(data)
  data_df = pd.json_normalize(df["data"],sep="_")

else:
  print(f"Failed to fetch data. Status code: {response.status_code}")

def replace_with_field_name(text):
    """Replaces words in the user input with their corresponding medical fields."""
    words = text.split()
    updated_words = []
    for word in words:
        matched = False
        for field, terms in medical_fields.items():
            if word.lower() in map(str.lower, terms):
                updated_words.append(field)
                matched = True
                break
        if not matched:
            updated_words.append(word)
    return " ".join(updated_words)
useful=data_df[['BasicInfo_HospitalName','_id','BasicInfo_RegistrationNumber','PatientRating','OnsiteRating','Amenities_Specialization','Amenities_Facilities','BasicInfo_AddressInformation','Reviews','Ratings','ConsultationFee']]
def preprocess(dataframe):
    dataframe['Facilities']= (dataframe['Amenities_Specialization'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '') +
    ' ' +
    dataframe['Amenities_Facilities'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')+
    ' ' +
    dataframe['Processed_Address'].apply(str) +
    ' '+
    dataframe['ConsultationFee'].apply(str)+ ' ')
    dataframe=dataframe[['BasicInfo_HospitalName','_id','BasicInfo_RegistrationNumber','PatientRating','OnsiteRating','Facilities','Reviews','Ratings','ConsultationFee']]
    return dataframe

def process_address(address_list):
    if isinstance(address_list, list) and len(address_list) > 0:
        address = address_list[0]
        cleaned_address = {key: value.replace(" ", "") for key, value in address.items()}
        return " ".join([str(value) for value in cleaned_address.values()])
    return ''

useful['Processed_Address'] = useful['BasicInfo_AddressInformation'].apply(process_address)
def get_similar_hospitals(user_prompt, dataframe):
    all_texts = dataframe['Facilities'].tolist() + [user_prompt]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    similarity_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()
    dataframe['SimilarityScore'] = similarity_scores
    sorted_hospitals = dataframe.sort_values(by='SimilarityScore', ascending=False)

    return sorted_hospitals[['BasicInfo_HospitalName', '_id','SimilarityScore', 'Facilities','PatientRating','OnsiteRating','Ratings','Reviews','ConsultationFee']]

@app.route('/api/v1/recommendations', methods=['POST'])
def recommend():
  user_prompt = request.json.get('user_prompt',"")
  if response.status_code == 200:
    if user_prompt:
      user_prompt = replace_with_field_name(user_prompt)
      sorted_hospitals = get_similar_hospitals(user_prompt, preprocess(useful))
      return jsonify(sorted_hospitals.to_dict(orient='records'))
    else:
      return jsonify({"message": "Please provide a user prompt."}), 400
  else:
    return jsonify({"message": "Failed to fetch data. Please try again later."}), 500
if __name__ == '__main__':
  host = os.getenv('HOST', '0.0.0.0')
  port = int(os.getenv('PORT', 5000))
  app.run(host=host, port=port)