import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCertificateDto } from './create-certificate.dto';

export class UpdateCertificateDto extends PartialType(
  OmitType(CreateCertificateDto, ['productId'] as const),
) {}
