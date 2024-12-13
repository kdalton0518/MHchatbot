"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import { useSnackBar } from "@/components/providers/snackbar";
import { moduleService } from "@/utils";

interface PredictionResult {
  problem_type: string;
  response_type: string;
  confidence: number;
  likely_issues: string[];
  recommended_approach: string;
}

export default function MLclassification() {
  const [patientDescription, setPatientDescription] = useState("");
  const [predictions, setPredictions] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackBar } = useSnackBar();

  const handlePredict = async () => {
    if (!patientDescription.trim()) {
      showSnackBar("Please enter a patient description", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await moduleService.predict_response_type({
        description: patientDescription,
      });
      setPredictions(response.data);
      showSnackBar("Prediction completed successfully", "success");
    } catch (error) {
      showSnackBar("Error performing prediction", "error");
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Response Predictor Using Machine Learning Model
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter a description of the patient&apos;s situation to predict the
          likely response type and recommended approach.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Patient Description"
            variant="outlined"
            value={patientDescription}
            onChange={(e) => setPatientDescription(e.target.value)}
            placeholder="Describe the patient's situation, symptoms, or concerns..."
          />
        </Box>

        <Button
          variant="contained"
          onClick={handlePredict}
          disabled={loading}
          sx={{ mb: 4 }}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Analyzing...
            </>
          ) : (
            "Predict Response"
          )}
        </Button>

        {predictions && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prediction Results
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Problem Type:
                </Typography>
                <Chip
                  label={predictions.problem_type}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Predicted Response Type:
                </Typography>
                <Chip
                  label={predictions.response_type}
                  color="secondary"
                  sx={{ mt: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Confidence: {(predictions.confidence * 100).toFixed(1)}%
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Likely Associated Issues:
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                  {predictions.likely_issues.map((issue, index) => (
                    <Chip
                      key={index}
                      label={issue}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="primary">
                  Recommended Approach:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {predictions.recommended_approach}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}
