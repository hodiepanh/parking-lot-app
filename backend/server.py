from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import json
import random
import os
import image_calibration_app
import path
import utilities
app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017")
db = client['BKParking']

CORS(app)


@app.route('/parkinglots', methods=['GET'])
# Fetch all data
def api():
    if request.method == "GET":
        allData = db['parkinglots'].find()
        dataJson = []
        for data in allData:
            id = data['_id']
            title = data['title']

            # As not all field of data is always available
            # We try to fetch each field in this order
            # reference image -> landmark -> roi -> parking slot -> result
            try:
                image = data['image']
                try:
                    landmark = data['landmark']
                    try:
                        result = data['result']
                        try:
                            roi = data['roi']
                            dataDict = {
                                "id": str(id),
                                "title": title,
                                'landmark': landmark,
                                'roi': roi,
                                'image': image,
                                'result': result,
                                # 'slot':str(slot)
                            }
                        except KeyError:
                            dataDict = {
                                "id": str(id),
                                "title": title,
                                'landmark': landmark,
                                'result': result,
                                'image': image,
                            }
                    except KeyError:
                        dataDict = {
                            "id": str(id),
                            "title": title,
                            'landmark': landmark,
                            'image': image,
                        }
                except KeyError:
                    dataDict = {
                        "id": str(id),
                        "title": title,
                        'image': image,
                    }
            except KeyError:
                dataDict = {
                    "id": str(id),
                    "title": title,
                }

            dataJson.append(dataDict)
        return jsonify(dataJson)


@app.route('/parkinglots', methods=['POST'])
# Add new parking lot by adding a title
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

    # As not all field of data is always available
    # We try to fetch each field in this order
    # reference image -> landmark -> roi -> parking slot -> result
    try:
        image = data['image']
        try:
            landmark = data['landmark']
            try:
                result = data['result']
                try:
                    roi = data['roi']
                    dataDict = {
                        "id": str(id),
                        "title": title,
                        'landmark': landmark,
                        'roi': roi,
                        'image': image,
                        'result': result,
                        # 'slot':str(slot)
                    }
                except KeyError:
                    dataDict = {
                        "id": str(id),
                        "title": title,
                        'landmark': landmark,
                        'result': result,
                        'image': image,
                    }
            except KeyError:
                dataDict = {
                    "id": str(id),
                    "title": title,
                    'landmark': landmark,
                    'image': image,
                }
        except KeyError:
            dataDict = {
                "id": str(id),
                "title": title,
                'image': image,
            }
    except KeyError:
        dataDict = {
            "id": str(id),
            "title": title,
        }

    return jsonify(dataDict)


@app.route('/parkinglots/<id>', methods=['DELETE'])
def deleteUser(id):
    data = db['parkinglots'].find_one({'_id': ObjectId(id)})
    title = data['title']

    # Delete reference image from local file
    filename = str(id)+".jpg"
    # Check is reference image exist (name exists) -> remove
    utilities.remove_file(f'{path.reference_path}/{filename}')

    # Remove Binary/Title folder
    if (title == "Test Parking Lot"):
        # For Test parking lot, we don't need to remove the folder, just empty it

        # Remove file in binary folder
        utilities.remove_files(f'{path.binary_path_mock}/Mock')

        # remove file in calibrated folder
        utilities.remove_files(f'{path.calibrated_path_mock}/Mock')

    else:
        # Remove Binary/Title folder: Empty folder -> Remove
        utilities.remove_files(f'{path.binary_path}/{title}')
        utilities.remove_path(f'{path.binary_path}/{title}')

        # Remove Calibrated/Title folder: Empty folder -> Remove
        utilities.remove_files(f'{path.calibrated_path}/{title}')
        utilities.remove_path(f'{path.calibrated_path}/{title}')

        # Remove debug log
        utilities.remove_file(f"debug/debug_log_{title}.csv")

    db['parkinglots'].delete_one({'_id': ObjectId(id)})
    return jsonify({"msg": "Lot deleted"})


@app.route('/parkinglots/<id>/landmark', methods=['PATCH'])
# Add landmark details to the database
def updateLandmark(id):
    # Input is the array of coordinate of (x1,y1,x2,y2)
    landmark = request.json['landmark']

    # Calculate the landmark points base on the coordinates
    image_path = f'{path.reference_path}/{id}.jpg'
    landmark_data = image_calibration_app.landmark_defintion_ref_image(
        image_path, landmark)

    # Update to the database
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'landmark': landmark_data
    }})

    # Debug: check if the landmark data is returned correctly
    # print(id, landmark_data)
    return jsonify({
        "landmark": landmark_data,
        "msg": "landmark updated"
    })


@app.route('/parkinglots/<id>/slot', methods=['PATCH'])
# Add parking slot details to the database
# Currently not in use
def updateSlot(id):
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'slot': request.json['slot']
    }})
    return jsonify({
        "msg": "slot updated"
    })


@app.route('/parkinglots/<id>/roi', methods=['PATCH'])
# Add Region of Interest details on the database
def updateRoi(id):
    roi = request.json['roi']
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'roi': roi
    }})
    return jsonify({
        "roi": roi,
        "msg": "region of interest updated"
    })


@app.route('/parkinglots/<id>/image', methods=['POST'])
# Add reference image details to the database (reference image name)
def fileUpload(id):
    file = request.files.get('image')

    # filename is id (1 parking lot = 1 reference image)
    filename = str(id)+".jpg"

    # Save the file with into the assets/Reference folder
    file.save(os.path.join(path.reference_path, filename))
    print(f"Saved {os.path.join(path.reference_path, filename)}")

    # Update the database - add reference image name
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'image': filename
    }})

    return jsonify({
        "image": filename,
        "msg": "slot updated"
    })


@app.route('/parkinglots/<id>/calibrate', methods=['POST'])
# Calibrate image
def calibrateImage(id):
    # Get the parking lot details from the database
    data = db['parkinglots'].find_one({'_id': ObjectId(id)})
    landmark = data['landmark']
    title = data['title']

    # For some reasons, details of region of interest are not updated sometimes
    try:
        roi = data['roi'][0]
    except KeyError:
        roi = {'x1': 0, 'y1': 0, 'x2': 0, 'y2': 0}

    # Change landmark to ref_x, ref_y format
    ref_x = [0]
    ref_y = [0]
    for i in range(int(len(landmark))):
        ref_x.append(landmark[i]['x'])
        ref_y.append(landmark[i]['y'])

    # Get parameters of reference image (1 image)
    ref_image_name_test = f'{path.reference_path}/{id}.jpg'

    if (title == "Test Parking Lot"):
        # Test parking lot has difference path
        title = "Mock"

        # Clear debug log to write new information
        utilities.clear_file(f"debug/debug_log_{title}.csv")
        cur_image_path = path.cur_image_path
        destination = path.calibrated_path_mock

    else:
        # Clear debug log to write new information
        utilities.clear_file(f"debug/debug_log_{title}.csv")
        cur_image_path = path.mock_path
        destination = path.calibrated_path

    # Calibrate image
    calib_result = image_calibration_app.calibrate_image_multiple(
        ref_image_name_test, cur_image_path, destination, title, roi)
    # Debug
    # print(calib_result)

    # Update to the database: result file name - matching rate
    db['parkinglots'].update_one({'_id': ObjectId(id)}, {'$set': {
        'result': calib_result,
    }})

    return jsonify({
        "result": calib_result,
        "msg": "slot updated"
    })

    # return "success"


if __name__ == "__main__":
    app.run(debug=True)
