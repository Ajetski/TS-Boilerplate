import express, { Request, Response } from 'express';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World!');
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
