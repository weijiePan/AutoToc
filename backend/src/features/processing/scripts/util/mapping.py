import re
def get_page_candidate(line:str):
    #find either number on left or righttttttt
    left_pattern = r'^[0-9]'
    right_pattern = r'[0-9]+$'
    left= re.search(left_pattern, line)
    right = re.search(right_pattern, line)
    if(left == None and right == None): return(None)
    if((left == None) or (right != None and int(right.group()) > int(left.group()))):
        return right.group()
    else:
        return left.group()
