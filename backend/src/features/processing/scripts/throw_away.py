import sys
import os
from pathlib import Path
from dotenv import load_dotenv, dotenv_values 
from util import text_reading as tread
from toc_extraction import extract_toc, get_toc_region
from util.text_reading import is_scanned
src = Path.joinpath(Path(__file__), "../../../../").resolve()
tmp = Path.joinpath(src, "tmp").resolve()
imp = Path.joinpath(tmp, "import").resolve()
file1 = Path.joinpath(imp, "abc.pdf").resolve()
embed_file = Path.joinpath(imp, "cbook.pdf").resolve()
env = Path.joinpath(src, "../.env").resolve()
load_dotenv(env)
print(is_scanned(file1))
# mappings = extract_toc(embed_file, 0,10)
# for m in mappings:
#     print(m[1])
# print(tread.ocr_read_lines(file1, 9))
# print(embed_file)
# print(tread.pypdf_read_lines(embed_file, 4))
