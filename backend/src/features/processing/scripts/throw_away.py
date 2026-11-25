import sys
import os
from pathlib import Path
from dotenv import load_dotenv, dotenv_values 
from util import text_reading as tread
from toc_extraction import extract_toc, get_toc_region, main_page_compensate_constant
from util.text_reading import is_scanned
src = Path.joinpath(Path(__file__), "../../../../").resolve()
tmp = Path.joinpath(src, "tmp").resolve()
imp = Path.joinpath(tmp, "import").resolve()
file1 = Path.joinpath(imp, "abc.pdf").resolve()
embed_file = Path.joinpath(imp, "cbook.pdf").resolve()
env = Path.joinpath(src, "../.env").resolve()
load_dotenv(env)
mapping = extract_toc(embed_file)
constant = main_page_compensate_constant(embed_file, mapping, 5 )
print(mapping)

