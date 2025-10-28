import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorhandler, notfound } from './middleware/error.js';
import routes from './routes/index.js';
import helmet from 'helmet';
import compression from 'compression';
  
const app = express();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'ChargeNet' }));
app.use('/api/v1/', routes);
app.use(notfound);
app.use(errorhandler);

export default app;
