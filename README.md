
# @loom-sdc/design-system

Framework-agnostic, token-driven Web Components library. Built for maximum efficiency and maintainability with Vite, TypeScript, and Vanilla Extract.

[![](https://img.shields.io/badge/bundle%20size-efficient-blue)](https://bundlephobia.com/package/@loom-sdc/design-system)
[![](https://img.shields.io/badge/TypeScript-6.x-blue.svg)](https://www.typescriptlang.org/)
[![](https://img.shields.io/badge/Vite-8.x-9464fd.svg)](https://vitejs.dev/)
[![](https://img.shields.io/badge/Web%20Components-native-29abe2.svg)](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

---

## Filosofía de Consumo

**Barrel Import**  
Uso recomendado solo para prototipos o pruebas rápidas. Importa todos los elementos y tokens, sin optimización de peso.

```js
import '@loom-sdc/design-system/elements';
```

**Subpath Export (Producción/Tree-shaking)**  
Importa y registra solo los componentes necesarios. Esto maximiza la eficiencia del bundle y permite tree-shaking real.

```js
import { LoomButton } from '@loom-sdc/design-system/elements/button';
LoomButton.define(); // registra <loom-button>
```

- Cada subpath (`@loom-sdc/design-system/elements/<component>`) expone solo el componente correspondiente.
- No uses el barrel en producción.

---

## Guía de Inicio Rápido

### 1. Instalación

```bash
npm install @loom-sdc/design-system
```

### 2. Importa el core de estilos y tokens (obligatorio)

```js
import '@loom-sdc/design-system/style.css'; // tokens y estilos globales
import '@loom-sdc/design-system/fonts.css'; // opcional: fuentes TWK Everett
```

> **Nota:** Si alguno de estos archivos no existe en tu distribución, verifica la ruta y genera un placeholder.

### 3. Registro de un componente

```js
import { LoomButton } from '@loom-sdc/design-system/elements/button';

LoomButton.define(); // registra <loom-button>
```

Luego en tu HTML/JSX:

```html
<loom-button>Click me</loom-button>
```

---

## Tabla de Componentes Disponibles

| Nombre      | Ruta de Importación                                      | Tag de Custom Element |
|-------------|---------------------------------------------------------|----------------------|
| LoomBox     | @loom-sdc/design-system/elements/box                    | `<loom-box>`         |
| LoomButton  | @loom-sdc/design-system/elements/button                 | `<loom-button>`      |
| LoomInline  | @loom-sdc/design-system/elements/inline                 | `<loom-inline>`      |
| LoomStack   | @loom-sdc/design-system/elements/stack                  | `<loom-stack>`       |
| LoomText    | @loom-sdc/design-system/elements/text                   | `<loom-text>`        |

---

## Configuración de TypeScript

Para evitar errores de tipos con los subpaths, asegúrate de tener en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

---

## Notas Técnicas

- Todos los componentes deben registrarse explícitamente con `.define()`.
- Los estilos globales y tokens deben importarse siempre antes de usar cualquier componente.
- El consumo granular mediante subpaths es obligatorio en producción para mantener bundles mínimos.
- Si falta algún archivo de estilos global (`style.css`, `fonts.css`), crea un placeholder y verifica la ruta en tu distribución final.

---

**Mantenibilidad y eficiencia de peso son prioritarios.**  
No uses default exports. No dupliques tokens ni estilos. Usa siempre los subpaths para producción.
