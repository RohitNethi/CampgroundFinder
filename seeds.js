var mongoose    = require('mongoose'),
    Campground  = require('./models/campgrounds.js'),
    Comment     = require('./models/comment'),
    data        = [{
        name: "Cloud's rest",
        image: "https://farm3.staticflickr.com/2925/14188830468_015aa0ffec.jpg",
        description: "More like a beach"
    },
    {
        name: "Canyon's floor",
        image: "https://farm4.staticflickr.com/3909/14414459910_ba5be90e67.jpg",
        description: "More like a beach"
    },
    {
        name: "Spring Hill",
        image: "https://farm3.staticflickr.com/2948/15264264069_3e72a00f4d.jpg",
        description: "More like a beach"
    }];
    
    function seedDB(){
    //Remove all Campgrounds
    Campground.remove({},function(err){
      if(err){
          console.log("error");
      } 
     else{
          console.log("Removed all campgrounds");
          //Adding a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed,function(err,campground){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log(campground);
                        //Add new comment
                        Comment.create({
                          text: "Need internet bruh!",
                          author: "Rohit Nethi"
                        },function(err,comment){
                            if(err){
                                console.log("error");
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("new comment created");
                            }
                        });
                        
                    }
                });
            });
     }
    });
}
    //Adding comments

module.exports = seedDB;