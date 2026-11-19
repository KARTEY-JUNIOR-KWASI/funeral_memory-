import os
import glob
import pymupdf

pdf_path = "Vida Osei Broch_final.pdf"
out_dir = "pages"
os.makedirs(out_dir, exist_ok=True)

for f in glob.glob(os.path.join(out_dir, "*.jpg")):
    os.remove(f)

print(f"Opening {pdf_path}...")
doc = pymupdf.open(pdf_path)
total = len(doc)
print(f"Total pages: {total}")

for idx in range(total):
    page_num = idx + 1
    page = doc[idx]

    # 1. Small / web thumbnail (~900px wide, 1.5x scale)
    mat_small = pymupdf.Matrix(1.5, 1.5)
    pix_small = page.get_pixmap(matrix=mat_small, alpha=False)
    s_path = os.path.join(out_dir, f"s{page_num:02d}.jpg")
    pix_small.save(s_path, jpg_quality=85)

    # 2. Large / reader view (~1666px wide, 2.8x scale)
    mat_large = pymupdf.Matrix(2.8, 2.8)
    pix_large = page.get_pixmap(matrix=mat_large, alpha=False)
    l_path = os.path.join(out_dir, f"l{page_num:02d}.jpg")
    pix_large.save(l_path, jpg_quality=88)

    print(f"Extracted page {page_num}/{total}: {s_path} ({pix_small.width}x{pix_small.height}), {l_path} ({pix_large.width}x{pix_large.height})")

# Update programme.pdf with web compression
try:
    print("Saving optimized programme.pdf for web download...")
    doc.rewrite_images(dpi_threshold=150, dpi_target=120, quality=78)
    doc.save("programme.pdf", garbage=4, deflate=True, clean=True)
    size_mb = os.path.getsize("programme.pdf") / (1024 * 1024)
    print(f"programme.pdf saved ({size_mb:.2f} MB)")
except Exception as e:
    print(f"Could not save compressed programme.pdf: {e}")

print("All pages successfully extracted!")
