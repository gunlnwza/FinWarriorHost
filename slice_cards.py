from pdf2image import convert_from_path
import os

# ============================================
# LOAD SINGLE PAGE FROM PDF
# ============================================

pdf_file = "TheFinWarrior.pdf"

bump = 10
L = [75, 923 + bump, 1775]
R = [704, 1554 + bump, 2402]

bump = 100
T = [75, 1175 +bump, 2278 + bump*2]
B = [1017, 2118+bump, 3221 + bump*2]

# p.14 to p.22, dice is p.23
start = 20
end = 20
pages = convert_from_path(
    pdf_file,
    first_page=start,
    last_page=end,
    dpi=300
)

count = 0

for i in range(len(pages)):
    img = pages[i]
    page = start + i
    output_dir = f"page_{page}_cards"
    os.makedirs(output_dir, exist_ok=True)

    # ============================================
    # CUT GRID
    # ============================================

    for row in range(3):
        for col in range(3):

            left   = L[col]
            right  = R[col]

            top    = T[row]
            bottom = B[row]

            cropped = img.crop((left, top, right, bottom))

            out_name = f"{output_dir}/page{page}_r{row}_c{col}.png"

            cropped.save(out_name)

            print("saved:", out_name)
            count += 1


print(f"\nDone. Saved {count} images.")