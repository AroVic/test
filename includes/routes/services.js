const { db, ObjectId } = require("../config/db");
const router = require("express").Router();
const app = require("express")();
const sanitize = require("../functions/input_sanitizer");

const uploadImage = require("../functions/multur_logic");

const saveUploaded = require("../functions/save_uploaded");

const collection = db.collection("services");

const validate = async (
  inputErr,
  input,
  value,
  unique = false,
  isFile = false
) => {
  if (!value && isFile) {
    return;
  }
  let err = null;
  switch (input) {
    case "title":
      if (value == "") {
        err = "required!";
      } else if (value.length > 100) {
        err = "must not exceed 100 characters!";
      } else if (!/^[a-zA-Z-' ]*$/.test(value)) {
        err = "must not contain numbers or special characters!";
      }
      break;

    case "description":
      if (value == "") {
        err = "required!";
      } else if (value.length > 1000) {
        err = "must not exceed 1000 characters!";
      }
      break;
    case "image":
      const fileTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!fileTypes.includes(value.mimetype)) {
        err = "Not a valid image";
      } else if (value.size > 1048576 * 3) {
        err = "Image size must not exceed 3mb!";
      }

      break;
  }
  if (err) {
    inputErr.found = true;
    inputErr.errors[input] = err;
  }
};

router.get("/", async (req, res) => {
  const data = await collection.find().toArray();
  res.send(data);
});

router.post("/", uploadImage.single("my_image"), async (req, res) => {
  let { title, description } = req.body;

  // checking validation errors
  const errorCollector = { found: false, errors: {} };
  validate(errorCollector, "title", sanitize(title));
  validate(errorCollector, "description", sanitize(description));
  await validate(errorCollector, "image", req.file, null, true);
  if (errorCollector.found) {
    if (req.file) await saveUploaded(req.file);
    res.status(400).send(errorCollector.errors);
    return;
  }

  // insertion starts here
  let image = "";
  if (req.file) {
    const fres = await saveUploaded(req.file, "uploads/images");
    if (fres.error) {
      res.status(400).send("invalid file!");
      return;
    }
    image = "/services/images/" + fres.file;
  }
  title = sanitize(title);
  description = sanitize(description);

  const data = await collection.insertOne({ title, description, image });
  res.redirect("/");
  //res.send(data);
});
app.use(function (err, req, res, next) {
  console.log(err);
});
router.put("/", uploadImage.single("image"), async (req, res) => {
  let { title, description, id } = req.body;
  let image = req.file || "";

  if (!id) {
    res.status(400).send("Missing id field");
    return;
  }

  // checking validation errors
  const errorCollector = { found: false, errors: {} };
  validate(errorCollector, "title", sanitize(title));
  validate(errorCollector, "description", sanitize(description));

  if (errorCollector.found) {
    res.status(400).send(errorCollector.errors);
    return;
  }

  title = sanitize(title);
  description = sanitize(description);

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, description } }
  );
  res.send("updated");
});

router.delete("/", async (req, res) => {
  if (!req.query.id) {
    res.status(400).send("Missing id field");
    return;
  }
  const { id } = req.query;
  const data = await collection.findOneAndDelete({ _id: new ObjectId(id) });
  saveUploaded({
    path: data.value.image.replace("/services", "uploads"),
  });
  res.send("droped");
});

router.post("/test", uploadImage.single("my_image"), async (req, res) => {
  res.send("inserted!");
});

module.exports = router;
