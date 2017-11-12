var express = require('express'),
    router  = express.Router(),
    Campground      = require('../models/campgrounds'),
    middleware      = require('../middleware');

//==================
//Campground Routes
//==================

//INDEX, shows all campgrounds
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            req.flash("error", err.message);
            res.redirect("/");
        }
        else{
            res.render("index",{campgrounds: allCampgrounds});
        }
    });
});

//NEW, show form to create new campground.
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("new");
});

//Adds new campground
router.post("/", middleware.isLoggedIn, function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {"name":name, "image": image, "description": description, "author": author};
    Campground.create(newCampground, function(err,newcampground){
    if(err){
        req.flash("error", err.message);
        res.redirect("/campgrounds/new");
    }
    else{
        req.flash("success", "Campground created successfully");
        res.redirect("/campgrounds");
    }
});
   
});

//SHOW page, show a particular campground
router.get("/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        else{
            res.render("show",{campground: foundCampground});
        }
    });
});

//Edit Campground Route to show form
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("edit", {campground : foundCampground});
    });
});

//Update Campground Route to Post form
router.put("/:id", middleware.checkCampgroundOwner, function(req,res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
           req.flash("success", "Successfully updated Campground!");
           res.redirect("/campgrounds/" + req.params.id);
   });
});

//Destroy Campground
router.delete("/:id", middleware.checkCampgroundOwner, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        req.flash("success", "Successfully deleted campground!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;