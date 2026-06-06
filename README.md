# ⛽ FuelFinder

FuelFinder es una aplicación web desarrollada con Angular que permite consultar información actualizada sobre estaciones de servicio terrestres y postes marítimos en España utilizando los servicios REST públicos del Ministerio para la Transición Ecológica y el Reto Demográfico.

El objetivo del proyecto es ofrecer una interfaz moderna, intuitiva y responsive que facilite la búsqueda de carburantes mediante diferentes filtros como provincia, comunidad autónoma, tipo de combustible y precio.

---

## 📚 Descripción del proyecto

Este proyecto ha sido desarrollado como parte de una asignatura universitaria relacionada con el desarrollo de aplicaciones web y el consumo de servicios REST.

La aplicación permite:

* Consultar estaciones de servicio terrestres.
* Consultar postes marítimos.
* Filtrar resultados por comunidad autónoma y provincia.
* Filtrar por tipo de carburante.
* Ordenar los resultados por precio.
* Limitar el número de resultados mostrados.
* Visualizar información relevante de cada estación mediante tarjetas informativas.

---

## 🚀 Tecnologías utilizadas

* Angular 21
* TypeScript
* SCSS
* HTML5
* Angular HttpClient
* Servicios REST públicos del Ministerio

### Entorno de desarrollo

| Tecnología  | Versión |
| ----------- | ------- |
| Angular CLI | 21.2.13 |
| Angular     | 21.2.15 |
| Node.js     | 24.11.1 |
| npm         | 11.6.4  |

---

## 📡 APIs utilizadas

### Estaciones Terrestres

Servicio REST oficial:

https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/

### Postes Marítimos

Servicio REST oficial:

https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/PostesMaritimos/

---

## ✨ Funcionalidades implementadas

### Página de inicio

* Presentación de la aplicación.
* Información sobre el proyecto.
* Acceso rápido al buscador.
* Enlace al repositorio de GitHub.

### Búsqueda de estaciones terrestres

Permite filtrar por:

* Comunidad Autónoma
* Provincia
* Tipo de carburante
* Fecha
* Número de resultados
* Ordenación por precio

### Búsqueda de postes marítimos

Permite filtrar por:

* Provincia
* Tipo de carburante
* Número de resultados
* Ordenación por precio

### Resultados

* Visualización mediante tarjetas
* Información de ubicación
* Precios de carburantes
* Indicador de carga durante las consultas
* Compatibilidad con múltiples combustibles

---

## 📂 Estructura del proyecto

```text
src/
│
├── app/
│   ├── shared/
│   │   ├── navbar/
│   │   └── footer/
│   │
│   ├── pages/
│   │   ├── home/
│   │   └── search/
│   │
│   ├── services/
│   │   └── fuel.service.ts
│   │
│   ├── data/
│   │   ├── ccaa-provincias.ts
│   │   ├── carburantes-terrestres.ts
│   │   └── carburantes-maritimos.ts
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── assets/
│   └── images/
│
└── styles.scss
```

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/yfontanet/FuelFinder.git
```

### 2. Acceder al proyecto

```bash
cd app_carburantes
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
ng serve
```

### 5. Abrir en el navegador

```text
http://localhost:4200
```

---

## 🎨 Diseño

La interfaz utiliza una combinación de colores inspirada en el sector energético:

* Azul marino como color principal
* Naranja para acciones destacadas
* Grises claros para fondos y elementos secundarios

El diseño sigue una filosofía moderna basada en:

* Bordes redondeados
* Tarjetas informativas
* Sombras suaves
* Responsive Design

---

## 👨‍💻 Autor

Desarrollado por:

**Yago Fontanet Rubiño**

Este proyecto ha sido desarrollado con fines educativos y académicos para la asignatura de Tecnologías Emergentes - Actividad 3. Trabajando con datos provenientes de API
