var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Campground      = require('../models/campgrounds'),
    Comment         = require('../models/comment'),
    middleware      = require('../middleware');

//New comment
router.post("/", middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
            
        }
    })
});

//Edit and Update Comment

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err,comment){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
             res.render("comment",{campground_id: req.params.id, comment: comment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,comment){
      if(err){
          req.flash("error", err.message);
          res.redirect("back");
      } 
      else{
          req.flash("success", "Your comment has been updated!");
          res.redirect("/campgrounds/"+ req.params.id);
      }
   }); 
});

router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
       req.flash("error",  err.message);
       res.redirect("back");
       }
       else{
           req.flash("success", "Comment deleted successfully!");
           res.redirect("back");
       }
       
   }); 
});

module.exports = router;