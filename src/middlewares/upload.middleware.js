// import multer from 'multer'

// const storage = multer.diskStorage({});
// const fileFilter = (req, file, cb) => {
//      console.log("req.body",req.body);
// //   console.log("file",file.originalname);
// //   console.log("file",file.mimetype);

//       if (!file.originalname || file.originalname === 'undefined') {
//     return cb(new Error('File type is missing or invalid.'), false);
//     }
//     // Allow image files
//   if (file.mimetype.startsWith('image/')) {
//     return cb(null, true);
//     }
//     const allowedDocTypes = [
//         'application/pdf',
//         'application/msword',                   // .doc
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
//         'application/vnd.ms-powerpoint',        // .ppt
//         'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
//         'application/vnd.ms-excel',             // .xls
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
//       ];
    
//       if (allowedDocTypes.includes(file.mimetype)) {
//         return cb(null, true);
//     }
//       // Anything else → reject

//     return cb(new Error('Only image or specific document files are allowed.'), false);
// }

//  const upload = multer({
//     storage,
//     fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// // ✅ Middleware for 1 file only (image OR doc)
// // export const singleMarketingUpload = upload.fields([
// //     { name: 'marketingImage', maxCount: 1 },
// //     { name: 'marketingFile', maxCount: 1 }
// //   ]);

// export const singleMarketingUpload = (req, res, next) => {
//   const handler = upload.fields([
//     { name: 'marketingImage', maxCount: 1 },
//     { name: 'marketingFile', maxCount: 1 },
//   ]);

//   handler(req, res, (err) => {
//     if (err instanceof multer.MulterError || err) {
//       return res.status(400).json({
//         success: false,
//         errors: {
//           general: err.message || 'File upload error',
//         },
//       });
//     }
//     next();
//   });
// };


import multer from 'multer';

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'video/mp4',
    'image/png',
    'image/jpeg',
    'application/pdf',
  ];

  // ✅ Allow any video/*
  if (file.mimetype.startsWith('video/')) {
    return cb(null, true);
  }

  // ✅ Allow specific types
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  // ❌ Reject all other types
  return cb(
    new Error('Only MP4 videos, PNG, JPEG images, and PDF files are allowed.'),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});


export const singleMarketingUpload = (req, res, next) => {
  const handler = upload.fields([
    { name: 'marketingImage', maxCount: 1 },
    { name: 'marketingFile', maxCount: 1 },
  ]);

  handler(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({
        success: false,
        errors: {
          general: err.message || 'File upload error',
        },
      });
    }
    next();
  });
};
