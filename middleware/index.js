//Middlware
var Campground = require("../models/campgrounds"),
    Comment    = require("../models/comment"),
    middlewareObj = {};

middlewareObj.checkCampgroundOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Could not find Campground");
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You do not have the permission to do this!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to login first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else{
                console.log(foundComment.author.id);
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error","You do not have permission to do this");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to login first");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("error","Login first!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;