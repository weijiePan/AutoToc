"""Utilities for checking the chapter/page mapping in a PDF outline.

Run this file with a PDF path to print a JSON object whose keys are 1-based
page numbers and whose values are the outline entries starting on that page.
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path
from typing import Any


def page_to_chapters(pdf_path: str | Path) -> dict[int, list[str]]:
	"""Return the PDF's outline as ``{page_number: [chapter, ...]}``.

	Page numbers are one-based, matching the numbers normally shown to users.
	Nested outline entries are included, so this is also useful for checking
	subsection mappings.
	"""
	try:
		from pypdf import PdfReader
	except ImportError as exc:  # pragma: no cover - depends on the environment
		raise RuntimeError("Install pypdf to inspect PDF outlines") from exc

	reader = PdfReader(str(pdf_path))
	try:
		outline = reader.outline
	except AttributeError:  # Compatibility with older PyPDF2 versions.
		outline = reader.getOutlines()

	result: defaultdict[int, list[str]] = defaultdict(list)

	def visit(entries: Any) -> None:
		if not isinstance(entries, list):
			return
		for entry in entries:
			if isinstance(entry, list):
				visit(entry)
				continue

			title = getattr(entry, "title", None) or getattr(entry, "get", lambda *_: None)(
				"/Title"
			)
			if title:
				try:
					page = reader.get_destination_page_number(entry) + 1
				except (TypeError, ValueError, KeyError, IndexError):
					page = None
				if page is not None and title not in result[page]:
					result[page].append(str(title))

	visit(outline)
	return dict(sorted(result.items()))


def main() -> None:
	parser = argparse.ArgumentParser(description="Check a PDF outline's page mapping")
	parser.add_argument("pdf", type=Path, help="PDF file to inspect")
	args = parser.parse_args()
	mapping = page_to_chapters(args.pdf)
	print(json.dumps({str(page): chapters for page, chapters in mapping.items()}, indent=2))


if __name__ == "__main__":
	main()
