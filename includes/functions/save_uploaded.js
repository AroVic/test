const { response } = require("express");
const fs = require("fs/promises");
const getExt = require("path").extname;
const saveUploaded = async (file, destination) => {
  const originalName = file.originalname || "";
  const fileExtension = getExt(originalName);

  if (!fileExtension || !destination) {
    try {
      await fs.unlink(file.path);
    } catch (r) {}
    return { error: "file has been removed!" };
  }

  let { filename } = file;

  destination = destination + "/" + filename + fileExtension;

  await fs.rename(file.path, destination);

  return { ok: true, file: filename + fileExtension };
};

module.exports = saveUploaded;
