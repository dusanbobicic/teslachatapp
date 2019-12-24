const fs = require('fs');
const USER_FILE_NAME = 'users.json';
const MESSAGES_FILE_NAME = 'messages.json';
const TOPICS_FILE_NAME = 'topics.json';
const uuidv4 = require('uuid/v4');


//----------------MESSAGES-------------
exports.get_all_messages = (req, res) => {
    let data = fs.readFileSync(MESSAGES_FILE_NAME);
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
    if(!req.body.topic_id){
        return res.status(400).send({
            success: false,
            message: 'Topic is required!'
        });
    }
    let data = fs.readFileSync(MESSAGES_FILE_NAME);
    let messages = JSON.parse(data);
    let username = req.body.username;
    let message = req.body.message;
    let topic_id=req.body.topic_id;
    
    let timestamp=Date.now();
    let id=uuidv4();
    messages.push({message_id:id,username:username,topic_id:topic_id,message:message,timestamp:timestamp})
    //todos[obj].items.push(title);
    //console.log(todos);
    fs.writeFile(MESSAGES_FILE_NAME, JSON.stringify(messages), 'utf8',()=>{
        console.log('It Works!');
    });
    console.log(`User ${username} updates`);
    res.status(200).send({
        success: true,
        message: 'Message added Succesfully'

    });
}


exports.get_message = (req, res) => {

    if (!req.params.topic_id) {
        return res.status(400).send({
            success: 'false',
            message: 'Topic ID is required'
        });
    }

    let data = fs.readFileSync(MESSAGES_FILE_NAME);
    let messages = JSON.parse(data);
    let topic_id=req.params.topic_id;
    let obj = messages.filter((element) => {
        return element.topic_id == topic_id;
    })
    
    console.log('Hello Get For User!');
    return res.status(200).send({
        success: true,
        messages:obj
    });

};



//----------------------------------TOPICS----------------------------------------------

exports.get_all_topics = (req, res) => {
    let data = fs.readFileSync(TOPICS_FILE_NAME);
    let msgs = JSON.parse(data);

    console.log('Hello List!');
    res.status(200).send({
        success:true,
        topics:msgs
    });

};
exports.add_topic = (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            success: false,
            message: 'Title is required'
        });
    }
    if(!req.body.user_id){
        return res.status(400).send({
            success:false,
            message:'User is required!'
        })
    }
    
    let data = fs.readFileSync(TOPICS_FILE_NAME);
    let messages = JSON.parse(data);

    let user_id=req.body.user_id;
    let timestamp=Date.now();
    let title=req.body.title;
    let id=uuidv4();
    messages.push({topic_id:id,user_id:user_id,title:title,timestamp:timestamp})
    //todos[obj].items.push(title);
    //console.log(todos);
    fs.writeFile(TOPICS_FILE_NAME, JSON.stringify(messages), 'utf8',()=>{
        console.log('It Works!');
    });
    console.log(`Topic added`);
    res.status(200).send({
        success: true,
        message: 'Topic added Succesfully'

    });
}

//--------------------------USERS------------------------

exports.getUsers = (req, res) => {
    let data = fs.readFileSync(USER_FILE_NAME)
    let users = JSON.parse(data);
    let result = users.map(x => { return { user_id: x.user_id, name: x.name, surname: x.surname, username: x.username, email: x.email, picture: x.picture } });
    res.status(200).send({
        success: true,
        users: result
    });
}
exports.register = (req, res) => {
    let data = fs.readFileSync(USER_FILE_NAME)
    let users = JSON.parse(data);
    let { body: form } = req;
    if (!(('email' in form) && ('password' in form) && ('username' in form) && ('name' in form) && ('surname' in form))) {
        res.status(500).send({
            success: false,
            message: 'Required fields missing!'
        });
        return;
    }
    let user = {
        user_id: uuidv4(),
        name: form.name,
        surname: form.surname,
        email: form.email,
        picture: null,
        username: form.username,
        password: form.password
    }
    let exist = users.find((e) => { return (e.username == form.username || e.email == form.email) });
    if (exist) {
        res.status(500).send({
            success: false,
            message: 'User already exists!'
        });
        return;
    }
    users.push(user);
    fs.writeFile(USER_FILE_NAME, JSON.stringify(users), 'utf8', () => {
        console.log('It Works!');
    });
    let res_user = {
        user_id: user.user_id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        picture: user.picture,
        username: user.username,
    }
    res.status(200).send({ success: true, user: res_user });
}

exports.logIn = (req, res) => {
    let data = fs.readFileSync(USER_FILE_NAME)
    let users = JSON.parse(data);
    let { body: form } = req;
    if (!(('username' in form) && ('password' in form))) {
        return res.status(500).send({
            success: false,
            message: 'Required fields missing!'
        });
       
    }

    let exist = users.find((e) => e.username == form.username);
    if (!exist) {
        return res.status(404).send({
            success: false,
            message: 'User not Found!'
        });
       
    }

    if (exist.password == form.password) {
        let res_user = {
            user_id: exist.user_id,
            name: exist.name,
            surname: exist.surname,
            email: exist.email,
            picture: exist.picture,
            username: exist.username,
        }
        res.status(200).send({ success: true, user: res_user });
    } else {
        res.status(401).send({ success: false, message: 'Bad login!' });
    }

}

exports.getUserInfo = (req, res) => {
    let data = fs.readFileSync(USER_FILE_NAME)
    let users = JSON.parse(data);
    let id = req.params.userId;
    let exist = users.find((e) => { return e.user_id == id });
    if (exist) {
        let res_user = {
            user_id: exist.user_id,
            name: exist.name,
            surname: exist.surname,
            email: exist.email,
            username: exist.username,
        }
        res.status(200).send({ success: true, user: res_user });
    } else {
        res.status(404).send({ success: false, message: 'User not found!' });
    }
}