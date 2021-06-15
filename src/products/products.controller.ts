import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductDto } from './product.model';

import { ProductsService } from './products.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //   @UseGuards(JwtAuthGuard)
  @Post()
  async addProduct(@Body() createProductDto: ProductDto) {
    const generatedId = await this.productsService.createProduct(
      createProductDto,
    );
    return { id: generatedId };
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts() {
    const products = await this.productsService.findAllProducts();
    return products;
  }

  //   @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProduct(@Param('id') prodId: string) {
    const product = await this.productsService.findOneProduct(prodId);
    return product;
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') prodId: string,
    @Body() createProductDto: ProductDto,
  ) {
    return this.productsService.updateProduct(prodId, createProductDto);
  }

  //   @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeProduct(@Param('id') prodId: string) {
    await this.productsService.deleteProduct(prodId);
    return null;
  }
}
