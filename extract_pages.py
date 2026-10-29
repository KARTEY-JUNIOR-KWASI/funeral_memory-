import os
import fitz # PyMuPDF

pdf_path = "BROCHURE JULIANNA UPDATED.pdf"
out_dir = "pages"
os.makedirs(out_dir, exist_ok=True)

print(f"Opening {pdf_path}...")
doc = fitz.open(pdf_path)
total = len(doc)
print(f"Total pages: {total}")

# Also update programme.pdf with optimized web compression if possible
try:
    print("Saving optimized programme.pdf for web download...")
    doc.save("programme.pdf", garbage=4, deflate=True)
    size_mb = os.path.getsize("programme.pdf") / (1024 * 1024)
    print(f"programme.pdf saved ({size_mb:.2f} MB)")
except Exception as e:
    print(f"Could not save compressed programme.pdf: {e}")


for idx in range(total):
    page_num = idx + 1
    page = doc[idx]
    
    # 1. Small / web thumbnail (~900px wide, ~1.5x scale)
    mat_small = fitz.Matrix(1.5, 1.5)
    pix_small = page.get_pixmap(matrix=mat_small, alpha=False)
    s_path = os.path.join(out_dir, f"s{page_num:02d}.jpg")
    pix_small.save(s_path, jpg_quality=85)
    
    # 2. Large / reader view (~1800px wide, ~3.0x scale)
    mat_large = fitz.Matrix(2.8, 2.8)
    pix_large = page.get_pixmap(matrix=mat_large, alpha=False)
    l_path = os.path.join(out_dir, f"l{page_num:02d}.jpg")
    pix_large.save(l_path, jpg_quality=88)
    
    print(f"Extracted page {page_num}/{total}: {s_path} ({pix_small.width}x{pix_small.height}), {l_path} ({pix_large.width}x{pix_large.height})")

print("All pages successfully extracted!")
