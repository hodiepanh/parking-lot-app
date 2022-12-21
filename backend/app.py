import cv2 as cv
import numpy as np
import os
# define path here
input_path = "../src/assets/Reference"
output_path = "../src/assets/Calibrated"
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


def tranform_image(name, image):
    img = cv.imread(image)
    resize_image(img, 50)
    img = rotate_image(img, 45)
    img_name = image + "_rotated.jpg"
    cv.imwrite(
        f'{output_path}/{name}_rotated.jpg', img)
    # show_image(name+"_rotated.jpg", img)

# function to get file from the filename - resize - rotate - rename - save into directory
# 1 input - many output
