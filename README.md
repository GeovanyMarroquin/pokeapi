# Prueba tecnica Angular y Pokomen API

Aplicación web construida con Angular para registrar el perfil de un entrenador Pokémon. El flujo principal guía al usuario a través de tres pasos: ingresar sus datos personales, seleccionar su equipo de tres Pokémon desde la PokéAPI, y revisar un resumen con toda la información antes de finalizar.

Demo: https://geovanymarroquin.github.io/pokeapi/#/

## Qué incluye

- Formulario de perfil con validaciones dinámicas según la edad del usuario (DUI para mayores, carné de minoridad para menores).
- Selector de Pokémon con búsqueda en tiempo real y scroll virtual para manejar el listado completo.
- Stepper de navegación que restringe el avance hasta que cada paso esté completo.
- Vista de resumen del perfil al finalizar el registro.

## Cómo correrlo

Solo se necesita tener `pnpm` instalado. Si no lo tienes, puedes instalarlo con:

```bash
npm install -g pnpm
```

Luego se instala las dependencias y levanta el servidor local:

```bash
pnpm install
pnpm start
```

Si no se quiere usar pnpm, también funciona con npm:

```bash
npm install
npm start
```

Si se desea hacer un deploy en Github Pages ya existe el comando en el package.json

```bash
pnpm deploy-gp
```

o en npm

```bash
npm run deploy-gp
```

La aplicación estará disponible en `http://localhost:4200`.
