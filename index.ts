import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()
app.use(cors())
app.use(express.json())
const PORT = 3001

app.get(`/users`, async (req, res) => {
    const users = await prisma.user.findMany({ include: { orders: { include: { item: true } } } })
    res.send(users)
})

app.get(`/users/:id`, async (req, res) => {
    const id = Number(req.params.id)

    try {
        const user = await prisma.user.findUnique({ where: { id }, include: { orders: { include: { item: true } } } })
        if (user) {
            res.send(user)
        }
        else {
            res.status(404).send({ error: 'User not found' })
        }
    }
    catch (error) {
        res.status(400).send({ error: 'Error' })
    }
})

app.get(`/items`, async (req, res) => {
    const items = await prisma.item.findMany()
    res.send(items)
})

app.get(`/items/:id`, async (req, res) => {
    const id = Number(req.params.id)
    try {
        const item = await prisma.item.findUnique({ where: { id }, include: { orders: { include: { user: true } } } })
        if (item) {
            res.send(item)
        }
        else {
            res.status(404).send({ error: 'Item not found' })
        }
    }
    catch (error) {
        res.status(400).send({ error: 'Error' })
    }
})

app.get(`/orders`, async (req, res) => {
    const orders = await prisma.order.findMany()
    res.send(orders)
})

app.get(`/orders/:id`, async (req, res) => {
    const id = Number(req.params.id)

    try {
        const order = await prisma.order.findUnique({ where: { id } })
        if (order) {
            res.send(order)
        }
        else {
            res.status(404).send({ error: 'Order not found' })
        }
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
})

app.post(`/items`, async (req, res) => {
    const { title, image } = req.body
    try {
        const item = await prisma.item.create({ data: { title, image } })
        res.send(item)
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
})

app.post(`/orders`, async (req, res) => {
    const { quantity, userId, itemId } = req.body
    try {
        const order = await prisma.order.create({ data: { quantity, itemId, userId } })
        res.send(order)
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
})

app.delete(`/orders/:id`, async (req, res) => {
    const id = Number(req.params.id)
    try {
        const order = await prisma.order.delete({ where: { id: id } })
        res.send(order)
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
})

app.patch(`/users/:id`, async (req, res) => {
    const id = Number(req.params.id)
    const { email, name } = req.body

    try {
        const user = await prisma.user.update({
            where: { id }, data: { email: email, name: name },
            include: { orders: { include: { item: true } } }
        })
        if (user) {
            res.send(user)
        }
        else {
            res.status(404).send({ error: `User not found` })
        }
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
})

app.listen(PORT, () => {
    console.log(`Server up and running: http://localhost:${PORT}`)
})