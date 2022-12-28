import cv2 as cv
import landmark_recognition
import image_calibration
import app

img_ref_test = cv.imread("../src/assets/TestData/lmTst_0.jpg")
ref_status, ref_x, ref_y = landmark_recognition.find_landmark(img_ref_test)
print(ref_status, ref_x, ref_y)

img_cur_test = cv.imread("../src/assets/TestData/lmTst_0_cur.jpg")
cur_status, cur_x, cur_y = landmark_recognition.find_landmark(img_cur_test)
print(cur_status, cur_x, cur_y)

result_calib, calib_flag = image_calibration.image_calibration(
    parent_path=app.output_path, image_data=img_cur_test, parklot_name="Parking Lot A",
    mode=0, filename="test.jpg", current_status=cur_status,
    ref_x=ref_x, ref_y=ref_y, cur_x=cur_x, cur_y=cur_y)

result_image_cutout = result_calib[960:960 + 1080, 540:540 + 1920]
result_image_cutout_resize = app.resize_image(result_image_cutout, 30)
app.show_image("result", result_image_cutout_resize)
