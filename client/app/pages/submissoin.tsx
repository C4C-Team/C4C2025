const {VertexAI} = require('@google-cloud/vertexai');

// Helper function to convert File to base64
const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * TODO(developer): Update these variables before running the sample.
 */
// Modified analyze function to accept a File
async function analyze_all_modalities(projectId = 'PROJECT_ID', imageFile: File) {
  const vertexAI = new VertexAI({project: projectId, location: 'us-central1'});

  const generativeModel = vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash-001',
  });

  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);

  const imageFilePart = {
    inline_data: {
      data: base64Image,
      mime_type: imageFile.type, // This will be something like 'image/jpeg' or 'image/png'
    },
  };

  const prompt = {
    text: `
    Look at the photo and read the given description carefully. Identify if the photo does contain trash or not. If it does, please provide the following information:
    - a severity rating from 1 to 3 (1 being the least severe and 3 being the most severe) of the trash, relating to the size or danger of the trash in the image.
    - the assortment of tags that match the image, from this list, recycable, non-recycable, organic, and other.`,
  };

  const request = {
    contents: [{role: 'user', parts: [imageFilePart, prompt]}],
  };

  const resp = await generativeModel.generateContent(request);
  const contentResponse = await resp.response;
  console.log(JSON.stringify(contentResponse));
}

// Example usage in a React component
const SubmissionComponent = () => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await analyze_all_modalities('your-project-id', file);
      } catch (error) {
        console.error('Error analyzing image:', error);
      }
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload}
      />
    </div>
  );
};