from pypdf import PdfReader, PdfWriter
import sys
class Editor:

    def __init__(self, importLocation, exportLocation):
        self.currentChapter = ""#holds chapter name found on each page
        self.chapterList = []#holds all chapter name found and their respective page 
        self.importLocation = importLocation
        self.exportLocation = exportLocation
        #{"page":i, "chapterTitle":self.currentChapter}
    #scans the items of table of content to create a table of content
    #endPage is exclusive
    def scanTableOfContentPage(self, startPage, endPage):

        reader = PdfReader(stream=self.importLocation)
        #find number all the way left and all the way right
        #if only one side's num is found, use that as the page number
        #if both side finds a number, use the larger of the two

         #go through each page and split the individual items
        for i in range(startPage, endPage):
            items = reader.pages[i].extract_text().split("\n")
            for item in items:
                left = Editor.findFirstValueLeft(item)
                right = Editor.findFirstValueRight(item)
                left = int(left) if left != None and left != "" else None
                right = int(right) if right != None and right != "" else None
                if((left == None) and (right == None)):
                    continue
                if(left == None):
                    try:
                        self.chapterList.append({"page":right, "chapterTitle":Editor.eliminateStr(item, str(right))})
                    except:
                        print("exception: right:", right, "item", item)
                    
                elif(right == None):
                    self.chapterList.append({"page":left, "chapterTitle":Editor.eliminateStr(item, str(left))})
                elif(right > left):
                    self.chapterList.append({"page":right, "chapterTitle":Editor.eliminateStr(item, str(right))})
                else:
                    self.chapterList.append({"page":left, "chapterTitle":Editor.eliminateStr(item, str(left))})
        self.writeToBook()
    #scans all pages to find heading an creates a table of content from this
    def scanAllHeadings(self, tocEndPage):#tocEndPage->the last page of table of content
        reader = PdfReader(stream=self.importLocation)
        for i in range(tocEndPage, len(reader.pages)):
            #go through each page and finds heading > size 50, indicating heading of a chapter
            reader.pages[i].extract_text(visitor_text=lambda text, cm, tm, font_dict, font_size: self.addCurrentChapter(text) if(tm[0]>30) else None)
            #if heading is found and not null, then add to chapter list
            if(self.currentChapter != ""):
                self.chapterList.append({"page":i, "chapterTitle":self.currentChapter})
                self.currentChapter = ""
        reader.close()#close reader to reduce ram usage
        self.writeToBook()#look into name scope and self usage when using python classes
    def addCurrentChapter(self, text):
        self.currentChapter += text.split("\n")[0]

    def writeToBook(self):
        self.chapterList = Editor.deleteDuplicatePage(self.chapterList)
        #go through each page, title of chapter list and add it to the table of content
        writer = PdfWriter(clone_from=self.importLocation)
        for listItem in self.chapterList:
            print("page_number:", listItem["page"], "title", listItem["chapterTitle"])
            sys.stdout.flush()
            writer.add_outline_item(page_number = int(listItem["page"]), title=listItem["chapterTitle"])
        writer.write(self.exportLocation)
        writer.close()
    def findFirstValueLeft(str):

        if(str == "" or str == None or not str[0].isdigit()):
            return None
        i = 0 
        while(i < len(str) and str[i].isdigit()):
            i+=1
        return int(str[0:i])
        
        
    def findFirstValueRight(s):
        if(len(s) <= 0):
            return None
        if(not s[len(s)-1].isdigit()):
            return None
        i = len(s)-1
        currChar = s[i]
        while(i > 0 and currChar.isdigit()):
            i-=1
            currChar = s[i]
        return(s[i+1:i+len(s)])
    def eliminateStr(str, eliminator):
        start = str.index(eliminator)
        return str[0:start] + str[start + len(eliminator):]
    def deleteDuplicatePage(ls):
        if(len(ls) <= 0 ):
            return None 
        i = 1
        while i < len(ls):
            if(ls[i]["page"] == ls[i-1]["page"]):
                ls.pop(i)
                i-=1
            i+=1

        return ls
        
tocStart = int(sys.argv[1])
tocEnd = int(sys.argv[2])
importLocation = sys.argv[3]
exportLocation =sys.argv[4]
editor1 = Editor(importLocation, exportLocation)

editor1.scanTableOfContentPage(tocStart, tocEnd)

sys.stdout.flush()
# print(Editor.deleteDuplicatePage([{"page":1},{"page":1},{"page":1},{"page":2},{"page":2}]))