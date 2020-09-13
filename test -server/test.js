const crypto = require("crypto");
const generateToken = async () => {
  return await new Promise((resolve, reject) => {
    crypto.randomBytes(50, (err, buf) => {
      if (err) reject("unable to generate token.");
      resolve(buf.toString("hex"));
    });
  });
};

async function abc() {
  const a = await generateToken();
  console.log(a);
}

abc();
