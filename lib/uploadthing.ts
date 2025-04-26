// تحميل المكونات المطلوبة من مكتبة UploadThing
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';

// استيراد نوع الراوتر المستخدم في API الخاص بالرفع
import type { OurFileRouter } from '@/app/api/uploadthing/core';

// إنشاء زر ومربع تحميل الملفات بناءً على الراوتر
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
