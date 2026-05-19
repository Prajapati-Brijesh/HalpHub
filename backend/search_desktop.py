import os

desktop = r"c:\Users\shiv\OneDrive\Desktop"
matches = []

for root, dirs, files in os.walk(desktop):
    if "node_modules" in root or "venv" in root or ".git" in root or "__pycache__" in root:
        continue
    for file in files:
        if file.endswith((".py", ".jsx", ".js", ".html", ".css", ".md", ".txt", ".json")):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    if "hopkins" in content.lower():
                        matches.append(file_path)
            except Exception as e:
                pass

print("Desktop matches:", matches)
