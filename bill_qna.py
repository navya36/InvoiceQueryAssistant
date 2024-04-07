from flask import Flask, request, jsonify
from flask_cors import CORS
import gemini_util as genAi
from PIL import Image
from pymongo import MongoClient
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)

# Update the analyze endpoint to include the user's email when storing chat history
@app.route("/api/billqna", methods=['POST'])
def analyze():
    try:
        # Retrieve the uploaded image, query, and user_email from the request
        client = MongoClient('mongodb://localhost:27017/')
        db = client['bill']
        collection = db['chat_history']
        uploaded_file = request.files['image']
        query = request.form.get('query', '')
        email = request.form.get('email', '')  # Get user_email from request

        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            buffered = BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        # Prompt for processing the image
        prompt = """
            You are an expert in understanding invoices. 
            You will receive input image as invoice & you have to answer questions based on the input image.
            You're equipped with expertise in deciphering invoices. 
            Your task is to scrutinize the provided image, which represents an invoice, and provide detailed responses to questions based on the contents of the invoice.
            Your keen eye for detail and comprehensive understanding of invoice components will be instrumental in generating accurate responses.

            For example :
            If there is a query like "What are the items in the bill"
            The response will be like:
            "The items in the bill are:
            Item1- Quantity
            Item2- Quantity
            ---------------"
        """

        finalPrompt = prompt + "" + query

        if not prompt or not image:
            return jsonify({'error': 'Prompt and image are required.'}), 400

        # Call the function to process the image and generate a response
        response = genAi.get_gemini_pro_vision_response(image, finalPrompt)
        resdata = {
            'email':email,  # Include user_email in the data to be inserted
            'image': img_str,
            'query': query,
            'response': response
        }
        collection.insert_one(resdata)

    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred.'}), 500

    return jsonify({'response': response})


@app.route("/api/get_chat_history", methods=['GET'])
def get_chat_history():
    # Retrieve chat history from MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['bill']
    collection = db['chat_history']
    try:
        email = request.args.get('email')
        chat_history = list(collection.find({'email': email}, {'_id': 0}))
        return jsonify(chat_history)
    except Exception as e:
        return jsonify({"error": str(e)})



@app.route("/api/register", methods=['POST'])
def register():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['bill']
    collection = db['users']
    data = request.json
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    user_data = {
        'name': name,
        'email': email,
        'phone': phone,
        'password': password
    }
    try:
        collection.insert_one(user_data)
        return "registered successfully"
    except Exception as e:
        return str(e)


@app.route("/api/login", methods=['POST'])
def login():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['bill']
    collection = db['users']
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user_data = {
        'email': email,
        'password': password
    }
    user = collection.find_one({'email': email, 'password': password})
    if user:
        return "login successful"
    else:
        return "login failed"


if __name__ == "__main__":
    app.run( port=5000, debug=True,host="192.168.100.191")
