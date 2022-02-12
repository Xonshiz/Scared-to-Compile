const Component = require('../models/components.model');


exports.AddComponents = (req,res,next) => {

    const components = req.body;
    
    /*components.forEach(ele => { 
        ele._id = ele.id; 
        delete ele.id;
        return ele;
    });*/

    Component.find({})
    .then(results => {
        if(results && results.length > 0){
            Component.deleteMany().then((result) => {
                console.log(result);
                insertMultipleRecords(res,components);
            });
        }else{
            insertMultipleRecords(res,components);
        }        
              
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
}


exports.GetComponents = (req,res,next) => {
    Component.find({},{_id:0,__v:0})
    .then(results => {
        res.json(results);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    })
}


function insertMultipleRecords(res,components){
    /*Promise.all(components.map(ele => {
            let component = new Component(ele);
            return component.save();
        }))*/
    Component.insertMany(components)        
        .then(result => {
            res.json({result:"added"});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error:"error in server check console.log"});
        })  
}