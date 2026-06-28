import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

// Khi cập nhật đánh giá, người dùng chỉ được phép đổi rating và comment, không được đổi productId
export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['productId'] as const),
) {}
