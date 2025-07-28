import { PythonShell } from 'python-shell';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import User from '../models/User';
import { LookalikeRequest, IUser } from '../types';
import { uploadBase64ToCloudinary } from '../middleware/upload';

/**
 * Lookalike matching service using DeepFace
 */
export class LookalikeService {
  private static pythonScriptPath = path.join(__dirname, '../python/face_similarity.py');

  /**
   * Find users with similar faces to the uploaded photo
   */
  static async findLookalikes(
    userId: string,
    photoBuffer: Buffer,
    maxResults: number = 20
  ): Promise<IUser[]> {
    try {
      // Process and save the uploaded image temporarily
      const processedImagePath = await this.processUploadedImage(photoBuffer);

      // Get all active users (excluding the requesting user)
      const allUsers = await User.find({
        _id: { $ne: userId },
        isActive: true,
        photos: { $exists: true, $not: { $size: 0 } }
      }).select('_id name age occupation photos bio location');

      if (allUsers.length === 0) {
        return [];
      }

      // Find similar faces using Python/DeepFace
      const similarUsers = await this.findSimilarFaces(
        processedImagePath,
        allUsers,
        maxResults
      );

      // Clean up temporary file
      this.cleanupTempFile(processedImagePath);

      return similarUsers;
    } catch (error) {
      console.error('Error finding lookalikes:', error);
      return [];
    }
  }

  /**
   * Process uploaded image for face recognition
   */
  private static async processUploadedImage(photoBuffer: Buffer): Promise<string> {
    const tempDir = path.join(__dirname, '../temp');
    
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `upload_${Date.now()}.jpg`);

    // Process image with Sharp (resize, format, optimize)
    await sharp(photoBuffer)
      .resize(800, 800, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(tempFilePath);

    return tempFilePath;
  }

  /**
   * Use Python script with DeepFace to find similar faces
   */
  private static async findSimilarFaces(
    uploadedImagePath: string,
    users: IUser[],
    maxResults: number
  ): Promise<IUser[]> {
    return new Promise((resolve, reject) => {
      // Prepare user data for Python script
      const userData = users.map(user => ({
        id: user._id.toString(),
        photos: user.photos,
        name: user.name,
        age: user.age,
        occupation: user.occupation,
        bio: user.bio,
        location: user.location
      }));

      const options = {
        mode: 'json' as const,
        pythonPath: process.env.PYTHON_PATH || 'python3',
        pythonOptions: ['-u'], // unbuffered stdout
        scriptPath: path.dirname(this.pythonScriptPath),
        args: [
          uploadedImagePath,
          JSON.stringify(userData),
          maxResults.toString()
        ]
      };

      PythonShell.run('face_similarity.py', options, (err, results) => {
        if (err) {
          console.error('Python script error:', err);
          reject(err);
          return;
        }

        try {
          // Parse results from Python script
          const similarityResults = results?.[0] as any[];
          
          if (!Array.isArray(similarityResults)) {
            resolve([]);
            return;
          }

          // Convert results back to User objects with similarity scores
          const similarUsers = similarityResults.map(result => {
            const user = users.find(u => u._id.toString() === result.id);
            if (user) {
              // Add similarity score as a virtual property
              (user as any).similarityScore = result.similarity;
            }
            return user;
          }).filter(Boolean) as IUser[];

          resolve(similarUsers);
        } catch (parseError) {
          console.error('Error parsing Python results:', parseError);
          resolve([]);
        }
      });
    });
  }

  /**
   * Analyze face similarity between two images
   */
  static async analyzeFaceSimilarity(
    image1Buffer: Buffer,
    image2Buffer: Buffer
  ): Promise<number> {
    try {
      const image1Path = await this.processUploadedImage(image1Buffer);
      const image2Path = await this.processUploadedImage(image2Buffer);

      const similarity = await this.compareTwoFaces(image1Path, image2Path);

      // Clean up temporary files
      this.cleanupTempFile(image1Path);
      this.cleanupTempFile(image2Path);

      return similarity;
    } catch (error) {
      console.error('Error analyzing face similarity:', error);
      return 0;
    }
  }

  /**
   * Compare two faces using DeepFace
   */
  private static async compareTwoFaces(
    image1Path: string,
    image2Path: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'json' as const,
        pythonPath: process.env.PYTHON_PATH || 'python3',
        pythonOptions: ['-u'],
        scriptPath: path.dirname(this.pythonScriptPath),
        args: [image1Path, image2Path, 'compare']
      };

      PythonShell.run('face_similarity.py', options, (err, results) => {
        if (err) {
          console.error('Face comparison error:', err);
          reject(err);
          return;
        }

        try {
          const result = results?.[0] as { similarity: number };
          resolve(result?.similarity || 0);
        } catch (parseError) {
          console.error('Error parsing face comparison result:', parseError);
          resolve(0);
        }
      });
    });
  }

  /**
   * Get face analysis for a single image
   */
  static async analyzeFace(photoBuffer: Buffer): Promise<{
    hasFace: boolean;
    faceCount: number;
    emotions?: Record<string, number>;
    age?: number;
    gender?: string;
  }> {
    try {
      const imagePath = await this.processUploadedImage(photoBuffer);

      const analysis = await this.runFaceAnalysis(imagePath);

      this.cleanupTempFile(imagePath);

      return analysis;
    } catch (error) {
      console.error('Error analyzing face:', error);
      return {
        hasFace: false,
        faceCount: 0
      };
    }
  }

  /**
   * Run face analysis using Python script
   */
  private static async runFaceAnalysis(imagePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'json' as const,
        pythonPath: process.env.PYTHON_PATH || 'python3',
        pythonOptions: ['-u'],
        scriptPath: path.dirname(this.pythonScriptPath),
        args: [imagePath, 'analyze']
      };

      PythonShell.run('face_similarity.py', options, (err, results) => {
        if (err) {
          console.error('Face analysis error:', err);
          reject(err);
          return;
        }

        try {
          const result = results?.[0] || {
            hasFace: false,
            faceCount: 0
          };
          resolve(result);
        } catch (parseError) {
          console.error('Error parsing face analysis result:', parseError);
          resolve({
            hasFace: false,
            faceCount: 0
          });
        }
      });
    });
  }

  /**
   * Clean up temporary files
   */
  private static cleanupTempFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error cleaning up temp file:', error);
    }
  }

  /**
   * Validate that an image contains a clear face
   */
  static async validateFaceImage(photoBuffer: Buffer): Promise<{
    isValid: boolean;
    message: string;
  }> {
    try {
      const analysis = await this.analyzeFace(photoBuffer);

      if (!analysis.hasFace) {
        return {
          isValid: false,
          message: 'No face detected in the image. Please upload a clear photo of your face.'
        };
      }

      if (analysis.faceCount > 1) {
        return {
          isValid: false,
          message: 'Multiple faces detected. Please upload a photo with only one person.'
        };
      }

      return {
        isValid: true,
        message: 'Face detected successfully'
      };
    } catch (error) {
      console.error('Error validating face image:', error);
      return {
        isValid: false,
        message: 'Unable to process image. Please try a different photo.'
      };
    }
  }
}