from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import json
import random
import os
from app import tranform_image, transform_images_from_folder, mock_path, input_path

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017")
db = client['BKParking']

CORS(app)


@app.route('/parkinglots', methods=['GET'])
def api():
    if request.method == "GET":
        allData = db['parkinglots'].find()
        dataJson = []
        for data in allData:
            id = data['_id']
            title = data['title']

            try:
                landmark = data['landmark']
                image = data['image']
                result = data['result']
                dataDict = {
                    "id": str(id),
                    "title": title,
                    'landmark': landmark,
                    'image': image,
                    'result': result,
                    # 'slot':str(slot)
                }
            except KeyError:
                # slot=data['slot']
                dataDict = {
                    "id": str(id),
                    "title": title,
                    # 'landmark':str(landmark),
                    # 'slot':str(slot)
                }
            dataJson.append(dataDict)
            # import function from another python file
            # print_sth("import success")
        return jsonify(dataJson)


@app.route('/parkinglots', methods=['POST'])
def add():
    if request.method == "POST":
        body = request.json
        title = body['title']

        newData = db['parkinglots'].insert_one({
            # "_id":id,
            "title": title
        })

        return jsonify({
            "id": str(newData.inserted_id),
            "title": title,
            "msg": "parking lot added"
        })


@app.route('/parkinglots/<id>', methods=['GET'])
def getUserbyId(id):
    data = db['parkinglots'].find_one({'_id': ObjectId(id)})

    id = data['_id']
    title = data['title']

    try:
        landmark = data['landmark']
        image = data['image']
        result = data['result']
        dataDict = {
            "id": str(id),
            "title": title,
            'landmark': landmark,
            'image': image,
            'result': result,
            # 'slot':str(slot)
        }
    except KeyError:
        # slot=data['slot']
        dataDict = {
            "id": str(id),
            "title": title,
            # 'landmark':str(landmark),
            # 'slot':str(slot)
        }

    return jsonify(dataDict)


@app.route('/parkinglots/<id>', methods=['DELETE'])
def deleteUser(id):
    # delete reference image from local file
    filename = str(id)+".jpg"
    # check is reference image exist (name exists) -> remove
    if (os.path.exists(f'../src/assets/Reference/{filename}')):
        os.remove(f'../src/assets/Reference/{filename}')

    db['parkinglots'].delete_one({'_id': ObjectId(id)})
    return jsonify({"msg": "Lot deleted"})


@app.route('/parkinglots/<id>/landmark', methods=['PATCH'])
def updateLandmark(id):
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'landmark': request.json['landmark']
    }})
    return jsonify({
        "msg": "landmark updated"
    })


@app.route('/parkinglots/<id>/slot', methods=['PATCH'])
def updateSlot(id):
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'slot': request.json['slot']
    }})
    return jsonify({
        "msg": "slot updated"
    })


@app.route('/parkinglots/<id>/image', methods=['POST'])
def fileUpload(id):
    file = request.files.get('image')
    # filename is id (1 parking lot = 1 reference image)

    filename = str(id)+".jpg"

    # check is reference image exist (name exists) -> overwrite if exist

    file.save(os.path.join('../src/assets/Reference', filename))

    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'image': filename
    }})

    return jsonify({
        "image": filename,
        "msg": "slot updated"
    })


@app.route('/parkinglots/<id>/calibrate', methods=['POST'])
def calibrateImage(id):
    file = request.files.get('image')
    title = request.json['title']

    # function to get files array from the path - calibrate - rename - save into directory
    # return the result filenames array
    calib_result = transform_images_from_folder(mock_path, title)
    # print(filename_result)

    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'result': calib_result
    }})

    return jsonify({
        "result": calib_result,
        "msg": "slot updated"
    })

    # return "success"


if __name__ == "__main__":
    app.run(debug=True)
