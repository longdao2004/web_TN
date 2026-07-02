import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Role } from '../auth/role.enum';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo chứng nhận mới cho sản phẩm.
   * Logic kiểm tra: Chỉ Seller sở hữu sản phẩm mới được phép tạo chứng nhận.
   */
  async create(userId: string, createCertificateDto: CreateCertificateDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: createCertificateDto.productId, deletedAt: null },
      include: { store: true },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (product.store.ownerId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền thêm chứng nhận cho sản phẩm này',
      );
    }

    return this.prisma.certificate.create({
      data: {
        productId: createCertificateDto.productId,
        name: createCertificateDto.name,
        imageUrl: createCertificateDto.imageUrl,
        issueDate: new Date(createCertificateDto.issueDate),
      },
    });
  }

  /**
   * Lấy danh sách chứng nhận của một sản phẩm.
   */
  async findByProduct(productId: string) {
    return this.prisma.certificate.findMany({
      where: { productId },
      orderBy: { issueDate: 'desc' }, // Chứng nhận mới nhất hiện trước
    });
  }

  /**
   * Cập nhật thông tin chứng nhận
   */
  async update(
    userId: string,
    certificateId: string,
    updateCertificateDto: UpdateCertificateDto,
  ) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { product: { include: { store: true } } },
    });

    if (!certificate) {
      throw new NotFoundException('Chứng nhận không tồn tại');
    }

    if (certificate.product.store.ownerId !== userId) {
      throw new ForbiddenException(
        'Bạn không có quyền cập nhật chứng nhận này',
      );
    }

    const updateData: any = { ...updateCertificateDto };
    if (updateData.issueDate)
      updateData.issueDate = new Date(updateData.issueDate);

    return this.prisma.certificate.update({
      where: { id: certificateId },
      data: updateData,
    });
  }

  /**
   * Xóa chứng nhận
   */
  async remove(userId: string, userRole: string, certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: { product: { include: { store: true } } },
    });

    if (!certificate) {
      throw new NotFoundException('Chứng nhận không tồn tại');
    }

    // Phân quyền: Seller chủ hoặc Admin
    if (
      certificate.product.store.ownerId !== userId &&
      userRole !== Role.ADMIN
    ) {
      throw new ForbiddenException('Bạn không có quyền xóa chứng nhận này');
    }

    await this.prisma.certificate.delete({
      where: { id: certificateId },
    });

    return { message: 'Xóa chứng nhận thành công' };
  }
}
