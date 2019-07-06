import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const product = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }
  return Product.findById(args.id)
    .lean()
    .exec()
}

const newProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }

  console.log('user id is ', ctx.user._id)

  return Product.create({ ...args.input, createdBy: ctx.user._id })
}

const products = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError()
  }

  return Product.find({})
    .lean()
    .exec()
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }

  const update = args.input
  return Product.findByIdAndUpdate(args.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError()
  }

  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

const createdBy = (product, args, ctx) => {
  // return _.createdBy
  return User.findById(product.createdBy)
    .lean()
    .exec() // queries product's createdBy
}

const __resolveType = product => {
  return productsTypeMatcher[product]
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
    createdBy,
    __resolveType(product) {}
  }
}
