const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cors())

const users = [
  { id: 1, name: 'Karan', age: 28, email: 'karan@gmail.com', password: '123' },
  { id: 2, name: 'Nilesh', age: 27, email: 'nilesh@gmail.com', password: '123' }
]

const tokenVerify = (token)=>{
  return new Promise((resolve, reject)=>{
   jwt.verify(token, 'qwdkljlfkjdslkgjse1231243', (err, data)=>{
     console.log(err, data);
     err?
      reject(null) :
      resolve(data)
   })
  })
}

const authenticateToken = async (req, res, next)=>{
  if(req.headers && req.headers['authorization']) {
    const token = req.headers['authorization'].split(' ')[1]

    if(!token)
      return res.status(401).json({ status: false, message: 'invalid token' })

    try {
      const data = await tokenVerify(token)

      if(!data)
        return res.status(401).json({ status: false, message: 'token expired' })

      req.user = data
      return next()
    } catch (error) {
      console.log(error)
      return res.status(401).json({ status: false, message: 'invalid token' })
    }
  } else
    return res.status(401).json({ status: false, message: 'no token provided' })
}

app.post('/login', (req, res)=>{
  const { email, password } = req.body

  const user = users.filter((e)=>{
    return e.email == email && e.password == password
  })

  if(user.length>0) {
    var token = jwt.sign(user[0], 'qwdkljlfkjdslkgjse1231243', {
      expiresIn: '120s'
    });

    let data = user[0]
    delete data.password

    res.status(200).json({
      status: true,
      message: 'login success',
      token: token,
      data: data
    })
  } else {
    res.status(400).json({
      status: false,
      message: 'login failed, email or password does not matched',
      data: null
    })
  }
})

app.get('/protected', authenticateToken, (req, res)=>{
  console.log(req.user);
  res.json({
    message: 'protected route'
  })
})

app.listen(3000, ()=>{
  console.log('running...');
})
