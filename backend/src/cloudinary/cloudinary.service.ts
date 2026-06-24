import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

// Đã sửa dòng này: Dùng require thay cho import * as
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  
  // Hàm nhận file từ người dùng và đẩy lên Cloudinary
  async uploadImage(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'nong_san' }, // Ảnh sẽ được gom gọn vào thư mục này trên Cloud
        (error, result) => {
          if (error) return reject(error);
          resolve(result); // Trả về toàn bộ thông tin ảnh (bao gồm link URL)
        },
      );
      
      // Chuyển đổi dữ liệu thô (buffer) thành stream để đẩy đi
      toStream(file.buffer).pipe(upload);
    });
  }
}