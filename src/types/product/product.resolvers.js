import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const newProduct = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const product = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  const currProduct = Product.findById(args.id)
    .lean()
    .exec()
  console.log(currProduct)
  return currProduct
}

const products = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return Product.find({})
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role != roles.admin) {
    throw new AuthenticationError()
  }
  const update = args.input
  return Product.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role != roles.admin) {
    throw new AuthenticationError()
  }
  return Product.findOneAndDelete(args.id)
    .lean()
    .exec()
}

const __resolveType = product => {
  productsTypeMatcher.forEach(val => console.log('val is ', val))
}

export default {
  Query: {
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {}
  }
}
