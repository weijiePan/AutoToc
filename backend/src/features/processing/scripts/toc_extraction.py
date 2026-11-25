from util import text_reading as tread
from util import mapping 
from pypdf import PdfReader
from util.image_util import pdf_to_img_specific_pg
from toc_classifier import is_toc
from pathlib import Path
is_scanned = False
toc_discovery_limit = 30
compensator_discovery_limit = 50
def get_toc_region(pdf_source:str):
    toc_candidates = []
    reader = PdfReader(pdf_source)
    for i in range(0, min(len(reader.pages), toc_discovery_limit)):
        print(f'analyzing page:{i}')
        img = pdf_to_img_specific_pg(pdf_source, i)
        if(not img): continue
        if(is_toc(img)):
            print(f'${i} is toc')
            toc_candidates.append(i)
    #find the largest continous region containing toc
    if(len(toc_candidates) == 0): return(None) 
    left = 0 
    right = 1
    max = 0
    start = -1
    end = -1
    while(left < len(toc_candidates) and right < len(toc_candidates)):
        diff = abs(toc_candidates[right-1] - toc_candidates[right])
        if(diff == 1):
            current_len = abs(right - left)
            if(current_len > max): 
                max = current_len
                start = toc_candidates[left]
                end = toc_candidates[right]
            right+=1
        else:
            left = right
            right += 1
    # each page is included not just the interva between each page, the +1 adjusts for that
    if(max > 0): return (start, end)
    return None
            

#return a list of tuples: (chapter title, page number)
def extract_toc(pdf_source:str, start = None, end = None):
    start_pg, end_pg = get_toc_region(pdf_source)
    if(start_pg == None): start_pg = start
    if(end_pg == None): end_pg = end
    if(not start_pg or not end_pg): raise Exception("no valid toc range found")
    pages:list[str] = []
    mappings:list[(str, int)] = []
    for i in range(start_pg, end_pg):
        if(is_scanned):
            #perform ocr extraction
            # lines.extend(ocr_read_lines(pdf_source, i))
            pages.append(tread.ocr_read_lines(pdf_source, i))
        else:
            #perform text extraction
            pages.append(tread.pypdf_read_lines(pdf_source, i))
    for page in pages:
        for line in page:
            p = mapping.get_page_candidate(line)
            if(p != None): 
                if(len(mappings) == 0 or int(p) > mappings[len(mappings) - 1][1]):
                    mappings.append((line, int(p)))

    return mappings
#constant such that expected_page_# + constant = actual_page_#
def main_page_compensate_constant(pdf_source:str, mapping, toc_end):
    reader = PdfReader(pdf_source)
    start = toc_end + 1
    if(start > len(reader.pages)): raise Exception("insufficient page count") 
    end = min(compensator_discovery_limit, len(reader.pages))
    for i in range(start, end):
        pass


    



