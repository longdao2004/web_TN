import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Khách hàng đánh giá sản phẩm' })
  create(@Req() req: any, @Body() createReviewDto: CreateReviewDto) {
    // Truyền userId lấy từ JWT vào service
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  // Lưu ý: Route này KHÔNG có UseGuards vì đánh giá sản phẩm thường là Public (ai cũng xem được)
  @Get('product/:productId')
  @ApiOperation({ summary: 'Lấy toàn bộ đánh giá của 1 sản phẩm cụ thể' })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Khách hàng tự sửa đánh giá của mình' })
  update(@Req() req: any, @Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(req.user.userId, id, updateReviewDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Khách hàng tự xóa hoặc Admin xóa đánh giá' })
  remove(@Req() req: any, @Param('id') id: string) {
    // Truyền xuống cả userId và userRole để xử lý phân quyền phức tạp bên trong Service
    return this.reviewsService.remove(req.user.userId, req.user.role, id);
  }
}
