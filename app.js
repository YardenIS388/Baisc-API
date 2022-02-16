const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set("view engone", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true});

//creating a new schema

const articleSchema = {
    title: String, 
    content: String
}
//model
const Article = mongoose.model("Article", articleSchema);
//TODO


                                        // Targeting ALL articles //
app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        //console.log(foundArticles);
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(err);
        }
     
    })

})

.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title , 
        content: req.body.content
    });
        
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("New Article Added Successfully.")
        }
    });
    
    })
    
    .delete(function(req,res){

        Article.deleteMany(function(err){
            if(!err){
                res.send("All Items Were Deleted Succssesfully.");
            } else {
                res.send(err);
            }
        })
    
    });

   //                                     // Targeting a SINGLE article //
  
app.route("/articles/:articleTitle")
.get(function(req,res){

    Article.findOne({title: req.params.articleTitle },function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else{
            res.send("No Article with such title was foind")
        }
        
    });

})
//put replaces ALL object so of you dont update one field it will be deleted !!
.put(function(req,res){
    Article.update({title: req.params.articleTitle},
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated article");
            } else {
                res.send(err);
            }
        }
        )
})
//patch fixes the problem above and only changes what you need
.patch(function(req,res){
Article.update({title: req.params.articleTitle},
                {$set: req.body}, 
                function(err){
                    if(!err){
                        console.log("Succssefully updated articale (PATCH)");
                    } else{
                        console.log(err);
                    }
                }  )
})
//delete only one entry
.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle},
                        function(err){
                            if(!err){
                                console.log("One Item Deleted succssessfuly");
                            } else{
                                console.log(err);
                            }
                        }   )
}) ;                                       


app.listen(3000, function(){
    console.log("Server is running on port 3000");
})