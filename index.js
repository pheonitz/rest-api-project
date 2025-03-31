// Biolerplate code
const express = require("express");
const users = require('./MOCK_DATA.json');
const fs = require("fs");

const app = express();
const port = 8000;

// middleware -> assusme pluggin
app.use(express.urlencoded({extended : false}));

// Routes
app.get('/users' , (req , res)=>{
    const html = `
    <ul>
      ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.send(html);
})


app.get('/api/users' , (req , res) =>{
    return res.json(users);
})

// Dynamic user path
app.get('/api/users/:id' , (req , res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);

    return res.json(user);
})


app.post('/api/users' , (req , res)=>{
    //For creating a new user
    const body = req.body;
    users.push({...body , id: users.length + 1});

    fs.writeFile("./MOCK_DATA.JSON" , JSON.stringify(users) , (err , data) => {
        return res.json({status : "Sucess"});
    });
});  


//.............For updating a user information
app.patch('/api/users/:id' , (req , res)=>{
    const id = Number(req.params.id);
    const updateduserdata = req.body;

    // find user by id
    const user = users.findIndex(user => users.id === id)

    // update 
    users[user] = {...users[user] , ...updateduserdata};

    fs.writeFile("./MOCK_DATA.JSON" , JSON.stringify(users) , (err , data) => {
        return res.json({status : "sucess"});
    })
})


//.............For deleting a user information we use delete http method
app.delete('/api/users/:id' , (req , res)=>{
    const id = Number(req.params.id);
    
    const user = users.findIndex(user => user.id === id);
    users.splice(user , 1);

    
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: "error", message: err.message });
        }
        res.json({ status: "success", message: `User with ID ${id} deleted` });
    });
});


//////////////////////////////////////////////////////////////////////////

app.listen(port , ()=> {console.log("Sever started")});