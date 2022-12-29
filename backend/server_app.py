# import imutils
import math
import landmark_recognition
import image_calibration
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

# rotate by degree around center


def rotate_image(image, angle):
    (height, width) = image.shape[:2]
    (cX, cY) = (width // 2, height // 2)
    M = cv.getRotationMatrix2D((cX, cY), angle, 1.0)
    rotated = cv.warpAffine(image, M, (width, height))
    return rotated

# translate


def translate_image(image, hor, ver):
    # shift the image 25 pixels to the right and 50 pixels down
    # hor<0 -> shift left, hor>0 -> shift right
    # ver<0-> shift up, ver>0 -> shift down
    M = np.float32([[1, 0, hor], [0, 1, ver]])
    shifted = cv.warpAffine(image, M, (image.shape[1], image.shape[0]))
    return shifted

# save into directory

    print(something)


def transform_mock(image_name, max_angle, max_x, max_y, destination):
    image = cv.imread(f'test_img_calib/Reference/{image_name}.jpg',)
    for i in range(-int(max_angle), int(max_angle)):
        img_rotate = rotate_image(image, i)
        cv.imwrite(f'{destination}/{image_name}_0_0_{i}.jpg', img_rotate)
    for i in range(-int(max_x), int(max_x)):
        for j in range(-int(max_y), int(max_y)):
            img_trans = translate_image(img, i, j)
            cv.imwrite(
                f'{destination}/{image_name}_{i}_{j}_{0}.jpg', img_trans)


# img_name = "lmTst_0"
# dest = "test_img_calib/Data/Mock"
# transform_mock(img_name, 10, 5, 5, dest)

def landmark_defintion_ref_image(image, landmark):
    small_image = []
    landmark_data = []
    for i in range(int(len(landmark))):
        small_img = landmark_recognition.image_get_data(
            image, landmark[i]['x1'], landmark[i]['y1'], landmark[i]['x2'], landmark[i]['y2'])
        landmark_x, landmark_y = landmark_recognition.landmark_definition(
            small_img)
        landmark_data.append(
            ((landmark[i]['x1']+landmark_x), (landmark[i]['y1'] + landmark_y)))
        small_image.append(small_img)
        # print(landmark_data[i])
        # small_image_draw = image_draw_dot(small_image[i], landmark_data[i])
        # show_image(str(i+1), small_image_draw)
    return landmark_data


def calibrate_image_multiple(ref_image_name, cur_img_path, destination, parklot_name):
    img_ref_test = cv.imread(ref_image_name)
    ref_status, ref_x, ref_y = landmark_recognition.find_landmark(img_ref_test)
    # print(ref_status, ref_x, ref_y)

    # create an array
    result = []
    i = 0
    for filename in os.listdir(cur_img_path):
        f = os.path.join(cur_img_path, filename)
        # checking if it is a file
        if os.path.isfile(f):
            # checking if it is an image
            if (os.path.splitext(f)[1] == ".jpg" or os.path.splitext(f)[1] == ".png"):
                # print(f)
                # test_img_calib/Data/Mock\lmTst_0_-1_-1_0.jpg
                img_cur_test = cv.imread(f)
                cur_status, cur_x, cur_y = landmark_recognition.find_landmark(
                    img_cur_test)
                # print(cur_status, cur_x, cur_y)

                # output_path = "../src/assets/Calibrated"
                result_calib, result_name, calib_flag = image_calibration.image_calibration(
                    parent_path=destination, image_data=img_cur_test, parklot_name=parklot_name,
                    mode=0, filename=filename, current_status=cur_status,
                    ref_x=ref_x, ref_y=ref_y, cur_x=cur_x, cur_y=cur_y)

                # result_image_cutout = result_calib[960:960 + 1080, 540:540 + 1920]
                # result_image_cutout_resize = app.resize_image(result_image_cutout, 30)
                # app.show_image("result", result_image_cutout_resize)

                result.append({"id": i, "title": result_name})
                i = i+1
    # return result filenames array
    return result


# ref_image_name_test = "test_img_calib/Reference/lmTst_0.jpg"
# cur_image_path = "test_img_calib/Data/Mock"
# destination = "test_img_calib/Calibrated/"
# parklot_name = "Mock"
# calibrate_multiple(ref_image_name_test, cur_image_path,
#                   destination, parklot_name)
