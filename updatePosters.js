mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/cartoonDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Mapping of document IDs to image URLs
const images = {
  "663be45b87690ab53c193f42": "https://i.imgur.com/xKrkL8O.jpg",
  "663be57687690ab53c193f47": "https://i.imgur.com/kzDCHX9.jpg",
  "663be5dc87690ab53c193f4a": "https://i.imgur.com/duxrJa2.jpg",
  "663bd9db87690ab53c193f41": "https://i.imgur.com/TYSqz4R.jpg",
  "663be59587690ab53c193f48": "https://i.imgur.com/AcZn4DV.jpg",
  "663be6ab87690ab53c193f4c": "https://i.imgur.com/Cxtrf2I.jpg",
  "663be68887690ab53c193f4b": "https://i.imgur.com/NlEkTAq.jpg",
  "663be4c487690ab53c193f44": "https://i.imgur.com/ewjfRH4.jpg",
  "663be55b87690ab53c193f46": "https://i.imgur.com/BHGeo59.jpg",
  "663be5c587690ab53c193f49": "https://i.imgur.com/3hys2d6.jpg",
  "663be4e287690ab53c193f45": "https://i.imgur.com/YZUIkWI.jpg",
  "663be4a687690ab53c193f43": "https://i.imgur.com/bhTQOGb.jpg"
  // Add more mappings as needed
};

// Update each document with its corresponding image URL
Object.keys(images).forEach((id) => {
  db.movies.updateOne(
    { _id: ObjectId(id) },
    { $set: { imagePath: images[id] } }
  );
});
