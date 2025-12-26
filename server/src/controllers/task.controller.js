import prisma from "../config/db.js";

/* =========================
   GET TASKS (USER)
========================= */
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({ tasks });
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/* =========================
   CREATE TASK
========================= */
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "El título es requerido",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        userId: req.user.id,
      },
    });

    return res.status(201).json({ task });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/* =========================
   UPDATE TASK
========================= */
export const updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    const { completed, title } = req.body;

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });

    return res.json({ task: updatedTask });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    await prisma.task.delete({
      where: { id: task.id },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

