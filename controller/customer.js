const customermodel = require('../model/customerSchema');
const jwt = require('jsonwebtoken');
module.exports = {
  newcutomer: async (req, res) => {
    const { name, email, password, dob } = req.body;
    const { image } = req.files;
    console.log(req.body);
    console.log(image);
    res.render('home');
    const imagepath = Date.now() + '-' + image.name;
    const path = `./public/images/${imagepath}`;
    const checkEmail = await customermodel.findOne({ email });
    if (checkEmail) {
      res.json({ message: 'email is already exist' });
    } else {
      const passwordGenerate = await bcrypt.hash(password, 10);
      image.mv(path, async (err) => {
        if (err) {
          console.log(err);
        } else {
          const passwordGenerate = await bcrypt.hash(password, 10);
          await customermodel.create({
            name,
            email,
            password: passwordGenerate,
            dob,
            profile: `http://localhost:4000/${imagepath}`,
          });
          // res.json({ message: 'customer info is created' });
        }
      });
    }
  },
  customerlist: async (req, res) => {
    const result = await customermodel.find();
    res.json({ message: 'cutomer list is displayed', data: result });
  },
  customerUpdate: async (req, res) => {
    const { name, email, password, dob, id } = req.body;
    const checkId = await customermodel.findById(id);
    const passwordGenerate = await bcrypt.hash(password, 10);
    if (checkId) {
      await customermodel.findOneAndUpdate(id, {
        name,
        email,
        password: passwordGenerate,
        dob,
      });
      res.json({ message: 'cutomer info is updated', data: checkId });
    } else {
      res.json({ message: 'customer does not exist' });
    }
  },
  customerGetById: async (req, res) => {
    const { id } = req.params;
    const checkId = await customermodel.findById(id);
    if (checkId) {
      await customermodel.findByIdAndUpdate(id);
      res.json({ message: 'customer get by id', data: checkId });
    } else {
      res.json({ message: 'customer details doex not exist' });
    }
  },
  customerlogin: async (req, res) => {
    const { email, password } = req.body;
    const checkEmail = await customermodel.findOne({ email });
    if (checkEmail) {
      if (await bcrypt.compare(password, checkEmail.password)) {
        const token = jwt.sign({ email }, 'secretkey');
        res.json({ message: 'customer is login', token });
      } else {
        res.json({ message: 'password is wrong' });
      }
    } else {
      res.json({ message: 'Email is not valid' });
    }
  },
};
