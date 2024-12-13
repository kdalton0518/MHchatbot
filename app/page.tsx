// import "@/utils/axios";
import { Box, Container, Divider, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container sx={{ py: 8 }} maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" align="justify">
          <b>Welcome</b> to the <b>MHChatbot</b>! Take control of your mental
          health with our 24/7 counseling chatbot. Whether you&apos;re feeling
          stressed, anxious, or just need someone to talk to, we&apos;re here to
          listen and support you anytime, anywhere. Get personalized coping
          strategies, emotional insights, and compassionate guidance—all in a
          safe, private, and judgment-free space. Your mental wellness is just a
          message away
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Features
        </Typography>
        <Divider />
      </Box>
    </Container>
  );
}
