
import landmark_recognition
import image_calibration
import image_additional_function
import cv2 as cv
import numpy as np
import os
import path


def landmark_defintion_ref_image(image, landmark):
    small_image = []
    landmark_data = []
    for i in range(int(len(landmark))):
        small_img = landmark_recognition.image_get_data(
            image, landmark[i]['x1'], landmark[i]['y1'], landmark[i]['x2'], landmark[i]['y2'])
        landmark_x, landmark_y = landmark_recognition.landmark_definition(
            small_img)
        # organize landmark data into correct order

        landmark_data.append(
            ((landmark[i]['x1']+landmark_x), (landmark[i]['y1'] + landmark_y)))
        small_image.append(small_img)
        # print(landmark_data[i])
        # small_image_draw = image_draw_dot(small_image[i], landmark_data[i])
        # show_image(str(i+1), small_image_draw)
    return landmark_data


def calibrate_image_multiple(ref_image_name, cur_img_path, destination, parklot_name, roi):
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

                # image comparision
                # calibrated_image = "test_img_calib/Reference/lmTst_1.jpg"
                if (parklot_name == "Mock"):

                    calibrated_path = path.calibrated_path_mock
                    binary_path = path.binary_path_mock
                    # binary_image, matching_rate = image_additional_function.image_difference(
                    #     reference_image=ref_image_name,
                    #     calibrated_image=f"test_img_calib/Calibrated/Mock/{result_name}",
                    #     write_path=f"test_img_calib/Binary/Mock/{parklot_name}",
                    #     start_roi_x=roi['x1'],
                    #     start_roi_y=roi['y1'],
                    #     end_roi_x=roi['x2'],
                    #     end_roi_y=roi['y2'])
                else:

                    calibrated_path = path.calibrated_path
                    binary_path = path.binary_path
                binary_image, matching_rate = image_additional_function.image_difference(
                    reference_image=ref_image_name,
                    calibrated_image=f"{calibrated_path}/{parklot_name}/{result_name}",
                    write_path=f"{binary_path}/{parklot_name}",
                    start_roi_x=roi['x1'],
                    start_roi_y=roi['y1'],
                    end_roi_x=roi['x2'],
                    end_roi_y=roi['y2'])

                result.append(
                    {"id": i, "title": result_name, "match": matching_rate})
                i = i+1
    # return result filenames array
    return result


# ref_image_name_test = path.ref_image_name
# cur_image_path = path.cur_image_path
# destination = path.calibrated_path_mock
# parklot_name = "Mock"
# calibrate_image_multiple(ref_image_name_test, cur_image_path,
#                          destination, parklot_name)
