
import landmark_recognition
import image_calibration
import image_additional_function
import cv2 as cv
import numpy as np
import os
import path

# Define landmark from reference image


def landmark_defintion_ref_image(image, landmark):
    # Return crop images of landmarks and coordinate of landmark points
    small_image = []
    landmark_data = []

    for i in range(int(len(landmark))):
        # Get crop image from user input
        small_img = landmark_recognition.image_get_data(
            image, landmark[i]['x1'], landmark[i]['y1'], landmark[i]['x2'], landmark[i]['y2'])

        # Calculate landmark points from crop image
        landmark_x, landmark_y = landmark_recognition.landmark_definition(
            small_img)

        # Add landmark points to array
        # Respective to the real image size
        landmark_data.append(
            ((landmark[i]['x1']+landmark_x), (landmark[i]['y1'] + landmark_y)))
        small_image.append(small_img)
        # Debug
        # small_image_draw = image_draw_dot(small_image[i], landmark_data[i])
        # show_image(str(i+1), small_image_draw)

        # Users do not know the order of landmarks
        # Organize landmark into correct order (implement later)

    # Returned data should be in json format for the database
    # Change landmark_data to dictionary
    landmark_dict = []
    for i in range(int(len(landmark_data))):
        data_dict = {"id": i,
                     "x": landmark_data[i][0], "y": landmark_data[i][1]}
        landmark_dict.append(data_dict)

    return landmark_dict

# Calibrate images in a directory


def calibrate_image_multiple(ref_image_name, cur_img_path, destination, parklot_name, roi):
    # Calculate parameters of reference image
    img_ref_test = cv.imread(ref_image_name)
    ref_status, ref_x, ref_y = landmark_recognition.find_landmark(img_ref_test)

    # Return array of result: calibrate image name - matching rate with reference image
    result = []
    i = 0

    for filename in os.listdir(cur_img_path):
        f = os.path.join(cur_img_path, filename)
        # Check if it is a file
        if os.path.isfile(f):
            # Check if it is an image
            if (os.path.splitext(f)[1] == ".jpg" or os.path.splitext(f)[1] == ".png"):
                # Calculate parameters of current images
                img_cur_test = cv.imread(f)
                cur_status, cur_x, cur_y = landmark_recognition.find_landmark(
                    img_cur_test)

                # Calibrate current image
                result_calib, result_name, calib_flag = image_calibration.image_calibration(
                    parent_path=destination, image_data=img_cur_test, parklot_name=parklot_name,
                    mode=0, filename=filename, current_status=cur_status,
                    ref_x=ref_x, ref_y=ref_y, cur_x=cur_x, cur_y=cur_y)

                # Debug
                # result_image_cutout = result_calib[960:960 + 1080, 540:540 + 1920]
                # app.show_image("result", result_image_cutout_resize)

                # Compare calibrated image with reference image
                if (parklot_name == "Mock"):
                    calibrated_path = path.calibrated_path_mock
                    binary_path = path.binary_path_mock
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

    return result


# Test function
# ref_image_name_test = path.ref_image_name
# cur_image_path = path.cur_image_path
# destination = path.calibrated_path_mock
# parklot_name = "Mock"
# calibrate_image_multiple(ref_image_name_test, cur_image_path,
#                          destination, parklot_name)
