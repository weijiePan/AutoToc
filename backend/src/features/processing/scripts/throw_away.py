import sys
import os
from pathlib import Path
from dotenv import load_dotenv, dotenv_values 
from util import text_reading as tread

src = Path.joinpath(Path(__file__), "../../../../").resolve()
tmp = Path.joinpath(src, "tmp").resolve()
imp = Path.joinpath(tmp, "import").resolve()
file1 = Path.joinpath(imp, "abc.pdf").resolve()
embed_file = Path.joinpath(imp, "cbook.pdf").resolve()
env = Path.joinpath(src, "../.env").resolve()
print(env)
load_dotenv(env)

# print(tread.ocr_read_lines(file1, 9))
print(embed_file)
print(tread.pypdf_read_lines(embed_file, 4))
