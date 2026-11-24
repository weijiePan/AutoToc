from pathlib import Path
from PIL import Image
import pytesseract
from pytesseract import Output
from .image_util import pdf_to_img_specific_pg
from pypdf import PdfReader
#group together words based on vertica position 
#return all the lines in a page
def ocr_read_lines(
    pdf_source: str,
    page: int,
    y_tolerance: int = 12,
    psm: int = 6,
) -> list[str]:
    image_path = pdf_to_img_specific_pg(pdf_source, page)
    if not image_path:
        return []

    try:
        with Image.open(image_path) as img:
            df = pytesseract.image_to_data(
                img,
                config=f"--psm {psm}",
                output_type=Output.DATAFRAME,
            )
    finally:
        Path(image_path).unlink(missing_ok=True)

    words = df[df["text"].notna() & (df["text"].str.strip() != "")].copy()
    if words.empty:
        return []

    words["y_center"] = words["top"] + (words["height"] / 2.0)
    words = words.sort_values("y_center")

    lines: list[list[tuple[int, str]]] = []
    line_ys: list[float] = []

    for _, row in words.iterrows():
        yc = float(row["y_center"])
        matched_idx = None

        for idx, ly in enumerate(line_ys):
            if abs(yc - ly) <= y_tolerance:
                matched_idx = idx
                break

        token = (int(row["left"]), str(row["text"]).strip())
        if matched_idx is not None:
            lines[matched_idx].append(token)
            count = len(lines[matched_idx])
            line_ys[matched_idx] = ((line_ys[matched_idx] * (count - 1)) + yc) / count
        else:
            lines.append([token])
            line_ys.append(yc)

    return [
        " ".join(text for _, text in sorted(group, key=lambda item: item[0]))
        for group in lines
    ]
#extract the lines from a page by reading the pdf
def pypdf_read_lines(pdf_source:str, page:int):
    if(page < 0): return(None)
    pdf_reader = PdfReader(pdf_source) 
    page = pdf_reader.pages[page]
    lines = page.extract_text(extraction_mode="layout")
    if(lines == ""):
        lines =  page.extract_text()
    #extraction_mode=layout can cause some pages to not show up
    return lines.split("\n")
