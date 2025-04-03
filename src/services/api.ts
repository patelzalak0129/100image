
import axios from 'axios';
import { ImageData } from '@/components/ImageCard';

// Base API URL - in a real app, get this from environment variables
const API_URL = 'http://localhost:5000/api';

// For development/demo: Mock data to use while backend is not connected
const MOCK_IMAGES: ImageData[] = [
  {
    _id: '1',
    title: 'Mountain Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    tags: ['nature', 'mountains', 'landscape'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'City Skyline',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df',
    tags: ['city', 'urban', 'architecture'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Beach Sunset',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    tags: ['beach', 'sunset', 'ocean'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Forest Path',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    tags: ['nature', 'forest', 'trees'],
    createdAt: new Date().toISOString()
  }
];

// Flag to toggle between real API and mock data
const USE_MOCK_DATA = true;

// Upload a new image
export const uploadImage = async (formData: FormData): Promise<ImageData> => {
  if (USE_MOCK_DATA) {
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock response
    const mockId = Math.random().toString(36).substring(2, 15);
    const title = formData.get('title') as string;
    const tagsArray: string[] = [];
    formData.getAll('tags').forEach(tag => tagsArray.push(tag as string));
    
    const mockImage: ImageData = {
      _id: mockId,
      title,
      imageUrl: 'https://source.unsplash.com/random/800x600?' + tagsArray.join(','),
      tags: tagsArray,
      createdAt: new Date().toISOString()
    };
    
    return mockImage;
  }
  
  const response = await axios.post(`${API_URL}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

// Get all images or filter by tag
export const getImages = async (tag?: string): Promise<ImageData[]> => {
  if (USE_MOCK_DATA) {
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter mock data if tag is provided
    if (tag) {
      return MOCK_IMAGES.filter(img => img.tags.includes(tag));
    }
    
    return MOCK_IMAGES;
  }
  
  const url = tag ? `${API_URL}/images?tag=${tag}` : `${API_URL}/images`;
  const response = await axios.get(url);
  
  return response.data;
};

// Delete an image
export const deleteImage = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }
  
  await axios.delete(`${API_URL}/images/${id}`);
};
