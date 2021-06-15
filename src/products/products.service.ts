import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product, ProductDocument } from './product.entity';
import { ProductDto } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createProduct(productDto: ProductDto) {
    const newProduct = new this.productModel(productDto);
    const result = await newProduct.save();
    return result.id;
  }

  async findAllProducts() {
    const products = await this.productModel.find().exec();
    return products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    })) as ProductDto[];
  }

  async findOneProduct(productId: string) {
    const product = await this.findProductAsync(productId);
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    } as ProductDto;
  }

  async updateProduct(prodId: string, productDto: ProductDto) {
    return this.productModel
      .findByIdAndUpdate({ _id: prodId }, { $set: productDto }, { new: true })
      .exec();
  }

  async deleteProduct(prodId: string) {
    try {
      await this.productModel.deleteOne({ _id: prodId }).exec();
    } catch (err) {
      throw new NotFoundException('Produto não encontrado.');
    }
  }

  private async findProductAsync(id: string): Promise<ProductDto> {
    let product;
    try {
      product = await this.productModel.findById(id);
      return product;
    } catch (err) {
      throw new NotFoundException('Produto não encontrado.');
    }
  }
}
