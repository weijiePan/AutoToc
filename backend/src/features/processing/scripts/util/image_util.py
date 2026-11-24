from pdf2image import convert_from_path, convert_from_bytes
from pathlib import Path
import os
import tempfile
root = Path.joinpath(Path(__file__).resolve(), "../..").resolve()

def pdf_to_img(input_path:str, output_folder:str):
    images = convert_from_path(input_path, last_page=20)
    input_name = Path(input_path).stem
    i = 0
    for image in images:
        if(i > 20): 
            break
        o = Path(output_folder).joinpath(f'{input_name}pg:{i}.png') 
        image = image.resize([250,250])
        image.save(o)
        i+=1
#return a temp file representing the image
def pdf_to_img_specific_pg(pdf_source:str, page:int):
    #return a temp file
    images = convert_from_path(pdf_source, first_page = page, last_page=page)
    if(len(images) == 0): return(None)
    input_name = Path(pdf_source).stem
    fd, temp_path = tempfile.mkstemp(suffix=".png")
    os.close(fd)
    images[0].save(temp_path)
    return temp_path

