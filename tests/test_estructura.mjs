// =========================================================
// Prueba automática de estructura y buenas prácticas del sitio
// Ejecutar desde la raíz del repo:   node tests/test_estructura.mjs
// No necesita instalar nada: solo Node.js
// =========================================================
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const html = readFileSync("index.html", "utf8");

test("el documento declara idioma y charset", () => {
  assert.match(html, /<html lang="es">/);
  assert.match(html, /<meta charset="UTF-8">/i);
});

test("es responsive: tiene meta viewport", () => {
  assert.match(html, /name="viewport"/);
});

test("SEO básico: title y meta description", () => {
  assert.match(html, /<title>[^<]{10,}<\/title>/);
  assert.match(html, /name="description" content="[^"]{30,}"/);
});

test("hay exactamente un <h1>", () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
});

test("usa etiquetas semánticas", () => {
  assert.match(html, /<main[\s>]/);
  assert.match(html, /<footer[\s>]/);
});

test("todas las imágenes tienen texto alternativo", () => {
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  imgs.forEach(img => assert.match(img, /alt="/, `Falta alt en ${img}`));
});

test("los archivos CSS y JS enlazados existen", () => {
  const rutas = [...html.matchAll(/(?:href|src)="(assets\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(rutas.length >= 2, "Debería enlazar al menos un CSS y un JS");
  rutas.forEach(r => assert.ok(existsSync(r), `No existe ${r}`));
});
