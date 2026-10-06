const express = require('express');

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Live sports dashboard API is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});