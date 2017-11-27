var mongoose = require("mongoose"),
    // faker = require("faker"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
var data = [
    {
        name: "Sepaq",
        image: "http://s3.amazonaws.com/imagescloud/images/reservation/categorie-camping.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non velit urna. Mauris venenatis at arcu ut vestibulum. Integer euismod turpis at ipsum molestie ornare. Integer eros nisi, dignissim congue nisl nec, fringilla mollis lacus. Donec scelerisque augue id neque suscipit ultrices. Fusce scelerisque ullamcorper nulla vestibulum egestas. Phasellus eget ligula sollicitudin, vestibulum enim ut, feugiat urna. Aliquam consequat ac lectus eget rhoncus."
    },
    {
        name: "Parc Canada",
        image: "https://cdn.viago.ca/wp-content/uploads/2016/01/ParcCanada.jpg",
        description: "Praesent sed scelerisque nibh. Nunc id accumsan lorem. In feugiat vulputate enim ac commodo. Vivamus eros sapien, tincidunt nec egestas eget, aliquet quis sapien. Donec eleifend venenatis nisl, sit amet aliquet nunc pharetra eget. Suspendisse tincidunt risus odio, et pulvinar dui tempus eu. Vivamus dapibus metus ut tempor semper. Aliquam erat volutpat. Fusce viverra libero fringilla, porta nisl at, congue augue."
    },
    {
        name: "Camping Québec",
        image: "https://www.campingquebec.com/~/media/Images/Camper%20au%20Quebec/Tente_cuisinette_MLP1140.jpg?mw=560&hash=66B7C446C52E4D71B4B7EE8FEC87252B48D82DA0",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at accumsan felis. Phasellus ut nibh id est luctus fermentum vitae eu mi. Nullam ut aliquet ex. Mauris maximus libero pretium nibh tempor dictum. Phasellus nec arcu tincidunt, dignissim justo ac, sollicitudin nunc. Aenean sit amet elit at lectus aliquam fringilla vitae eget nulla. Nulla eu magna lectus. Nam quis tristique leo. Donec vel ipsum eget tellus cursus consectetur. Vestibulum in ipsum et est semper molestie. Proin iaculis, metus sed mollis fringilla, dui orci facilisis metus, et luctus quam elit sit amet est. Sed auctor, odio eu dapibus commodo, lorem tellus volutpat mi, id dapibus nibh mauris eget ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec pulvinar nibh."
    }
]

function seedDB(){
    // Remove all campgrounds
    Campground.remove({}, function(err){
        if (err) {
            console.log(err);
        } else {
            console.log("removed all campgrounds");
            // add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        
                        // add a few comments
                        Comment.create({
                            text: "Great place, but lacks beer!",
                            author: "Homer Simson"
                        }, function(err, comment){
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;