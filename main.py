# import nltk
# import zipfile
# import os
# import numpy as np
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize
# from nltk.stem import WordNetLemmatizer
# from nltk import pos_tag
# from PIL import Image, ImageDraw

# # Download NLTK resources (only run once)
# def download_nltk_data():
#     nltk.download('punkt')  # Not 'punkt_tab'
#     nltk.download('averaged_perceptron_tagger_eng')  # Updated
#     nltk.download('wordnet')
#     nltk.download('stopwords')
#     nltk.download('omw-1.4')



# # Process the sentence using NLP
# def process_sentence(sentence):
#     lemmatizer = WordNetLemmatizer()
#     stop_words = set(stopwords.words('english'))

#     # Get POS tag format for WordNetLemmatizer
#     def get_wordnet_pos(tag):
#         if tag.startswith('J'):
#             return 'a'
#         elif tag.startswith('V'):
#             return 'v'
#         elif tag.startswith('N'):
#             return 'n'
#         elif tag.startswith('R'):
#             return 'r'
#         else:
#             return 'n'

#     # NLP pipeline
#     tokens = word_tokenize(sentence)
#     filtered_tokens = [word for word in tokens if word.lower() not in stop_words]
#     pos_tags = pos_tag(filtered_tokens)
#     lemmatized_tokens = [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in pos_tags]
#     return np.array(lemmatized_tokens)

# # Load image files into a dictionary map
# def load_image_files_map(base_dir):
#     image_files_map = {}
#     dataset_path = os.path.join(base_dir, "isl-dataset")

#     for imgDir in os.listdir(dataset_path):
#         dir_path = os.path.join(dataset_path, imgDir)

#         if imgDir == 'Sentences':
#             continue

#         if os.path.isdir(dir_path):
#             file_paths = [os.path.join(dir_path, f) for f in os.listdir(dir_path)]
#             image_files_map[imgDir.lower()] = file_paths
#         else:
#             print(f"Skipping non-directory item: {imgDir}")

#     return image_files_map

# # Create placeholder image for space
# def create_placeholder_image():
#     img = Image.new('RGB', (100, 100), color='white')
#     draw = ImageDraw.Draw(img)
#     draw.line((10, 50, 90, 50), fill='black', width=10)
#     return img

# # Display word or character images
# def display_word_images(processed_words, image_files_map):
#     for word in processed_words:
#         word_lower = word.lower()
#         if word_lower in image_files_map:
#             word_images = image_files_map[word_lower]
#             if word_images:
#                 img = Image.open(word_images[0])
#                 img.show()
#             else:
#                 print(f"No images found for word '{word}'.")
#         else:
#             for char in word.upper():
#                 if char == ' ':
#                     placeholder_img = create_placeholder_image()
#                     placeholder_img.show()
#                 elif char in image_files_map:
#                     char_images = image_files_map[char]
#                     if char_images:
#                         img = Image.open(char_images[0])
#                         img.show()
#                     else:
#                         print(f"No images found for character '{char}'.")
#                 else:
#                     print(f"No image mapping found for character '{char}'.")

# # Extract zip dataset
# def extract_zip_file(zip_path, extract_to='./images'):
#     if not zipfile.is_zipfile(zip_path):
#         raise ValueError("The selected file is not a zip file.")
    
#     with zipfile.ZipFile(zip_path, 'r') as zip_ref:
#         zip_ref.extractall(extract_to)
#         print(f"Extracted to: {extract_to}")

# # MAIN PROGRAM
# if __name__ == "__main__":
#     download_nltk_data()

#     # Path to zip file and base directory
#     zip_file_path = input("Enter path to dataset zip file: ")
#     extract_to_dir = './images'

#     try:
#         extract_zip_file(zip_file_path, extract_to_dir)
#     except Exception as e:
#         print(f"Error: {e}")
#         exit()

#     image_map = load_image_files_map(extract_to_dir)
#     print(f"Loaded {len(image_map)} categories of images.")

#     input_sentence = input("Enter words to find images: ")
#     processed_words = process_sentence(input_sentence)
#     print("Processed Words:", processed_words)

#     display_word_images(processed_words, image_map)


#####  new code #####

import nltk

# Download necessary NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('omw-1.4')

import zipfile
import os

zip_filename = 'isl-dataset.zip'  # Replace with your actual zip filename
extract_to = './images'

with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
    zip_ref.extractall(extract_to)

print(f"Extracted all files to {extract_to}")

image_files_map = {}

dataset_path = './images/isl-dataset'

for imgDir in os.listdir(dataset_path):
    dir_path = os.path.join(dataset_path, imgDir)

    # Skip 'Sentences' folder
    if imgDir == 'Sentences':
        continue

    if os.path.isdir(dir_path):
        file_paths = [os.path.join(dir_path, filename) for filename in os.listdir(dir_path)]
        image_files_map[imgDir.lower()] = file_paths  # Lowercase for matching
    else:
        print(f"Skipping non-directory item: {imgDir}")

print("Total directories processed:", len(image_files_map))

import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk import pos_tag
from PIL import Image, ImageDraw

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return 'a'
    elif tag.startswith('V'):
        return 'v'
    elif tag.startswith('N'):
        return 'n'
    elif tag.startswith('R'):
        return 'r'
    return 'n'

def process_sentence(sentence):
    tokens = word_tokenize(sentence)
    filtered_tokens = [word for word in tokens if word.lower() not in stop_words]
    pos_tags = pos_tag(filtered_tokens)
    lemmatized_tokens = [lemmatizer.lemmatize(word, get_wordnet_pos(tag)) for word, tag in pos_tags]
    return np.array(lemmatized_tokens)

def create_placeholder_image():
    img = Image.new('RGB', (100, 100), color='white')
    draw = ImageDraw.Draw(img)
    draw.line((10, 50, 90, 50), fill='black', width=5)
    return img
input_sentence = input("Enter words to find images: ")
processed_words = process_sentence(input_sentence)
print("\nProcessed Words:", processed_words)

for word in processed_words:
    word_lower = word.lower()
    if word_lower in image_files_map:
        images = image_files_map[word_lower]
        if images:
            Image.open(images[0]).show()
        else:
            print(f"No images found for word '{word}'")
    else:
        print(f"No image for '{word}', trying characters...")
        for char in word.upper():
            if char == ' ':
                create_placeholder_image().show()
            elif char.lower() in image_files_map:
                char_images = image_files_map[char.lower()]
                if char_images:
                    Image.open(char_images[0]).show()
                else:
                    print(f"No images for character '{char}'")
            else:
                print(f"No mapping found for character '{char}'")


