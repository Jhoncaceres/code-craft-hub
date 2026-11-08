const express = require("express");
const { randomUUID } = require("crypto");

const {
  readCourses,
  findCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../services/courses.service");

const router = express.Router();

const validStatuses = [
  "No iniciado",
  "En progreso",
  "Completado"
];

function validateCourseData(data, requireAllFields = true) {
  const errors = [];

  if (requireAllFields || data.name !== undefined) {
    if (!data.name || typeof data.name !== "string") {
      errors.push("name es obligatorio y debe ser texto");
    }
  }

  if (requireAllFields || data.description !== undefined) {
    if (!data.description || typeof data.description !== "string") {
      errors.push("description es obligatorio y debe ser texto");
    }
  }

  if (
    requireAllFields ||
    data.targetCompletionDate !== undefined
  ) {
    if (
      !data.targetCompletionDate ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.targetCompletionDate)
    ) {
      errors.push(
        "targetCompletionDate debe tener el formato YYYY-MM-DD"
      );
    }
  }

  if (requireAllFields || data.status !== undefined) {
    if (!validStatuses.includes(data.status)) {
      errors.push(
        `status debe ser uno de: ${validStatuses.join(", ")}`
      );
    }
  }

  return errors;
}

// GET /api/courses
router.get("/", async (req, res, next) => {
  try {
    const courses = await readCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:id
router.get("/:id", async (req, res, next) => {
  try {
    const course = await findCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
});

// POST /api/courses
router.post("/", async (req, res, next) => {
  try {
    const errors = validateCourseData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const now = new Date().toISOString();

    const course = {
      id: randomUUID(),
      name: req.body.name,
      description: req.body.description,
      targetCompletionDate: req.body.targetCompletionDate,
      status: req.body.status,
      createdAt: now,
      updatedAt: now
    };

    const savedCourse = await createCourse(course);

    res.status(201).json(savedCourse);
  } catch (error) {
    next(error);
  }
});

// PUT /api/courses/:id
router.put("/:id", async (req, res, next) => {
  try {
    const errors = validateCourseData(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedCourse = await updateCourse(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      targetCompletionDate: req.body.targetCompletionDate,
      status: req.body.status
    });

    if (!updatedCourse) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/courses/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const errors = validateCourseData(req.body, false);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const allowedFields = [
      "name",
      "description",
      "targetCompletionDate",
      "status"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedCourse = await updateCourse(req.params.id, updates);

    if (!updatedCourse) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/courses/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await deleteCourse(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Curso no encontrado"
      });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
