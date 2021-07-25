const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.status(200).json({message: 'OK'});
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

module.exports = app;
