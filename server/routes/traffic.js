const express = require('express');
const router = express.Router();

router.post('/generate', (req, res) => {
  const { pattern, duration } = req.body;
  console.log(`Generating ${pattern} traffic for ${duration} seconds`);
  res.json({ message: 'Traffic generated' });
});

module.exports = router;
