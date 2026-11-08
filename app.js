
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Archivo donde se guardan los cursos
const DATA_FILE = path.join(__dirname, "courses.json");

// Estados permitidos
const ESTADOS = ["No iniciado", "En progreso", "Completado"];

app.use(express.json());

// Leer cursos desde el archivo JSON
function cargarCursos() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }

  const contenido = fs.readFileSync(DATA_FILE, "utf8");
  const cursos = contenido.trim() ? JSON.parse(contenido) : [];

  if (!Array.isArray(cursos)) {
    throw new Error("El archivo courses.json debe contener una lista de cursos");
  }

  return cursos;
}

// Guardar cursos en el archivo JSON
function guardarCursos(cursos) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(cursos, null, 2),
    "utf8"
  );
}

// Validar información de un curso
function validarCurso(datos, parcial = false) {
  const campos = ["name", "description", "target_date", "status"];

  for (const campo of campos) {
    if (!parcial || datos[campo] !== undefined) {
      if (
        typeof datos[campo] !== "string" ||
        datos[campo].trim() === ""
      ) {
        return `El campo ${campo} es obligatorio y debe ser texto`;
      }
    }
  }

  if (
    datos.status !== undefined &&
    !ESTADOS.includes(datos.status)
  ) {
    return "Estado no válido. Use: No iniciado, En progreso o Completado";
  }

  return null;
}

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de CodeCraftHub"
  });
});

// Crear un curso
app.post("/api/courses", (req, res) => {
  try {
    const error = validarCurso(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const cursos = cargarCursos();

    const nuevoCurso = {
      id: cursos.reduce(
        (max, curso) => Math.max(max, Number(curso.id) || 0),
        0
      ) + 1,
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date.trim(),
      status: req.body.status,
      created_at: new Date().toISOString()
    };

    cursos.push(nuevoCurso);
    guardarCursos(cursos);

    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al crear el curso"
    });
  }
});

// Consultar todos los cursos
app.get("/api/courses", (req, res) => {
  try {
    res.json(cargarCursos());
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al consultar los cursos"
    });
  }
});

// Consultar estadísticas
// Esta ruta debe estar antes de /api/courses/:id
app.get("/api/courses/stats", (req, res) => {
  try {
    const cursos = cargarCursos();

    res.json({
      total: cursos.length,
      no_iniciados: cursos.filter(
        curso => curso.status === "No iniciado"
      ).length,
      en_progreso: cursos.filter(
        curso => curso.status === "En progreso"
      ).length,
      completados: cursos.filter(
        curso => curso.status === "Completado"
      ).length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al consultar estadísticas"
    });
  }
});

// Consultar un curso por su ID
app.get("/api/courses/:id", (req, res) => {
  try {
    const cursos = cargarCursos();

    const curso = cursos.find(
      curso => curso.id === Number(req.params.id)
    );

    if (!curso) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    res.json(curso);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al consultar el curso"
    });
  }
});

// Actualizar un curso
app.put("/api/courses/:id", (req, res) => {
  try {
    const error = validarCurso(req.body, true);

    if (error) {
      return res.status(400).json({ error });
    }

    const cursos = cargarCursos();

    const indice = cursos.findIndex(
      curso => curso.id === Number(req.params.id)
    );

    if (indice === -1) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    cursos[indice] = {
      ...cursos[indice],
      ...req.body,
      id: cursos[indice].id,
      created_at: cursos[indice].created_at
    };

    guardarCursos(cursos);

    res.json(cursos[indice]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al actualizar el curso"
    });
  }
});

// Eliminar un curso
app.delete("/api/courses/:id", (req, res) => {
  try {
    const cursos = cargarCursos();

    const filtrados = cursos.filter(
      curso => curso.id !== Number(req.params.id)
    );

    if (filtrados.length === cursos.length) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    guardarCursos(filtrados);

    res.status(200).json({
      message: "Curso eliminado correctamente"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al eliminar el curso"
    });
  }
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// Manejo general de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Error interno del servidor"
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `CodeCraftHub ejecutándose en http://localhost:${PORT}`
  );
});
