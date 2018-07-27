var express = require("express");
var mongo=require('mongodb');
var bodyParser = require("body-parser");
var app=express();
var cors = require('cors');

app.use(cors());

var MongoClient = mongo.MongoClient;
var url = "mongodb://aemartinez4:aemartinez4@ds125831.mlab.com:25831/dbtest"; 

app.use(bodyParser.json());

//METODO GET, Obtener todos los objetos y por codigo
app.get('/smartphone/:cod',function(req,res){
    var jsonObj;    
    var code=req.params.cod;
    var codi=parseInt(code);
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dbtest");
        if(code==="todos")
        {
            dbo.collection("smartphone").find({}).toArray(function(err, result) {
            if (err) throw err;            
            jsonObj=result;
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
            db.close();
            });
        }
        else
        {            
            dbo.collection("smartphone").findOne({codigo: codi}, function(err, result) {
                if (err) throw err;
                if(result==null)
                {
                    res.status(404);
                    res.send();
                    db.close();
                }   
                else{             
                    jsonObj=result;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(result);
                    db.close();
                }
            });             
        }
      });
});
//METODO PUT, crear nuevos objetos y almacenarlos en MongoDB
app.put('/smartphone/nuevo',function(req,res){
    var jsonObj=req.body;//Obtencion del objeto JSON
    var fechaLanzamiento=new Date(jsonObj.fecha_lanzamiento);
    jsonObj.fecha_lanzamiento=fechaLanzamiento;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dbtest");
        dbo.collection("smartphone").insertOne(jsonObj, function(err, result) {
          if (err) throw err;
          console.log("1 documento agregado!");
          res.status(200);
          res.send();
          db.close();
        });
      });
});
//METODO POST, ACTUALIZA objetos y almacenarlos en MongoDB
app.post('/smartphone/actualizar',function(req,res){
    var jsonObj=req.body;//Obtencion del objeto JSON
    var codigo={codigo:jsonObj.codigo};
    var objCambios={ $set: jsonObj };
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dbtest");
        dbo.collection("smartphone").updateOne(codigo,objCambios, function(err, result) {
            if (err) throw err;
            console.log("1 documento actualizado!");
            res.status(200);
            res.send();
            db.close();
          });             
      });
});
//METODO DELETE, borra objeto de la BDD MongoDB
app.delete('/smartphone/eliminar/:cod',function(req,res){
    var codi=parseInt(req.params.cod);
    var codigo={codigo:codi};
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dbtest");
        dbo.collection("smartphone").deleteOne(codigo, function(err, result) {
            if (err) throw err;
            console.log("1 documento eliminado!");
            res.status(200);
            res.send();
            db.close();
          });             
      });
});
app.listen(4000);
console.log("Server started on port 4000...");