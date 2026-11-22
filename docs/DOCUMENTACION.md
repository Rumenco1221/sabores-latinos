# Documentación técnica — Sabores Latinos

## Objetivo
Landing de un restaurante de comida callejera latinoamericana con menú filtrable por país, carrito de pedido y reserva de mesa con validación.

## Arquitectura
Sitio estático de una sola página, sin dependencias:

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura y contenido semántico |
| `assets/css/styles.css` | Estilos, paleta en variables CSS, responsive y animaciones |
| `assets/js/main.js` | Interactividad. Los datos viven en arrays/objetos y se pintan en el DOM con funciones |

### Patrón usado en el JavaScript
1. **Datos** en arrays de objetos (como si vinieran de una API).
2. **Funciones de render** que convierten datos en HTML con template literals.
3. **Eventos** que modifican los datos y vuelven a llamar al render.

Separar datos, render y eventos es la misma idea que después usan React y Vue.

## Decisiones de diseño
- Paleta: Magenta `#E4007C`, cempasúchil `#FFB000`, turquesa `#00A6A6`, chile `#D7263D`
- Tipografía: Bowlby One + Work Sans
- Se respeta `prefers-reduced-motion` para personas sensibles al movimiento.
- Todos los controles se pueden usar con teclado y tienen foco visible.

## Accesibilidad
- `lang="es"`, un solo `<h1>`, landmarks `<header>`, `<main>`, `<footer>`.
- Botones reales (`<button>`) para acciones, enlaces (`<a>`) para navegar.
- `aria-label`, `aria-pressed` o `aria-live` donde el estado cambia sin recargar.

## Pruebas
`node --test tests/test_estructura.mjs` revisa SEO básico, semántica, `alt` en imágenes y que existan los recursos enlazados.

## Publicación
GitHub Pages: Settings → Pages → Branch `main` / carpeta `/ (root)` → Save.
