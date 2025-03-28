import express from 'express';
import cors from 'cors';
import departmentRoutes from './routes/departments.js'
import instructorRoutes from './routes/instructors.js'
import userroutes from './routes/users.js'
import reviewroutes from './routes/reviews.js'
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 8000;
const app = express();

// CORS with credentials (cookies)
app.use(cors({
  origin: 'http://localhost:3000', // URL of the React app
  credentials: true,               
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/departments', departmentRoutes);
app.use('/api/instructor/', instructorRoutes);
app.use('/api/user', userroutes);
app.use('/api/review', reviewroutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
