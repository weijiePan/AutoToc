
import cv2 as cv
from pathlib import Path
import os
import numpy as np
import pandas as pd
import pickle
import re


py_root = Path.joinpath(Path(__file__).resolve(), "../../").resolve()
dtc_source = Path.joinpath(py_root, "model/toc_predictor_x").resolve()


#given the path to an image, determine if it is a table of contents page
def is_toc(source_path:str):
    if(not source_path): return None
    final_arr = []
    dtc = pickle.load(open(dtc_source, "rb"))
    img_name = Path(source_path).as_posix()
    img = cv.imread(img_name, 0)
    ret, thresh = cv.threshold(img, 240, 255, cv.THRESH_BINARY_INV)
    coords = cv.findNonZero(thresh)
    if coords is not None:
        x, y, w, h = cv.boundingRect(coords)
        pad = 5
        h_img, w_img = img.shape
        y1 = max(0, y - pad)
        y2 = min(h_img, y + h + pad)
        x1 = max(0, x - pad)
        x2 = min(w_img, x + w + pad)
        cropped = img[y1:y2, x1:x2]
    else:
        cropped = img

    resized = cv.resize(cropped, (256, 256), interpolation=cv.INTER_LINEAR)
    arr = pd.DataFrame(resized)   
    arr = arr.mean(axis=0).to_frame().T
    probs = dtc.predict_proba(arr)
    if(probs[0][1] > 0.75):
        return True
    else:
        return False
