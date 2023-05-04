const express = require('express')
const app = express()
app.use(express.json())
const uuid= require('uuid')

const users =[]

const checkOrderId = (request, response, next) =>{
    const { id } = request.params
    const index = users.findIndex(user => user.id === id)

    if (index < 0 ){
        return response.status(404).json({error: "Order not found."})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkUrl = (request, respose, next) =>{
    const method = request.method
    const url = request.url

    console.log(`Method used: ${method}, and Url used: ${url}`)

    next()
}

app.get('/order',checkUrl , (request,response) => {
   return response.json(users)
})

app.get('/order/:id', checkOrderId, checkUrl , (request, response) =>{
    const index = request.orderIndex
    const order = users[index]

    return response.json(order)
})

app.post('/order', checkUrl ,(request,response) => {
    const {order , clienteName , price , status} = request.body
    const user = {id:uuid.v4(), order , clienteName , price , status}
    users.push(user)

    return response.status(201).json(user)
 })

app.put('/order/:id', checkOrderId,checkUrl ,(request,response) => {
    const {order , clienteName , price , status} = request.body

    const index = request.orderIndex
    const id = users[index]

    const upudater = {order , clienteName , price , status}
  
    users[index]= upudater
    return response.json(upudater)
})

app.delete('/order/:id',checkUrl , (request,response) => {
    const {id} = request.params
    const index = users.findIndex(user=>user.id === id)

    if(index <0){
   return response.status(401).json({message:"user not found"})
    }
    
    users.splice(index,1)
   return response.status(204).json({message:"Deletado com sucesso"})
})

app.patch('/order/:id', checkOrderId, checkUrl, (request, response) =>{
    const index = request.orderIndex

    const order = users[index]
    order.status = "Pedido Pronto"

    return response.json(order)
})


app.listen(3000,()=>{

    console.log('server start on')
})