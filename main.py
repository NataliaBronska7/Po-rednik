import webview
import os

html_file = os.path.abspath("index.html")
webview.create_window("Zagadnienie pośrednika", html_file, width=1000, height=800)
webview.start()
