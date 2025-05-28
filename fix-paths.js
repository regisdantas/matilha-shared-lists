const fs = require("fs");
const path = require("path");

// Corrige index.html
const htmlPath = path.join("dist", "index.html");
let html = fs.readFileSync(htmlPath, "utf8");
html = html.replace(/(href|src)="\/(.*?)"/g, '$1="./$2"');
fs.writeFileSync(htmlPath, html);
console.log("✅ Caminhos corrigidos em index.html");

// Corrige JS principal gerado (com hash dinâmico)
const jsDir = path.join("dist", "_expo", "static", "js", "web");

fs.readdirSync(jsDir).forEach(file => {
  if (file.startsWith("index-") && file.endsWith(".js")) {
    const jsPath = path.join(jsDir, file);
    let jsContent = fs.readFileSync(jsPath, "utf8");

    // Corrige URLs absolutas dentro do JS
    jsContent = jsContent.replace(/(new URL\(")\//g, '$1./');

    fs.writeFileSync(jsPath, jsContent);
    console.log(`✅ Caminhos corrigidos em ${file}`);
  }
});
