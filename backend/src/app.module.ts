import { Module } from '@nestjs/common';
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

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, AuthModule, CloudinaryModule, CartModule, OrderModule, StatisticsModule, UsersModule, StoresModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
