from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import json
import random
import os
import server_app

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
    # print(request.json['landmark'][0])
    landmark = request.json['landmark']
    image_path = f'../src/assets/Reference/{id}.jpg'
    landmark_data = server_app.landmark_defintion_ref_image(
        image_path, landmark)
    # turn into dictionary
    # data =[(68, 37), (59, 42), (66, 55), (54, 40)]
    landmark_dict = []
    for i in range(int(len(landmark_data))):
        data_dict = {"id": i,
                     "x": landmark_data[i][0], "y": landmark_data[i][1]}
        landmark_dict.append(data_dict)

    # print(landmark_dict)

    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'landmark': landmark_dict
    }})
    return jsonify({
        "msg": "landmark updated"
    })
    # return "success"


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
    data = db['parkinglots'].find_one({'_id': ObjectId(id)})
    landmark = data['landmark']
    title = data['title']
    print(landmark)

    # change landmark to ref_x, ref_y format
    ref_x = [0]
    ref_y = [0]
    for i in range(int(len(landmark))):
        ref_x.append(landmark[i]['x'])
        ref_y.append(landmark[i]['y'])
    print(ref_x, ref_y)

    # calibrate image

    # ref_image_name_test = "test_img_calib/Reference/lmTst_0.jpg"
    ref_image_name_test = f'../src/assets/Reference/{id}.jpg'
    # cur_image_path = "test_img_calib/Data/Mock"
    cur_image_path = '../src/assets/Parking Lots/Sample lot'
    destination = "../src/assets/Calibrated/"
    # parklot_name = "Mock"

    calib_result = server_app.calibrate_image_multiple(
        ref_image_name_test, cur_image_path, destination, title)
    print(calib_result)

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
