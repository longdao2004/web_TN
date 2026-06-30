import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { StatisticsModule } from './statistics/statistics.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { MailModule } from './mail/mail.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductBatchesModule } from './product-batches/product-batches.module';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load biến môi trường từ .env
    PrismaModule, CategoriesModule, ProductsModule, AuthModule, CloudinaryModule, CartModule, OrderModule, StatisticsModule, UsersModule, StoresModule, MailModule, ReviewsModule, ProductBatchesModule, CertificatesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
