import re
def get_page_candidate(line:str):
    if(not line): raise Exception("empty line")
    left = r'^[0-9]+'
    right = r'[0-9]+$'
    right_match = re.search(right, line)
    left_match = re.search(left, line)
    if(left_match == None and right_match == None): return(None)
    if(left_match == None):
        #no chapter accompanying page,(likely line is the page #)
        if(len(right_match.group()) == len(line)): return None
        return int(right_match.group())
    elif(right_match == None):
        if(len(left_match.group()) == len(line)): return None
        return int(left_match.group())
    else:
        if(len(left_match.group()) == len(line)): return None
        if(len(right_match.group()) == len(line)): return None
        if int(left_match.group()) > int(right_match.group()):
            return int(left_match.group())
        else:
            return int(right_match.group())
    
