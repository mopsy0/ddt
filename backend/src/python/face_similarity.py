#!/usr/bin/env python3
"""
Face similarity detection using DeepFace library
This script handles face recognition, similarity comparison, and analysis
"""

import sys
import json
import os
import logging
from typing import List, Dict, Any, Optional
import requests
from io import BytesIO
import tempfile

try:
    from deepface import DeepFace
    import cv2
    import numpy as np
    from PIL import Image
except ImportError as e:
    print(json.dumps({"error": f"Missing required packages: {str(e)}"}))
    sys.exit(1)

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

class FaceSimilarityService:
    """Service for face similarity detection and analysis"""
    
    def __init__(self):
        self.models = ['VGG-Face', 'Facenet', 'OpenFace', 'DeepFace']
        self.default_model = 'VGG-Face'
        self.distance_metrics = ['cosine', 'euclidean', 'euclidean_l2']
        self.default_metric = 'cosine'
    
    def download_image(self, url: str) -> Optional[str]:
        """Download image from URL to temporary file"""
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                temp_file.write(response.content)
                return temp_file.name
        except Exception as e:
            logger.error(f"Error downloading image from {url}: {str(e)}")
            return None
    
    def cleanup_temp_file(self, file_path: str):
        """Clean up temporary file"""
        try:
            if os.path.exists(file_path):
                os.unlink(file_path)
        except Exception as e:
            logger.error(f"Error cleaning up temp file {file_path}: {str(e)}")
    
    def verify_face_exists(self, image_path: str) -> bool:
        """Check if image contains a face"""
        try:
            # Use DeepFace to detect faces
            faces = DeepFace.extract_faces(
                img_path=image_path,
                detector_backend='opencv',
                enforce_detection=False
            )
            return len(faces) > 0
        except Exception as e:
            logger.error(f"Error verifying face in {image_path}: {str(e)}")
            return False
    
    def analyze_face(self, image_path: str) -> Dict[str, Any]:
        """Analyze face in image for emotions, age, gender"""
        try:
            analysis = DeepFace.analyze(
                img_path=image_path,
                actions=['age', 'gender', 'emotion'],
                detector_backend='opencv',
                enforce_detection=False
            )
            
            if isinstance(analysis, list):
                analysis = analysis[0]
            
            return {
                'hasFace': True,
                'faceCount': 1,
                'age': analysis.get('age', 0),
                'gender': analysis.get('dominant_gender', 'unknown'),
                'emotions': analysis.get('emotion', {})
            }
        except Exception as e:
            logger.error(f"Error analyzing face in {image_path}: {str(e)}")
            return {
                'hasFace': False,
                'faceCount': 0
            }
    
    def compare_faces(self, image1_path: str, image2_path: str) -> float:
        """Compare similarity between two faces"""
        try:
            # Verify both images have faces
            if not self.verify_face_exists(image1_path) or not self.verify_face_exists(image2_path):
                return 0.0
            
            result = DeepFace.verify(
                img1_path=image1_path,
                img2_path=image2_path,
                model_name=self.default_model,
                distance_metric=self.default_metric,
                enforce_detection=False
            )
            
            # Convert distance to similarity score (0-100)
            distance = result.get('distance', 1.0)
            threshold = result.get('threshold', 0.68)
            
            # Convert to similarity percentage
            if distance < threshold:
                similarity = max(0, min(100, (1 - distance / threshold) * 100))
            else:
                similarity = max(0, min(50, (1 - distance) * 50))
            
            return round(similarity, 2)
        except Exception as e:
            logger.error(f"Error comparing faces: {str(e)}")
            return 0.0
    
    def find_similar_faces(self, target_image_path: str, user_data: List[Dict], max_results: int) -> List[Dict]:
        """Find users with similar faces to target image"""
        results = []
        
        if not self.verify_face_exists(target_image_path):
            return results
        
        for user in user_data:
            user_id = user['id']
            photos = user.get('photos', [])
            
            if not photos:
                continue
            
            # Calculate similarity with first photo (profile picture)
            main_photo_url = photos[0]
            temp_photo_path = self.download_image(main_photo_url)
            
            if not temp_photo_path:
                continue
            
            try:
                similarity = self.compare_faces(target_image_path, temp_photo_path)
                
                if similarity > 30:  # Minimum similarity threshold
                    results.append({
                        'id': user_id,
                        'similarity': similarity,
                        'name': user.get('name', ''),
                        'age': user.get('age', 0),
                        'occupation': user.get('occupation', ''),
                        'photos': photos,
                        'bio': user.get('bio', ''),
                        'location': user.get('location', {})
                    })
            except Exception as e:
                logger.error(f"Error processing user {user_id}: {str(e)}")
            finally:
                self.cleanup_temp_file(temp_photo_path)
        
        # Sort by similarity score (highest first)
        results.sort(key=lambda x: x['similarity'], reverse=True)
        
        return results[:max_results]

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Insufficient arguments"}))
        return
    
    service = FaceSimilarityService()
    
    try:
        if len(sys.argv) == 3 and sys.argv[2] == 'analyze':
            # Single image analysis
            image_path = sys.argv[1]
            result = service.analyze_face(image_path)
            print(json.dumps(result))
        
        elif len(sys.argv) == 4 and sys.argv[2] == 'compare':
            # Compare two images
            image1_path = sys.argv[1]
            image2_path = sys.argv[2]
            similarity = service.compare_faces(image1_path, image2_path)
            print(json.dumps({"similarity": similarity}))
        
        elif len(sys.argv) >= 4:
            # Find similar faces
            target_image_path = sys.argv[1]
            user_data_json = sys.argv[2]
            max_results = int(sys.argv[3]) if len(sys.argv) > 3 else 20
            
            user_data = json.loads(user_data_json)
            results = service.find_similar_faces(target_image_path, user_data, max_results)
            print(json.dumps(results))
        
        else:
            print(json.dumps({"error": "Invalid arguments"}))
    
    except Exception as e:
        logger.error(f"Main function error: {str(e)}")
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()