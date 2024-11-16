import express from 'express';
import cors from 'cors';
import path from 'path';
import departmentRoutes from './routes/departments.js'
import instructorRoutes from './routes/instructors.js'
import userroutes from './routes/users.js'

const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/instructor/', instructorRoutes);
app.use('/api/user', userroutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));