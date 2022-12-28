# import imutils
import math
import landmark_recognition
import cv2 as cv
import numpy as np
import os
# define path here
input_path = "../src/assets/Reference"
output_path = "../src/assets/Calibrated"
mock_path = "../src/assets/Parking Lots/Sample lot"
# input
# img = cv.imread(f"{input_path}/lmTst_0.jpg")
img = cv.imread("../src/assets/TestData/lmTst_0.jpg")

# resize


def resize_image(image, scale_percent):
    # percent of original size
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)
    result = cv.resize(image, dim)
    return result


# img = resize_image(img, 50)
# draw dot on image
def show_image(name, image):
    cv.imshow(name, image)
    cv.waitKey(0)


def image_draw_dot(image, coord):
    # draw a red dot
    image_result = cv.circle(image, coord, radius=0,
                             color=(0, 0, 255), thickness=5)
    # make the image 50% smaller
    image_result = resize_image(image_result, 50)

    return image_result


# image_draw = image_draw_dot(img, (100, 100))

# draw line/vector on image
def image_draw_line(image, vector):
    image_result = cv.line(
        image, vector[0], vector[1], color=(0, 0, 255), thickness=9)
    # image_result = resize_image(image_result, 50)
    return image_result
# rotate by degree around center


# image_draw_line_test = image_draw_line(img, [(0, 0), (500, 500)])
# show_image("test", image_draw_line_test)


def rotate_image(image, angle):
    (height, width) = image.shape[:2]
    (cX, cY) = (width // 2, height // 2)
    M = cv.getRotationMatrix2D((cX, cY), angle, 1.0)
    rotated = cv.warpAffine(image, M, (width, height))
    return rotated


# img = rotate_image(img, 45)

# translate
def translate_image(image, hor, ver):
    # shift the image 25 pixels to the right and 50 pixels down
    # hor<0 -> shift left, hor>0 -> shift right
    # ver<0-> shift up, ver>0 -> shift down
    M = np.float32([[1, 0, hor], [0, 1, ver]])
    shifted = cv.warpAffine(image, M, (image.shape[1], image.shape[0]))
    return shifted


# img = translate_image(img, -25, 50)

# save into directory


def save_image(image):
    cv.imwrite('../src/assets/Parking Lots/Sample lot/Image.jpg', image)

# output show on screen


def print_sth(something):
    print(something)

# function to get file from the filename - resize - rotate - rename - save into directory
# 1 input - 1 output


def tranform_image(name, directory, image):
    img = cv.imread(image)
    img = resize_image(img, 50)
    img = rotate_image(img, 45)
    # img_name = image + "_rotated.jpg"
    if (os.path.isdir(f'{output_path}/{directory}') is False):
        os.mkdir(os.path.join(output_path, directory))
    cv.imwrite(
        f'{output_path}/{directory}/{os.path.splitext(name)[0]}_rotated.jpg', img)
    return f'{os.path.splitext(name)[0]}_rotated.jpg'


# function to get file from the filename - resize - rotate - rename - save into directory
img = rotate_image(img, 10)
img = translate_image(img, 5, 5)
cv.imwrite('../src/assets/TestData/lmTst_0_cur.jpg', img)

# 1 input - many output

# read all file from a directory


def transform_images_from_folder(path, folder_name):
    # create an array
    result = []
    i = 0
    for filename in os.listdir(path):
        f = os.path.join(path, filename)
        # checking if it is a file
        if os.path.isfile(f):
            # checking if it is an image
            if (os.path.splitext(f)[1] == ".jpg" or os.path.splitext(f)[1] == ".png"):
                # print(f)
                result_single = {"id": i, "title": tranform_image(
                    filename, folder_name, f)}
                result.append(result_single)
                i = i + 1
    # return result filenames array
    return result


# transform_images_from_folder(mock_path)

def get_landmark_data(landmark_data):
    landmark = []
    for i in range(0, 4):
        data = {'id':  landmark_data[i]['id']+1, 'x1': landmark_data[i]['x1'],
                'y1': landmark_data[i]['y1'], 'x2': landmark_data[i]['x2'], 'y2': landmark_data[i]['y2']}
        landmark.append(data)

    # print(landmark)
    return landmark


def landmark_def_group(image, landmark):
    small_image = []
    landmark_data = []
    for i in range(int(len(landmark))):
        small_img = landmark_recognition.image_get_data(
            image, landmark[i]['x1'], landmark[i]['y1'], landmark[i]['x2'], landmark[i]['y2'])
        # landmark_x, landmark_y = landmark_recognition.landmark_definition(small_image)
        landmark_data.append(
            landmark_recognition.landmark_definition(small_img))
        small_image.append(small_img)
        # print(landmark_data[i])
        # small_image_draw = image_draw_dot(small_image[i], landmark_data[i])
        # show_image(str(i+1), small_image_draw)
    return landmark_data


# small_image = landmark_recognition.image_get_data(
#   image_path="../src/assets/TestData/lmTst_0.jpg",
#   start_position_x=475, start_position_y=600, end_position_x=525, end_position_y=650)
# 638ebdea45421afa329b6ad9
image_path = "../src/assets/Reference/638ebdea45421afa329b6ad9.jpg"
# img = cv.imread(image_path)
# height, width = img.shape[:2]
# print(height, width)
landmark_test = [{'id': 0, 'x1': 432, 'y1': 576, 'x2': 528, 'y2': 657},
                 {'id': 1, 'x1': 1117, 'y1': 590, 'x2': 1213, 'y2': 671},
                 {'id': 2, 'x1': 253, 'y1': 806, 'x2': 349, 'y2': 887},
                 {'id': 3, 'x1': 1197, 'y1': 865, 'x2': 1293, 'y2': 946}]
# print(landmark_def_group(image_path, landmark_test))
