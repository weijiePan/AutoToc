
def extract_toc(pdf_source:str, start_page:int, end_page:int):
    lines:list[str] = []
    if(is_scanned(pdf_source)):
        #perform ocr extraction
        # lines.extend(ocr_read_lines(pdf_source, i))
        lines = ocr_read_lines(pdf_source, 0)
        pass
    else:
        #perform text extraction
        pass

def mapping_from_line(line:str):

    pass

