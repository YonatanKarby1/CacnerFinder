import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { X, TriangleAlert as AlertTriangle, Clock, Calendar } from 'lucide-react-native';
import styles from './styles/report.styles';
import { usePhoto } from '../PhotoContext';
import { MalenomaCatagories } from '@/app/common/malenomaCatagories';
import { AnimatedSandClock } from './components/AnimatedSandClock';
import { TakeAnotherPhotoPage } from './components/takeAnotherPhotoPage';

interface AnalysisResult {
  catagory: MalenomaCatagories;
  confidence: number;
}

const getRiskColor = (catagory: string) => {
  switch (catagory) {
    case MalenomaCatagories.Malignant:
      return '#ef4444';
    case MalenomaCatagories.Benign:
      return '#10b981';
    default:
      return '#6b7280';
  }
};

const getRiskIcon = (catagory: string) => {
  switch (catagory) {
    case MalenomaCatagories.Malignant:
      return <Clock size={32} color="#10b981" strokeWidth={2} />;
    case MalenomaCatagories.Benign:
      return <Clock size={32} color="#f59e0b" strokeWidth={2} />;
    default:
      return <Clock size={32} color="#6b7280" strokeWidth={2} />;
  }
};

const getRiskTitle = (catagory: string) => {
  switch (catagory) {
    case MalenomaCatagories.Malignant:
      return 'Mole might be cancerous';
    case MalenomaCatagories.Benign:
      return 'Mole is not cancerous';
    default:
      return 'Analysis Complete';
  }
};

const getRiskDescription = (catagory: string) => {
  switch (catagory) {
    case MalenomaCatagories.Malignant:
      return 'The analyzed mole shows characteristics typical of malignant lesions. Please consult a dermatologist as soon as possible.';
    case MalenomaCatagories.Benign:
      return 'The analyzed mole shows characteristics typical of benign lesions. Continue regular monitoring.';
    default:
      return 'Analysis completed successfully.';
  }
};

const makeBackendRequest = async (imageBase64: string) => {
  console.log("sending request to backend")
  const result = await fetch('http://10.0.0.27:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: imageBase64 }),
  });
  const data = await result.json();
  
  return {
    catagory: data['category'],
    confidence: data['confidence']
  } as AnalysisResult
}

export default function ReportScreen() {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { photo } = usePhoto();

  useEffect(() => {
    console.log("Here");
    setIsAnalyzing(true);
    if (photo && photo.base64) {
      analyzeImage();
    } else {
      setIsAnalyzing(false);
    }
  }, [photo]);

  const analyzeImage = async () => {
    try {
      const result = await makeBackendRequest(photo!.base64!.replace(/^data:image\/\w+;base64,/, ''));
      setAnalysisResult(result);
      setIsAnalyzing(false);

    } catch (error) {
      console.error('Analysis failed:', error);
      setIsAnalyzing(false);
    }
  };

  if (!photo) {
    return <TakeAnotherPhotoPage title="No Photo Found" description="No photo was found for analysis. Please take a new photo." />
  }

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="#6b7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.analyzingContainer}>
          <Image source={{ uri: photo!.uri }} style={styles.analyzingImage} />
          <Text style={styles.analyzingTitle}>Analyzing Your Mole</Text>
          <Text style={styles.analyzingText}>
            Our AI is carefully examining the image for various characteristics...
          </Text>
          <View>
            <AnimatedSandClock texts={['Image quality check', 'Feature extraction', 'Pattern analysis', 'Risk assessment']} />
          </View>
        </View>
      </View>
    );
  }

  if (!analysisResult) {
    return <TakeAnotherPhotoPage title="Analysis Failed" description="We couldn't analyze your image. Please try again with a clearer photo." />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#6b7280" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Report</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo!.uri }} style={styles.reportImage} />
        </View>

        <View style={styles.resultContainer}>
          <View style={[styles.resultHeader, { backgroundColor: `${getRiskColor(analysisResult.catagory)}15` }]}>
            {getRiskIcon(analysisResult.catagory)}
            <View style={styles.resultTextContainer}>
              <Text style={[styles.resultTitle, { color: getRiskColor(analysisResult.catagory) }]}>
                {getRiskTitle(analysisResult.catagory)}
              </Text>
              <Text style={styles.confidenceText}>
                {analysisResult.confidence}% confidence
              </Text>
            </View>
          </View>

          <Text style={styles.resultDescription}>
            {getRiskDescription(analysisResult.catagory)}
          </Text>
        </View>

        <View style={styles.disclaimerContainer}>
          <AlertTriangle size={20} color="#f59e0b" strokeWidth={2} />
          <Text style={styles.disclaimerText}>
            This analysis is for informational purposes only and should not replace professional medical advice. 
            Always consult with a healthcare provider for proper diagnosis and treatment.
          </Text>
        </View>
        <View style={{ width: '50%', alignSelf: 'center' }}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)')}>
            <Calendar size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.primaryButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}