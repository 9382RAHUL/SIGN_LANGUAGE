
### UPDATED CODE ON 13062025 AT 21.54

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import zipfile
# import base64
# import nltk
# import numpy as np
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import WordNetLemmatizer
# from nltk import pos_tag

# # Download necessary NLTK resources
# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
# nltk.download('stopwords')
# nltk.download('omw-1.4')

# app = Flask(__name__)
# CORS(app)

# # =====================
# # Dataset Configuration
# # =====================
# DATASET_FOLDER = './images/isl-dataset'
# image_files_map = {}      # For words and alphabets
# sentence_image_map = {}   # For full sentences (.gif)

# # Load images for letters/words
# for dir_name in os.listdir(DATASET_FOLDER):
#     dir_path = os.path.join(DATASET_FOLDER, dir_name)

#     if dir_name.lower() == 'sentences':
#         # Handle sentence folders with .gif files
#         sentences_dir = dir_path
#         for sentence_folder in os.listdir(sentences_dir):
#             folder_path = os.path.join(sentences_dir, sentence_folder)
#             if os.path.isdir(folder_path):
#                 for file in os.listdir(folder_path):
#                     if file.endswith('.gif'):
#                         sentence_key = sentence_folder.lower().strip()
#                         sentence_image_map[sentence_key] = os.path.join(folder_path, file)
#     elif os.path.isdir(dir_path):
#         file_paths = [os.path.join(dir_path, f) for f in os.listdir(dir_path)]
#         image_files_map[dir_name.lower()] = file_paths

# print("✅ Dataset Loaded:")
# print("  -> Word/Alphabet directories:", len(image_files_map))
# print("  -> Sentences loaded:", len(sentence_image_map))

# # =====================
# # NLP Preprocessing
# # =====================
# lemmatizer = WordNetLemmatizer()
# stop_words = set(stopwords.words('english'))

# def get_wordnet_pos(tag):
#     if tag.startswith('J'): return 'a'
#     elif tag.startswith('V'): return 'v'
#     elif tag.startswith('N'): return 'n'
#     elif tag.startswith('R'): return 'r'
#     return 'n'

# def process_sentence(sentence):
#     tokens = word_tokenize(sentence)
#     filtered = [w for w in tokens if w.lower() not in stop_words]
#     tagged = pos_tag(filtered)
#     return [lemmatizer.lemmatize(w, get_wordnet_pos(t)) for w, t in tagged]

# # =====================
# # Convert Image to Base64
# # =====================
# def image_to_base64(image_path):
#     with open(image_path, "rb") as f:
#         return base64.b64encode(f.read()).decode("utf-8")

# # =====================
# # API Route
# # =====================
# @app.route('/convert', methods=['POST'])
# def convert_to_isl():
#     data = request.get_json()
#     input_sentence = data.get('sentence', '').lower().strip()

#     result_images = []

#     # 1. Try Full Sentence Match
#     if input_sentence in sentence_image_map:
#         gif_path = sentence_image_map[input_sentence]
#         result_images.append({
#             "type": "gif",
#             "label": input_sentence,
#             "data": image_to_base64(gif_path),
#         })
#         return jsonify(result_images)

#     # 2. Process sentence into words
#     processed_words = process_sentence(input_sentence)
#     print("Processed Words:", processed_words)

#     for word in processed_words:
#         word_lower = word.lower()

#         # 2a. Try word-level match
#         if word_lower in image_files_map:
#             image_path = image_files_map[word_lower][0]
#             result_images.append({
#                 "type": "image",
#                 "label": word_lower,
#                 "data": image_to_base64(image_path)
#             })
#         else:
#             # 2b. Fallback to characters
#             for char in word.upper():
#                 char_lower = char.lower()
#                 if char_lower in image_files_map:
#                     image_path = image_files_map[char_lower][0]
#                     result_images.append({
#                         "type": "image",
#                         "label": char_lower,
#                         "data": image_to_base64(image_path)
#                     })

#     return jsonify(result_images)

# # =====================
# # Run the server
# # =====================
# if __name__ == "__main__":
#     app.run(debug=True)





import chromadb
from chromadb.config import Settings

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import zipfile
import base64
import nltk
import numpy as np
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag

# Conditionally download NLTK resources if not already present
def download_nltk_resource(resource, path):
    try:
        nltk.data.find(path)
    except LookupError:
        nltk.download(resource)

download_nltk_resource('punkt', 'tokenizers/punkt')
download_nltk_resource('averaged_perceptron_tagger', 'taggers/averaged_perceptron_tagger')
download_nltk_resource('wordnet', 'corpora/wordnet')
download_nltk_resource('stopwords', 'corpora/stopwords')
download_nltk_resource('omw-1.4', 'corpora/omw-1.4')


app = Flask(__name__)
CORS(app)

# =====================
# Dataset Configuration
# =====================
DATASET_FOLDER = './images/isl-dataset'
image_files_map = {}      # For words and alphabets
sentence_image_map = {}   # For full sentences (.gif)

# Load images for letters/words
for dir_name in os.listdir(DATASET_FOLDER):
    dir_path = os.path.join(DATASET_FOLDER, dir_name)

    if dir_name.lower() == 'sentences':
        # Handle sentence folders with .gif files
        sentences_dir = dir_path
        for sentence_folder in os.listdir(sentences_dir):
            folder_path = os.path.join(sentences_dir, sentence_folder)
            if os.path.isdir(folder_path):
                for file in os.listdir(folder_path):
                    if file.lower().endswith(('.gif', '.mp4', '.avi', '.mvi', '.mov', '.webm')):
                        sentence_key = sentence_folder.lower().strip()
                        sentence_image_map[sentence_key] = os.path.join(folder_path, file)

    elif os.path.isdir(dir_path):
        media_files = []
        for f in os.listdir(dir_path):
            if f.lower().endswith(('.gif', '.png', '.jpg', '.jpeg', '.mp4', '.avi', '.mvi', '.webm')):
                media_files.append(os.path.join(dir_path, f))
        if media_files:
            image_files_map[dir_name.lower()] = media_files


print("✅ Dataset Loaded:")
print("  -> Word/Alphabet directories:", len(image_files_map))
print("  -> Sentences loaded:", len(sentence_image_map))

# =====================
# ChromaDB Integration
# =====================
chroma_client = chromadb.Client(Settings(anonymized_telemetry=False))

# Extract all sentence keys (these are folder names under "Sentences")
sentence_array = list(sentence_image_map.keys())

# Create Chroma collection for sentence matching
collection = chroma_client.get_or_create_collection(
    name="isl_sentences",
    metadata={"hnsw:space": "ip"}
)

# Only add if not already added
if collection.count() == 0:
    collection.add(
        documents=sentence_array,
        ids=[str(i) for i in range(len(sentence_array))]
    )
    print("✅ ChromaDB sentence collection added.")


# =====================
# NLP Preprocessing
# =====================
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def get_wordnet_pos(tag):
    if tag.startswith('J'): return 'a'
    elif tag.startswith('V'): return 'v'
    elif tag.startswith('N'): return 'n'
    elif tag.startswith('R'): return 'r'
    return 'n'

def process_sentence(sentence):
    tokens = word_tokenize(sentence)
    filtered = [w for w in tokens if w.lower() not in stop_words]
    tagged = pos_tag(filtered)
    return [lemmatizer.lemmatize(w, get_wordnet_pos(t)) for w, t in tagged]

# =====================
# Convert Image to Base64
# =====================
def media_to_base64(media_path):
    with open(media_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")
    ext = os.path.splitext(media_path)[1].lower()
    if ext in ['.gif', '.png', '.jpg', '.jpeg']:
        media_type = 'gif' if ext == '.gif' else 'image'
    else:
        media_type = 'video'
    return media_type, encoded


# =====================
# API Route
# =====================

@app.route('/convert', methods=['POST'])
def convert_to_isl():
    data = request.get_json()
    input_sentence = data.get('sentence', '').lower().strip()

    result_images = []

    # 1. Try Semantic Match using ChromaDB
    results = collection.query(query_texts=[input_sentence], n_results=3)

    found_sentence = ''
    min_score = 1.0

    for doc, score in zip(results['documents'][0], results['distances'][0]):
        if score < 0.15 and score < min_score:
            found_sentence = doc
            min_score = score

    if found_sentence and found_sentence in sentence_image_map:
        media_path = sentence_image_map[found_sentence]
        media_type, encoded_data = media_to_base64(media_path)
        result_images.append({
            "type": media_type,
            "label": found_sentence,
            "data": encoded_data,
        })
        return jsonify(result_images)


    # 2. Process sentence into words
    processed_words = process_sentence(input_sentence)
    print("Processed Words:", processed_words)

    for word in processed_words:
        word_lower = word.lower()

        # 2a. Try word-level match
        if word_lower in image_files_map:
            media_path = image_files_map[word_lower][0]
            media_type, encoded_data = media_to_base64(media_path)
            result_images.append({
                "type": media_type,
                "label": word_lower,
                "data": encoded_data
            })
        else:
            # 2b. Fallback to characters
            for char in word.upper():
                char_lower = char.lower()
                if char_lower in image_files_map:
                    media_path = image_files_map[char_lower][0]
                    media_type, encoded_data = media_to_base64(media_path)
                    result_images.append({
                        "type": media_type,
                        "label": char_lower,
                        "data": encoded_data
                    })


    return jsonify(result_images)

# =====================
# Run the server
# =====================
# Run the server
if __name__ == "__main__":
    app.run(debug=True)




# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import base64
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import WordNetLemmatizer
# from nltk import pos_tag
# import nltk

# # Download NLTK data
# nltk.download('punkt')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('wordnet')
# nltk.download('stopwords')

# app = Flask(__name__)
# CORS(app)

# DATASET_PATH = './images/isl-dataset'

# # Prepare the dataset
# sentence_gif_map = {}
# alphabet_map = {}
# word_map = {}

# for dir_name in os.listdir(DATASET_PATH):
#     dir_path = os.path.join(DATASET_PATH, dir_name)
#     if not os.path.isdir(dir_path):
#         continue

#     if dir_name.lower() == 'sentences':
#         for file in os.listdir(dir_path):
#             if file.endswith('.gif'):
#                 sentence = file.replace('.gif', '').lower().strip()
#                 sentence_gif_map[sentence] = os.path.join(dir_path, file)
#     elif dir_name.lower() == 'alphabets':
#         for file in os.listdir(dir_path):
#             if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
#                 char = os.path.splitext(file)[0].lower()
#                 alphabet_map[char] = os.path.join(dir_path, file)
#     elif dir_name.lower() == 'words':
#         for file in os.listdir(dir_path):
#             if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
#                 word = os.path.splitext(file)[0].lower()
#                 word_map[word] = os.path.join(dir_path, file)

# print("✅ Dataset loaded")
# print("• Sentences:", len(sentence_gif_map))
# print("• Words:", len(word_map))
# print("• Alphabets:", len(alphabet_map))

# # NLP tools
# lemmatizer = WordNetLemmatizer()
# stop_words = set(stopwords.words('english'))

# def get_wordnet_pos(tag):
#     if tag.startswith('J'): return 'a'
#     elif tag.startswith('V'): return 'v'
#     elif tag.startswith('N'): return 'n'
#     elif tag.startswith('R'): return 'r'
#     return 'n'

# def process_sentence(sentence):
#     tokens = word_tokenize(sentence)
#     filtered_tokens = [t for t in tokens if t.lower() not in stop_words]
#     tagged = pos_tag(filtered_tokens)
#     lemmatized = [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in tagged]
#     return lemmatized

# def encode_image(image_path):
#     with open(image_path, 'rb') as img_file:
#         return base64.b64encode(img_file.read()).decode('utf-8')

# @app.route('/convert', methods=['POST'])
# def convert_to_sign_language():
#     data = request.get_json()
#     user_input = data.get('sentence', '').strip().lower()
#     response_images = []

#     # 1. Exact match sentence
#     if user_input in sentence_gif_map:
#         gif_path = sentence_gif_map[user_input]
#         response_images.append({
#             'label': user_input,
#             'data': encode_image(gif_path)
#         })
#         return jsonify(response_images)

#     # 2. Process by words
#     words = process_sentence(user_input)

#     for word in words:
#         if word in word_map:
#             response_images.append({
#                 'label': word,
#                 'data': encode_image(word_map[word])
#             })
#         else:
#             # 3. Break into characters
#             for char in word:
#                 if char in alphabet_map:
#                     response_images.append({
#                         'label': char,
#                         'data': encode_image(alphabet_map[char])
#                     })

#     return jsonify(response_images)

# if __name__ == '__main__':
#     app.run(debug=True)
