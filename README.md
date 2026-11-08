\# CodeCraftHub – API de Gestión de Cursos



\## Descripción



CodeCraftHub es una API REST desarrollada con Node.js y Express para gestionar cursos de aprendizaje. Permite crear, consultar, actualizar y eliminar cursos, almacenando la información en un archivo JSON.



\## Tecnologías utilizadas



\- Node.js

\- Express.js

\- JavaScript

\- JSON

\- Módulo File System (fs)



\## Características



\- Crear cursos.

\- Consultar todos los cursos.

\- Consultar cursos por identificador.

\- Actualizar cursos.

\- Eliminar cursos.

\- Consultar estadísticas.

\- Validar los datos ingresados.

\- Guardar la información en courses.json.



\## Requisitos



\- Node.js instalado.

\- npm.

\- PowerShell o una terminal de comandos.



\## Estructura del proyecto



```text

code-craft-hub/

├── app.js

├── courses.json

├── package.json

├── package-lock.json

├── README.md

├── data/

└── src/

```



\## Instalación



Ingresar a la carpeta del proyecto:



```powershell

cd C:\\Users\\WWW-J\\code-craft-hub

```



Instalar las dependencias:



```powershell

npm install

```



\## Ejecución



Iniciar el servidor:



```powershell

npm start

```



La API estará disponible en:



http://localhost:5000



\## Endpoints



| Método | Endpoint | Descripción |

|---|---|---|

| GET | / | Mensaje de bienvenida |

| POST | /api/courses | Crear un curso |

| GET | /api/courses | Consultar todos los cursos |

| GET | /api/courses/stats | Consultar estadísticas |

| GET | /api/courses/:id | Consultar curso por ID |

| PUT | /api/courses/:id | Actualizar curso |

| DELETE | /api/courses/:id | Eliminar curso |



\## Ejemplo para crear un curso



Método: POST



Endpoint:



http://localhost:5000/api/courses



Cuerpo JSON:



```json

{

&#x20; "name": "Python Básico",

&#x20; "description": "Aprender los fundamentos de

