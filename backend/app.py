import cv2 as cv
import numpy as np
import os
# define path here
input_path = "../src/assets/Reference"
output_path = "../src/assets/Calibrated"
mock_path = "../src/assets/Parking Lots/Sample lot"
# input
# img = cv.imread(f"{input_path}/lmTst_0.jpg")

# resize


def resize_image(image, scale_percent):
    # percent of original size
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)
    result = cv.resize(image, dim)
    return result


# img = resize_image(img)

# rotate by degree around center


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


def show_image(name, image):
    cv.imshow(name, image)
    cv.waitKey(0)


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
