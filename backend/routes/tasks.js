import express from "express"


const tasksRoutes = express.Router();

let tasks = [];

tasksRoutes.get('/tasks', async (req, res) => {
    try {
      if (tasks.length === 0) {
        return res.status(200).json({ message: 'No tasks found' });
      }
  
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving tasks' });
    }
  });

tasksRoutes.get('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(task => task.id === taskId);
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    console.log(task);
    res.status(200).json(task);
  });

tasksRoutes.post('/tasks', async(req, res) => {
    try{
        const task = {...req.body, id: Date.now()};
        tasks.push(task);
        res.status(201).json(task);
    }
    catch(error){
        res.status(400).json({message: "Error creating a note", error});
    }
});

tasksRoutes.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
  
    const taskToDelete = tasks.find(task => task.id === id);
  
    if (!taskToDelete) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    tasks = tasks.filter(task => task.id !== id);
  
    res.sendStatus(204);
  });

export default tasksRoutes;
