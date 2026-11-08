const fs = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../../data/courses.json");

async function readCourses() {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");

    if (!fileContent.trim()) {
      return [];
    }

    return JSON.parse(fileContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeCourses([]);
      return [];
    }

    throw error;
  }
}

async function writeCourses(courses) {
  const content = JSON.stringify(courses, null, 2);
  await fs.writeFile(filePath, content, "utf-8");
}

async function findCourseById(id) {
  const courses = await readCourses();
  return courses.find((course) => course.id === id);
}

async function createCourse(course) {
  const courses = await readCourses();
  courses.push(course);
  await writeCourses(courses);
  return course;
}

async function updateCourse(id, updatedData) {
  const courses = await readCourses();
  const courseIndex = courses.findIndex((course) => course.id === id);

  if (courseIndex === -1) {
    return null;
  }

  courses[courseIndex] = {
    ...courses[courseIndex],
    ...updatedData,
    id,
    updatedAt: new Date().toISOString()
  };

  await writeCourses(courses);
  return courses[courseIndex];
}

async function deleteCourse(id) {
  const courses = await readCourses();
  const courseIndex = courses.findIndex((course) => course.id === id);

  if (courseIndex === -1) {
    return false;
  }

  courses.splice(courseIndex, 1);
  await writeCourses(courses);

  return true;
}

module.exports = {
  readCourses,
  findCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};