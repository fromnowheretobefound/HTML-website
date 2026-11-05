# HTML website tutorial

Learn how to create a basic page with HTML and CSS. The downloadable [plain-text tutorial](website%20source%20code.txt) is also available.

## 1. Plan your page

Choose the purpose, audience, and content of your website. Start with a heading and a short paragraph.

## 2. Create an HTML file

Open a plain-text editor and save a new file as `index.html`. In Windows Notepad, select **All files** in the save dialog so the filename does not become `index.html.txt`.

## 3. Add structure, content, and styling

Copy this complete example into `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Website</title>
    <style>
      body {
        background-color: #f2f2f2;
        color: #222;
        font-family: sans-serif;
        margin: 2rem;
        line-height: 1.5;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
    <p>This is some sample text.</p>
  </body>
</html>
```

The `head` contains the page title, metadata, and CSS. The `body` contains visible content. The `h1` element creates the main heading, while `p` creates a paragraph.

## 4. View and edit your page

Save the file and open `index.html` in your browser. Change the paragraph or background color, save again, and refresh the browser to see your changes. No package installation or build command is needed for this example.

## Troubleshooting

- If the browser displays source text, check that the filename ends in `.html`, not `.txt`.
- If an edit does not appear, save the file and refresh the same file in the browser.
- Copy only the code inside the HTML code block; tutorial instructions belong outside the HTML file.

Once the page works, experiment with links, images with descriptive `alt` text, and a separate CSS file.
