from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import json
import random
import os

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017")
db = client['BKParking']

CORS(app)
@app.route('/parkinglots', methods = ['GET'])
def api():
    if request.method =="GET":
        allData = db['parkinglots'].find()
        dataJson=[]
        for data in allData:
            id = data['_id']
            title = data['title']

            try:
                landmark = data['landmark']
                image = data ['image']
                dataDict = {
                    "id": str(id),
                    "title": title,
                    'landmark':landmark,
                    'image':image
                    # 'slot':str(slot)
                }
            except KeyError:
                #slot=data['slot']
                dataDict = {
                    "id": str(id),
                    "title": title,
                    #'landmark':str(landmark),
                    #'slot':str(slot)
                }
            dataJson.append(dataDict)
        return jsonify(dataJson)

    #return {"data": ["data1", "data2", "data3"]}

@app.route('/parkinglots', methods = ['POST'])
def add():
    if request.method =="POST":
        body = request.json
        # if(body['id']==null):
        #id = random.randint(0,100)
        
        
        title=body['title']


        newData = db['parkinglots'].insert_one({
            #"_id":id,
            "title":title
        })

        return jsonify({
            "id": str(newData.inserted_id),
            "title":title,
            "msg":"parking lot added"
        })

@app.route('/parkinglots/<id>', methods=['GET'])
def getUserbyId(id):
    data = db['parkinglots'].find_one({'_id': ObjectId(id)})
    #print(data)

    #id = data['id']
    title = data['title']

    return jsonify({
        #'id': id,
        'title': title
    })

@app.route('/parkinglots/<id>', methods=['DELETE'])
def deleteUser(id):
    db['parkinglots'].delete_one({'_id': ObjectId(id)})
    return jsonify({"msg":"Lot deleted"})

@app.route('/parkinglots/<id>/landmark', methods=['PATCH'])
def updateLandmark(id):
    db['parkinglots'].update_one({'_id':ObjectId(id)},{'$set':{
        'landmark': request.json['landmark']
    }})
    return jsonify({
        "msg": "landmark updated"
    })

@app.route('/parkinglots/<id>/slot', methods=['PATCH'])
def updateSlot(id):
    db['parkinglots'].update_one({'_id':ObjectId(id)},{'$set':{
        'slot': request.json['slot']
    }})
    return jsonify({
        "msg": "slot updated"
    })

@app.route('/parkinglots/<id>/image', methods=['POST'])
def fileUpload(id):
    file = request.files.get('image')
    #filename is id (1 parking lot = 1 reference image)
    
    filename=str(id)+".jpg"
    #check is reference image exist (name exists) -> overwrite if exist
    # if(os.path.exists(f'../src/assets/Reference/{filename}')):
    #     os.remove(f'../src/assets/Reference/{filename}')   
    file.save(os.path.join('../src/assets/Reference', filename))

    db['parkinglots'].update_one({'_id':ObjectId(id)},{'$set':{
        'image': filename
    }})

    return jsonify({
        "image" : filename,
        "msg": "slot updated"
    })

if __name__ == "__main__":
    app.run(debug=True)