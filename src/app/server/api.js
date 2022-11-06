const express=require("express")
const mongo=require("mongodb").MongoClient
const router=express.Router()
const app=express()
const bodyparser=require("body-parser")
app.use(bodyparser.json({limit: '50mb'}))
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
const url="mongodb://127.0.0.1:27017/"
var d
mongo.connect(url,(err,db)=>{
    if(err) throw err;
    console.log("Database created")
    var dbs=db.db("mydb")
    d=dbs

    // dbs.createCollection("data",(err)=>{
    //     if(err) throw err
    //     console.log("Collection created")
    //     db.close()
    // })


    
})


router.post('/register',(req,res)=>{
    let data=req.body
    var obj={email:data.email,password:data.password}
    d.collection('data').insertOne(obj,(err)=>{
        if(err) throw err
        console.log("data inserted")
        res.send(JSON.stringify("data inserted"))
    })
})

router.post('/login',(req,res)=>{
    let data=req.body
    d.collection("data").findOne({email:data.email},(error,usr)=>{
        if(error){
            console.log(error)
        }
        else{
           if(!usr){
            res.status(401).send('invalid user')
           }else{
            if(usr.password!==data.password){
                res.status(401).send('Invalid password')
            }else{
                res.status(200).send("Authentication successful")
            }
           }
        }
    })
})

router.post('/file',(req,res)=>{
    let data=req.body
    d.collection("new").createIndex({"sno":1},{unique:true})   
    if(req.body){

    for(let i=0;i<data.length;i++){
        const dat={
            sno:data[i]['sno'],
            drawingnumber:data[i]['drawingnumber'],
            componentname:data[i]['componentname'],
            partname:data[i]['partname'],
            material:data[i]['material'],
            sequencename:data[i]['sequencename'],
            opn:data[i]['opn'],
            bar:data[i]['bar'],
            insertspec:data[i]['insertspec'],
            noofedge:data[i]['noofedge'],
            edgelife:data[i]['edgelife'],
            make:data[i]['make'],
            supplier:data[i]['supplier'],
            rate:data[i]['rate'],
            insertlife:data[i]['insertlife'],
            alternateinsert:data[i]['alternateinsert'],
            noofedgeforalternative:data[i]['noofedgeforalternative']
        

            
        }

        d.collection("new").insert([dat],{upsert:true})
    }
    res.send(JSON.stringify("Data loaded"))
}

    else{
        res.send(JSON.stringify("OOPS there is some error"))

    }

    
})

router.post('/getdata',(req,res)=>{
   let data=req.body
   let obj={drawingnumber:data.drawingnumber,partname:data.partname,sequencename:data.sequencename}
   d.collection("new").findOne(obj,(err,dat)=>{
    if (err) throw err
    res.send(JSON.stringify(dat))
   })

})



module.exports=router