
const fs = require('fs');
const FILE_NAME='chat.json'
exports.hello_world = (req, res) => {
    console.log('Hello All!');
    res.status(200).send({ desc: "Welcome from ToDoApi!" });
};

exports.get_all_messages = (req, res) => {
    let data = fs.readFileSync(FILE_NAME);
    let msgs = JSON.parse(data);

    console.log('Hello List!');
    res.status(200).send({
        success:true,
        data:msgs
    });

};
exports.add_message = (req, res) => {
    if (!req.body.username) {
        return res.status(400).send({
            success: false,
            message: 'user is required'
        });
    }
    if (!req.body.message) {
        return res.status(400).send({
            success: false,
            message: 'message is required'
        });
    }
    let data = fs.readFileSync(FILE_NAME);
    let messages = JSON.parse(data);
    let username = req.body.username;
    let message = req.body.message;
    
    
    let timestamp=Date.now();
    let id=messages.length;
    messages.push({id:id,username:username,message:message,timestamp:timestamp})
    //todos[obj].items.push(title);
    //console.log(todos);
    fs.writeFile(FILE_NAME, JSON.stringify(messages), 'utf8',()=>{
        console.log('It Works!');
    });
    console.log(`User ${username} updates`);
    res.status(200).send({
        success: true,
        message: 'Message added Succesfully'

    });
}


exports.get_message = (req, res) => {

    if (!req.body.username) {
        return res.status(400).send({
            success: 'false',
            message: 'id is required'
        });
    }

    let data = fs.readFileSync(FILE_NAME);
    let messages = JSON.parse(data);
    let username=req.body.username;
    let obj = messages.filter((element) => {
        return element.username == username;
    })
    
    console.log('Hello Get For User!');
    res.status(200).send({
        success: true,
        messages:obj
    });

};

exports.delete_message = (req, res) => {

    return res.status(400).send({
        success: 'false',
        message: 'Work In Progress'
    });

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