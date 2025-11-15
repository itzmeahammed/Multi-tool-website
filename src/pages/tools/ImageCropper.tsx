import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Download, XCircle, Crop as CropIcon, RefreshCw } from 'lucide-react';

function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: any[],
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(fn, waitTime);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const ImageCropper = () => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [croppedUrl, setCroppedUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
      setError(null);
      setCroppedUrl('');
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.dataTransfer.files[0]);
      setError(null);
      setCroppedUrl('');
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(crop);
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop],
  );

  async function canvasPreview(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: Crop
  ) {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();
    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );
    ctx.restore();
  }

  const handleCrop = () => {
    if (!previewCanvasRef.current) {
      setError('Crop canvas does not exist');
      return;
    }
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        setError('Failed to create blob');
        return;
      }
      setCroppedUrl(URL.createObjectURL(blob));
    });
  };

  const reset = () => {
    setImgSrc('');
    setCroppedUrl('');
    setError(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Image Cropper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Crop images with a real-time preview.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {error && (
            <motion.div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center mb-6">
              <XCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </motion.div>
          )}

          {!imgSrc ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload an Image</p>
              <p className="text-gray-500 dark:text-gray-400">Click to browse or drag and drop</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div>
              <div className="flex justify-center mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={16 / 9}
                >
                  <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop me" style={{ maxHeight: '70vh' }} />
                </ReactCrop>
              </div>

              {!!completedCrop && (
                <div className='flex flex-col items-center mb-4'>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Preview</h3>
                  <canvas ref={previewCanvasRef} style={{ objectFit: 'contain', width: completedCrop.width, height: completedCrop.height }} />
                </div>
              )}

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleCrop}
                  disabled={!completedCrop}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <CropIcon className="mr-2" /> Crop Image
                </button>
                {croppedUrl && (
                  <a
                    href={croppedUrl}
                    download="cropped-image.png"
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Download className="mr-2" /> Download
                  </a>
                )}
                <button onClick={reset} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center">
                  <RefreshCw className="mr-2" /> Reset
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageCropper;

