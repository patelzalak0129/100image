
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ImageUploadForm from '@/components/ImageUploadForm';
import ImageGallery from '@/components/ImageGallery';
import { ImageData } from '@/components/ImageCard';
import { uploadImage, getImages, deleteImage } from '@/services/api';
import { ImagePlus, Images } from 'lucide-react';

const Index = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery');
  const { toast } = useToast();

  // Extract unique tags from all images
  const uniqueTags = Array.from(
    new Set(images.flatMap(image => image.tags))
  );

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const data = await getImages();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: 'Failed to load images',
        description: 'There was a problem retrieving the images',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (formData: FormData) => {
    try {
      const newImage = await uploadImage(formData);
      setImages(prev => [newImage, ...prev]);
      setActiveTab('gallery');
      toast({
        title: 'Image uploaded',
        description: 'Your image has been uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your image',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteImage(id);
      setImages(prev => prev.filter(image => image._id !== id));
      toast({
        title: 'Image deleted',
        description: 'The image has been removed successfully',
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'There was a problem deleting the image',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Image Gallery</h1>
          <p className="text-gray-600">Upload, manage and organize your images with tags</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images size={16} />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <ImagePlus size={16} />
              <span>Upload New</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="mt-6">
            <ImageGallery 
              images={images} 
              isLoading={isLoading} 
              onDeleteImage={handleDeleteImage} 
              uniqueTags={uniqueTags}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <ImageUploadForm onImageUpload={handleImageUpload} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
