const validate = async (input, value, unique = false) => {
  let err = null;
  try {
    switch (input) {
      case "name":
        if (value == "") {
          err = "required!";
        } else if (value.length > 100) {
          err = "must not exceed 100 characters!";
        } else if (!/^[a-zA-Z-' ]*$/.test(value)) {
          err = "must not contain numbers or special characters!";
        }
        break;

      case "email":
        if (value == "") {
          err = "required!";
        } else if (value.length > 100) {
          err = "must not exceed 100 characters!";
        } else if (
          !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
            value
          )
        ) {
          err = "email is not valid!";
        } else if (unique) {
          const user = await UserModel.findOne({ email: value });

          if (user) {
            err = "email already exist!";
          }
        }
        break;
      case "password":
        if (value == "") {
          err = "required!";
        } else if (value.length > 30) {
          err = "must not exceed 30 characters!";
        }
        break;
    }
  } catch (t) {}

  return err;
};
