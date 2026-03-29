fetch("https://api.github.com/repos/microsoft/vscode-remote-try-python").then(r=>r.json()).then(d=>console.log("is_template:", d.is_template))
