import multer from "multer";

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

//* Filtrado de archivos: solo imágenes
const fileFilter = (req, file, cb) => {
    // archivos permitidos
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes"), false);
    }

    // if (file.mimetype.startsWith("image/")) {
    //    cb(null, true);
    // } else {
    //    cb(new Error("Solo se permiten imágenes"), false);
    // }
};

// Configuración de Multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

export default upload;
