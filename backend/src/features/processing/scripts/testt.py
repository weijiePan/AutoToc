from pypdf import PdfReader

pdf_path = "/home/wp/Desktop/coding/projects/MyBookIsTooLong/backend/src/tmp/import/cbook.pdf"
reader = PdfReader(pdf_path)

if reader.is_encrypted:
    print("Decrypt status:", reader.decrypt(""))

page = reader.pages[4]
raw_bytes = page.get_contents().get_data() if page.get_contents() else b""

print("Encrypted:", reader.is_encrypted)
print("Image count on page 4:", len(page.images))
print("Raw content stream bytes:", len(raw_bytes))
print("Default extract_text():", repr(page.extract_text()))
print("Plain mode extract_text():", repr(page.extract_text(extraction_mode="plain")))