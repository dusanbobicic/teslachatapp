
const fs = require('fs');
const SCORE_FILE_NAME = 'scores.json';
const USER_FILE_NAME = 'users.json'
const MEMORY_FILE_NAME ='memory.json';
const uuidv4 = require('uuid/v4');


//SCORE API ----------------------------------

exports.scores = (req, res) => {
    let data = fs.readFileSync(SCORE_FILE_NAME);
    let scores = JSON.parse(data);

    console.log('Get score!');
    res.status(200).send({
        success: true,
        data: scores
    });

}

exports.get_score = (req, res) => {
    if (!req.params.userId) {
        res.status(404).send({
            success: false,
            message: "No parameter!"
        })
        return;
    }
    let data = fs.readFileSync(SCORE_FILE_NAME);
    let scores = JSON.parse(data);
    console.log(req.params.user_id);
    let items = scores.filter((e) => { return req.params.userId == e.user_id });
    if (!items) {
        res.status(404).send({
            success: false,
            message: "User not found!"
        })
        return;
    }
    res.status(200).send({
        success: true,
        data: items
    });
}
exports.add_score = (req, res) => {
    let data = fs.readFileSync(USER_FILE_NAME)
    let users = JSON.parse(data);
    data = fs.readFileSync(SCORE_FILE_NAME);
    let scores = JSON.parse(data);
    let { body: form } = req
    console.log(form);
    if (!(('user_id' in form) && ('score' in form) && ('game_id' in form))) {
        res.status(500).send({
            success: false,
            message: 'Required fields missing!'
        });
        return;
    }
    let score = {
        user_id: form.user_id,
        score_id: uuidv4(),
        score: form.score,
        game_id: form.game_id
    }
    scores.push(score);
    fs.writeFile(SCORE_FILE_NAME, JSON.stringify(scores), 'utf8', () => {
        console.log('It Works!');
    });
    res.status(200).send({
        success: true,
        score: score
    });

}

//USER API ------------------------------------

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
    if (!(('email' in form) && ('password' in form))) {
        res.status(500).send({
            success: false,
            message: 'Required fields missing!'
        });
        return;
    }

    let exist = users.find((e) => e.email == form.email);
    if (!exist) {
        res.status(404).send({
            success: false,
            message: 'User not Found!'
        });
        return;
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
            picture: exist.picture,
            username: exist.username,
        }
        res.status(200).send({ success: true, user: res_user });
    } else {
        res.status(404).send({ success: false, message: 'User not found!' });
    }
}

exports.getCards=(req,res)=>{
    let data = fs.readFileSync(MEMORY_FILE_NAME)
    let cards = JSON.parse(data);

    res.status(200).send({success:true,
    data:cards});
}
