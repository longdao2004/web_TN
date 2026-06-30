import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductBatchDto } from './create-product-batch.dto';

export class UpdateProductBatchDto extends PartialType(
  OmitType(CreateProductBatchDto, ['productId'] as const),
) {}
