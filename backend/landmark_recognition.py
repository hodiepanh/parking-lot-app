# Import required libraries
# Image processing functions
import cv2
# Mathematical functions
import numpy as np

# Initiate threshold values, for image processing (contour recognition based on colors)
im_lower = np.array([20, 110, 110], dtype='uint8')
im_upper = np.array([35, 255, 255], dtype='uint8')
kernel = np.ones((3, 3), np.uint8)


# ----------------------------------------------------------------------------------------------------------------------
# Define landmark recognition function
def find_landmark(image_data):
    # Initiate values
    # Debug:
    # print(address)
    current_x = []
    current_y = []
    current_status = []

    for k in range(0, 5):
        current_x.append(0)
        current_y.append(0)
        current_status.append(0)

    # Input image, create binary mask for contour recognition
    image_copy = image_data.copy()
    image_hsv = cv2.cvtColor(image_copy, cv2.COLOR_BGR2HSV)
    image_mask = cv2.inRange(image_hsv, im_lower, im_upper)
    image_mask = cv2.morphologyEx(image_mask, cv2.MORPH_OPEN, kernel)

    # Debug:
    # image_mask_show = image_mask
    # Check image mask
    # cv2.imshow("Image mask", image_mask_show)
    # cv2.waitKey()

    # Finding contours available on image
    cur_cnt, _ = cv2.findContours(
        image_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Debug
    # print(cur_cnt)

    # Mapping contours found with desired landmarks, comparing parameters
    for c in cur_cnt:
        # Define contour bounding box
        x, y, w, h = cv2.boundingRect(c)
        # Defined range for landmark 1
        if (210 < (x + (w // 2)) < 770) and (250 < (y + (h // 2)) < 650) and (15 < w < 70) and (7 < h < 60):
            current_x[1] = x + (w // 2)
            current_y[1] = y + (h // 2)
            current_status[1] = current_status[1] + 1
        # Defined range for landmarks 2
        elif (880 < (x + (w // 2)) < 1430) and (260 < (y + (h // 2)) < 650) and (15 < w < 70) and (7 < h < 60):
            current_x[2] = x + (w // 2)
            current_y[2] = y + (h // 2)
            current_status[2] = current_status[2] + 1
        # Defined range for landmarks 3
        elif (30 < (x + (w // 2)) < 580) and (500 < (y + (h // 2)) < 960) and (20 < w < 80) and (10 < h < 60):
            current_x[3] = x + (w // 2)
            current_y[3] = y + (h // 2)
            current_status[3] = current_status[3] + 1
        # Defined range for landmarks 4
        elif (950 < (x + (w // 2)) < 1510) and (540 < (y + (h // 2)) < 1010) and (20 < w < 90) and (10 < h < 90):
            current_x[4] = x + (w // 2)
            current_y[4] = y + (h // 2)
            current_status[4] = current_status[4] + 1
    # Debug:
    # print(current_status[1], current_status[2], current_status[3], current_status[4])
    # If the number of contour found in one position is larger than 1, then the location is not determined!
    if current_status[1] != 1:
        current_x[1] = 0
        current_y[1] = 0
    if current_status[2] != 1:
        current_x[2] = 0
        current_y[2] = 0
    if current_status[3] != 1:
        current_x[3] = 0
        current_y[3] = 0
    if current_status[4] != 1:
        current_x[4] = 0
        current_y[4] = 0

    return current_status, current_x, current_y
# ----------------------------------------------------------------------------------------------------------------------


# ----------------------------------------------------------------------------------------------------------------------
# Get coordinate information from standard image log file
def get_coordinate_std_file(input_path, input_name):
    # Define log file name
    file_name = "01_std_log.csv"
    # Define coordinate list
    x_coord = []
    y_coord = []
    # Append initial values
    for index in range(0, 5):
        x_coord.append(0)
        y_coord.append(0)

    # Determine log file path
    file_path = "{}\\data_process\\{}\\log_files\\{}".format(
        input_path, input_name, file_name)
    file = open(file_path, 'r+')

    # Get separate lines from log file
    split_line = [line.split() for line in file]
    number_of_line = len(split_line)

    # Debug
    # print(split_line)
    # print(number_of_line)

    # Split string from line get from log file
    for index in range(1, number_of_line):
        for value in split_line[index]:
            string = value
            new_list = string.split(",")
            # print(new_list)

            for coord_index in range(1, 5):
                x_coord[coord_index] += int(new_list[coord_index*2-1])
                y_coord[coord_index] += int(new_list[coord_index*2])
            # Debug
            # print(x_coord)
            # print(y_coord)

    for coord_index in range(1, 5):
        x_coord[coord_index] = int(x_coord[coord_index]/(number_of_line-1))
        y_coord[coord_index] = int(y_coord[coord_index]/(number_of_line-1))

    # Debug
    # print("")
    # print(x_coord)
    # print(y_coord)

    return x_coord, y_coord
# ----------------------------------------------------------------------------------------------------------------------


# ------------------------------------------------------------------------------------ ----------------------------------
def image_get_data(image_path, start_position_x, start_position_y, end_position_x, end_position_y):
    # Read in reference image
    image_data = cv2.imread(image_path)
    cut = image_data

    # Crop specific image data section
    crop_image = cut[start_position_y:end_position_y,
                     start_position_x:end_position_x]
    # cv2.imshow("Show me the crop", crop_image)

    return crop_image
# ----------------------------------------------------------------------------------------------------------------------


# ----------------------------------------------------------------------------------------------------------------------
def landmark_definition(image_data):
    position_x = 0
    position_y = 0

    image_copy = image_data.copy()
    image_hsv = cv2.cvtColor(image_copy, cv2.COLOR_BGR2HSV)
    image_mask = cv2.inRange(image_hsv, im_lower, im_upper)
    image_mask = cv2.morphologyEx(image_mask, cv2.MORPH_OPEN, kernel)

    # Finding contours available on image
    cur_cnt, _ = cv2.findContours(
        image_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_area = 0

    for c in cur_cnt:
        # Define contour bounding box
        x, y, w, h = cv2.boundingRect(c)

        if largest_area < ((w-x)*(h-y)):
            position_x = int((2*x + w) / 2)
            position_y = int((2*y + h) / 2)
            largest_area = ((w-x)*(h-y))

    return position_x, position_y
# ----------------------------------------------------------------------------------------------------------------------
