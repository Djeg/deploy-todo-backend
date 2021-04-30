require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
let db = null;

app.use(express.json())
app.use(cors({
    origin: true,
}));

app.get('/todos', async (req, res) => {
    const todos = await db.collection('todos').find().toArray();

    res.json(todos);
})

app.post('/todos', async (req, res) => {
    const newTodos = req.body;

    await db.collection('todos').insertMany(newTodos);

    const todos = await db.collection('todos').find().toArray();

    res.json(todos);
})

app.patch('/todos/:id', async (req, res) => {
    const todo = await db.collection('todos').findOne({
        _id: new ObjectID(req.params.id),
    })

    await db.collection('todos').updateOne({
        _id: new ObjectID(req.params.id),
    }, { $set: { complete: !todo.complete } });

    const todos = await db.collection('todos').find().toArray();

    res.json(todos);
})

app.delete('/todos/:id', async (req, res) => {
    const todo = await db.collection('todos').findOne({
        _id: new ObjectID(req.params.id),
    })

    await db.collection('todos').deleteOne({
        _id: new ObjectID(req.params.id),
    });

    const todos = await db.collection('todos').find().toArray();

    res.json(todos);
});

/** Start the application */
console.log('connecting to mongodb ...');

MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err, client) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('Mongo connection done!');

    db = client.db(process.env.MONGO_DB_NAME);

    app.listen(process.env.PORT, () => {
        console.log(`Server todo is listening at: http://localhost:${process.env.PORT}/todos`);
    })
});
