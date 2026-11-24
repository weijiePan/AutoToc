
import re
#when converting pdf to image, 
#creates a filename that includes the page number and original filename
def make_page_image_name(filename:str, page_number:int):
    return f'{filename}_pg:{page_number}.png'
#extract the original filename and page number from the image filename
def get_page_mapping_from_image(image_name:str):
    filename = re.search(r'pg:',image_name)
    source_path = source_path[filename.span()[0]:]
    page = re.search( r'\d+',source_path)
    return(int(source_path[page.span()[0]:page.span()[1]]))