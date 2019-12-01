
const fs = require('fs');
exports.hello_world = (req, res) => {
    console.log('Hello All!');
    res.status(200).send({ desc: "Welcome from ToDoApi!" });
};

exports.list_all_todo = (req, res) => {
    let data = fs.readFileSync('todo.json');
    let todos = JSON.parse(data);

    console.log('Hello List!');
    res.status(200).send({
        success:'true',
        data:todos
    });

};
exports.add_todo = (req, res) => {
    if (!req.body.id) {
        return res.status(400).send({
            success: 'false',
            message: 'user is required'
        });
    } else if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    }
    let data = fs.readFileSync('todo.json');
    let todos = JSON.parse(data);
    let id = req.body.id;
    let title = req.body.title;
    let obj = todos.find((element) => {
        return element.id == id;
    })
    if (!obj) {
        //Ako ne postoji korisnik
        obj = {
            id: id,
            items: []
        }
        todos.push(obj);
    }
    obj.items.push({title:title})
    //todos[obj].items.push(title);
    console.log(todos);
    fs.writeFile('todo.json', JSON.stringify(todos), 'utf8',()=>{
        console.log('It Works!');
    });
    console.log(`User ${obj} updates`);
    res.status(200).send({
        success: 'true',
        message: 'Todo added Succesfully'

    });
}


exports.get_todo = (req, res) => {

    if (!req.body.id) {
        return res.status(400).send({
            success: 'false',
            message: 'id is required'
        });
    }

    let data = fs.readFileSync('todo.json');
    let todos = JSON.parse(data);
    let id=req.body.id;
    let obj = todos.find((element) => {
        return element.id == id;
    })
    if (!obj) {
        return res.status(404).send({
            success: 'false',
            message: 'user not found :('
        });
    }
    console.log('Hello Get For User!');
    res.status(200).send({
        success: 'true',
        items:obj.items
    });

};

exports.delete_todo = (req, res) => {
    console.log('hello from delete');
    if (!req.body.id) {
        return res.status(400).send({
            success: 'false',
            message: 'user is required'
        });
    } else if (!req.body.title) {
        return res.status(400).send({
            success: 'false',
            message: 'title is required'
        });
    }
   
    let data = fs.readFileSync('todo.json');
    let todos = JSON.parse(data);
    let id = req.body.id;
    let title = req.body.title;
    let obj = todos.find((element) => {
        return element.id == id;
    })
    if (!obj) {
        //Ako ne postoji korisnik
        return res.status(400).send({
            success: 'false',
            message: 'task not found'
        });
    }
    let idx = obj.items.indexOf(title);
    obj.items.splice(idx, 1);
    //todos[obj].items.push(title);
    console.log(todos);
    fs.writeFile('todo.json', JSON.stringify(todos), 'utf8',()=>{
        console.log('It Works!');
    });
    console.log(`User ${obj} deletes`);
    res.status(200).send({
        success: 'true',
        message: 'Todo deleted Succesfully'
 
    });
}