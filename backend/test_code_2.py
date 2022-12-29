import cv2 as cv
import landmark_recognition
import image_calibration
import app
import os

img_ref_test = cv.imread("../src/assets/TestData/lmTst_0.jpg")
ref_status, ref_x, ref_y = landmark_recognition.find_landmark(img_ref_test)
print(ref_status, ref_x, ref_y)

img_cur_test = cv.imread("../src/assets/TestData/lmTst_0_cur.jpg")
cur_status, cur_x, cur_y = landmark_recognition.find_landmark(img_cur_test)
print(cur_status, cur_x, cur_y)

# result_calib, calib_flag = image_calibration.image_calibration(
#     parent_path=app.output_path, image_data=img_cur_test, parklot_name="Parking Lot A",
#     mode=0, filename="test.jpg", current_status=cur_status,
#     ref_x=ref_x, ref_y=ref_y, cur_x=cur_x, cur_y=cur_y)

# result_image_cutout = result_calib[960:960 + 1080, 540:540 + 1920]
# result_image_cutout_resize = app.resize_image(result_image_cutout, 30)
# app.show_image("result", result_image_cutout_resize)


def calibrate_image_multiple(ref_image_name, cur_img_path, destination):
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
                    parent_path=destination, image_data=img_cur_test, parklot_name="Mock",
                    mode=0, filename=filename, current_status=cur_status,
                    ref_x=ref_x, ref_y=ref_y, cur_x=cur_x, cur_y=cur_y)

                # result_image_cutout = result_calib[960:960 + 1080, 540:540 + 1920]
                # result_image_cutout_resize = app.resize_image(result_image_cutout, 30)
                # app.show_image("result", result_image_cutout_resize)

                # result_single = {"id": i, "title":}
                # result.append(result_single)
                # i = i + 1
    # return result filenames array
    # return result


# ref_image_name_test = "test_img_calib/Reference/lmTst_0.jpg"
# cur_image_path = "test_img_calib/Data/Mock"
# destination = "test_img_calib/Calibrated/"
# calibrate_image_multiple(ref_image_name_test, cur_image_path, destination)
