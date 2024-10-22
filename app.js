import express from 'express';
import path from 'path';
import departmentRoutes from './routes/departments.js'
import instructorRoutes from './routes/instructors.js'

const port = process.env.PORT || 8000;
const app = express();

//Routes
app.use('/departments', departmentRoutes);
app.use('/instructor/', instructorRoutes)

app.listen(port, () => console.log(`Server is running on port ${port}`));