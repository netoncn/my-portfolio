const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

const STATIC_DIR = path.join(process.cwd(), ".next", "static");

console.log("🗜️  Comprimindo assets estáticos...");

function compressDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      compressDirectory(filePath);
    } else if (
      file.endsWith(".js") ||
      file.endsWith(".css") ||
      file.endsWith(".html") ||
      file.endsWith(".json")
    ) {
      try {
        if (!fs.existsSync(`${filePath}.gz`)) {
          execSync(`gzip -9 -k "${filePath}"`);
          console.log(`✓ Compressed: ${file}`);
        }

        if (!fs.existsSync(`${filePath}.br`)) {
          execSync(`brotli -q 11 -o "${filePath}.br" "${filePath}"`);
          console.log(`✓ Brotli: ${file}`);
        }
      } catch (error) {
        console.error(`✗ Failed to compress: ${file}`, error.message);
      }
    }
  });
}

if (fs.existsSync(STATIC_DIR)) {
  compressDirectory(STATIC_DIR);
  console.log("✅ Compressão concluída!");
} else {
  console.log("⚠️  Diretório .next/static não encontrado");
}
