import cv2 as cv
import numpy as np
import os
import csv
import path

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


def transform_mock(image_name, max_angle, max_x, max_y, destination):
    for f in os.listdir(destination):
        os.remove(os.path.join(destination, f))
    image = cv.imread(f'{path.ref_image_path}/{image_name}.jpg')
    for i in range(-int(max_angle), int(max_angle)):
        img_rotate = rotate_image(image, i)
        cv.imwrite(f'{destination}/{image_name}_0_0_{i}.jpg', img_rotate)
    for i in range(-int(max_x), int(max_x), 5):
        for j in range(-int(max_y), int(max_y), 5):
            img_trans = translate_image(img, i, j)
            cv.imwrite(
                f'{destination}/{image_name}_{i}_{j}_{0}.jpg', img_trans)


img_name = "lmTst_0"
dest = path.cur_image_path
# transform_mock(img_name, 10, 15, 15, dest)


def write_debug(data, debug_file):
    for i in range(int(len(data))):
        data[i] = str(data[i])
    # data = ['Afghanistan', 652090, 'AF', 'AFG']

    # check if header already exist

    exist = False
    if (os.path.exists(debug_file)):
        with open(debug_file, 'r', encoding='UTF8') as read_file:
            csvreader = csv.reader(read_file, delimiter=',')
            for line in csvreader:
                # # print(line)
                # print(type(data))
                if (line == data):
                    exist = True

        if not exist:
            with open(debug_file, 'a', newline='', encoding='UTF8') as f:
                writer = csv.writer(f)

                # write the header
                # writer.writerow(header)

                # write the data
                writer.writerow(data)
                # close file
                f.close()
    else:
        with open(debug_file, 'a', newline='', encoding='UTF8') as f:
            writer = csv.writer(f)

            # write the header
            # writer.writerow(header)

            # write the data
            writer.writerow(data)
            # close file
            f.close()


# data = ['Afghanistan', 652090, 'AF', 'AFG']
# write_debug(data, debug_file="debug/debug_log.csv")


def clear_file(file):
    f = open(file, "w")
    f.truncate()
    f.close()


# clear_file("debug/debug_log_Mock.csv")

def remove_file(directory):
    for f in os.listdir(directory):
        os.remove(os.path.join(directory, f))


# remove_file(f'{path.calibrated_path_mock}/Mock')
